/**
 * ─── Proxy (Next.js 16) ────────────────────────────────────────────────────
 *
 * Reemplaza a middleware.ts en Next.js 16.
 * Se ejecuta antes de cada request para:
 *
 * 1. Refrescar la sesión de Supabase (si el JWT expiró)
 * 2. Verificar autenticación por rol
 * 3. Proteger rutas según el rol del usuario
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Rutas públicas que no requieren autenticación */
const PUBLIC_PATHS = ["/", "/login", "/register"];

/** Roles válidos del sistema */
const VALID_ROLES = ["doctor", "lawyer", "admin"] as const;
type Role = (typeof VALID_ROLES)[number];

/** Prefijos de ruta protegidos por rol */
const ROLE_PREFIXES: Role[] = ["doctor", "lawyer", "admin"];

/** Dashboard por rol — destino de redirección */
const ROLE_DASHBOARD: Record<Role, string> = {
  doctor: "/doctor/dashboard",
  lawyer: "/lawyer/dashboard",
  admin: "/admin/dashboard",
};

function isValidRole(value: string): value is Role {
  return VALID_ROLES.includes(value as Role);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Refrescar sesión de Supabase ──────────────────────────────
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refrescar sesión si el token expiró (IMPORTANTE: siempre usar getUser)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── 2. Rutas de API — pasar sin protección de rol ────────────────
  if (pathname.startsWith("/api")) {
    return supabaseResponse;
  }

  // ── 3. Rutas públicas — pasar siempre ────────────────────────────
  if (PUBLIC_PATHS.includes(pathname)) {
    // Si está autenticado y visita /login, redirigir a su dashboard
    if (pathname === "/login" && user) {
      // Obtener rol de la cookie o del perfil
      const roleCookie = request.cookies.get("sinapsistencia-role")?.value;
      if (roleCookie && isValidRole(roleCookie)) {
        const redirectUrl = new URL(ROLE_DASHBOARD[roleCookie], request.url);
        const redirect = NextResponse.redirect(redirectUrl);
        // Copiar cookies de Supabase al redirect
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirect.cookies.set(cookie.name, cookie.value);
        });
        return redirect;
      }
    }
    return supabaseResponse;
  }

  // ── 4. Verificar autenticación ───────────────────────────────────
  const role = request.cookies.get("sinapsistencia-role")?.value;
  if (!role || !isValidRole(role)) {
    // No autenticado → login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const redirect = NextResponse.redirect(loginUrl);
    // Copiar cookies de Supabase al redirect
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie.name, cookie.value);
    });
    return redirect;
  }

  // ── 5. Verificar que el rol coincide con el prefijo de ruta ──────
  for (const prefix of ROLE_PREFIXES) {
    if (pathname.startsWith(`/${prefix}`)) {
      if (role !== prefix) {
        // Rol incorrecto → redirigir a su propio dashboard
        const redirectUrl = new URL(ROLE_DASHBOARD[role], request.url);
        const redirect = NextResponse.redirect(redirectUrl);
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirect.cookies.set(cookie.name, cookie.value);
        });
        return redirect;
      }
      return supabaseResponse;
    }
  }

  // ── 6. Cualquier otra ruta protegida — pasar ─────────────────────
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Proteger todas las rutas excepto:
     * - _next/static, _next/image (assets del framework)
     * - favicon.ico, archivos estáticos
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
