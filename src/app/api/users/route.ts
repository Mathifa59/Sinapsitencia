import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

/**
 * GET /api/users
 *
 * Lista todos los usuarios (perfiles).
 * Query params: role (doctor | lawyer | admin)
 */
export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (role) {
    query = query.eq("role", role as Database["public"]["Enums"]["user_role"]);
  }

  const { data, error } = await query;

  if (error) {
    return apiError(`Error al obtener usuarios: ${error.message}`, 500);
  }

  const users = (data ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    avatar: u.avatar_url,
    isActive: u.is_active,
    createdAt: u.created_at,
  }));

  return apiSuccess(users);
}

/**
 * POST /api/users
 *
 * Crea un nuevo usuario.
 * Requiere SUPABASE_SERVICE_ROLE_KEY para crear en auth.users.
 * Body: { name, email, role, password? }
 *
 * Flujo:
 * 1. Crea usuario en Supabase Auth (auth.users)
 * 2. El trigger handle_new_user crea automáticamente el perfil en profiles
 * 3. Actualiza el perfil con el rol y nombre correctos
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, role, password } = body;

  if (!name || !email || !role) {
    return apiError("Nombre, email y rol son requeridos", 400);
  }

  // Verificar que el email no esté en uso
  const supabase = await createSupabaseServer();
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return apiError("El email ya está registrado", 409);
  }

  // Usar admin client para crear usuario en auth
  try {
    const { createSupabaseAdmin } = await import("@/lib/supabase/admin");
    const adminClient = createSupabaseAdmin();

    const { data: authUser, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password: password ?? "Sinapsistencia2024!",
        email_confirm: true,
        user_metadata: { name, role },
      });

    if (authError) {
      return apiError(`Error al crear usuario: ${authError.message}`, 500);
    }

    // Actualizar el perfil creado por el trigger con los datos correctos
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .update({ name, role })
      .eq("id", authUser.user.id)
      .select()
      .single();

    if (profileError) {
      return apiError(
        `Usuario creado pero error al actualizar perfil: ${profileError.message}`,
        500
      );
    }

    return apiSuccess(
      {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        isActive: profile.is_active,
        createdAt: profile.created_at,
      },
      201
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido al crear usuario";
    return apiError(message, 500);
  }
}
