import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/auth/login
 *
 * Autentica al usuario con Supabase Auth.
 * Soporta dos modos:
 *   1. Login por email/password → { email, password }
 *   2. Login por rol demo       → { role: "doctor" | "lawyer" | "admin" }
 *
 * Setea la cookie `sinapsistencia-role` que el proxy usa para proteger rutas.
 * La sesión de Supabase se guarda automáticamente en cookies httpOnly.
 */

// Cuentas demo — deben existir en Supabase Auth
const DEMO_ACCOUNTS: Record<string, { email: string; password: string }> = {
  doctor: { email: "doctor.demo@sinapsistencia.pe", password: "Demo123456!" },
  lawyer: { email: "lawyer.demo@sinapsistencia.pe", password: "Demo123456!" },
  admin: { email: "admin.demo@sinapsistencia.pe", password: "Demo123456!" },
};

/** Construye respuesta exitosa con la cookie de rol seteada */
function loginSuccess(
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    avatar: string | null;
  },
  token: string
) {
  const response = NextResponse.json(
    { success: true, data: { user, token } },
    { status: 200 }
  );

  // Setear cookie de rol para el proxy (protección de rutas por rol)
  response.cookies.set("sinapsistencia-role", user.role, {
    path: "/",
    httpOnly: false, // El proxy necesita leerla
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return response;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const body = await request.json();
  const { email, password, role } = body;

  // ── Modo 1: login por rol demo ───────────────────────────────────
  if (role) {
    const demo = DEMO_ACCOUNTS[role as string];
    if (!demo) return apiError("Rol no válido", 400);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: demo.email,
      password: demo.password,
    });

    if (error) {
      return apiError(
        `Cuenta demo "${role}" no disponible. Créala primero en Supabase Auth.`,
        503
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!profile)
      return apiError("Perfil no encontrado para la cuenta demo", 404);

    return loginSuccess(
      {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        isActive: profile.is_active,
        createdAt: profile.created_at,
        avatar: profile.avatar_url,
      },
      data.session.access_token
    );
  }

  // ── Modo 2: login por email + password ───────────────────────────
  if (!email || !password) {
    return apiError("Email y contraseña son requeridos", 400);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return apiError("Credenciales incorrectas", 401);
  }

  // Obtener perfil completo del usuario
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    return apiError("Perfil no encontrado. Contacte al administrador.", 404);
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    return apiError("Tu cuenta ha sido desactivada", 403);
  }

  return loginSuccess(
    {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      isActive: profile.is_active,
      createdAt: profile.created_at,
      avatar: profile.avatar_url,
    },
    data.session.access_token
  );
}
