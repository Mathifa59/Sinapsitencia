/**
 * ─── Proxy (Next.js 16) ────────────────────────────────────────────────────
 *
 * Reemplaza a middleware.ts en Next.js 16.
 * Se ejecuta antes de cada request para:
 *
 * 1. Refrescar la sesión de Supabase (si está configurado)
 * 2. Verificar autenticación por rol
 * 3. Proteger rutas según el rol del usuario
 *
 * Si las variables de Supabase no están configuradas,
 * funciona en modo demo usando solo la cookie de rol.
 */

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

const AUTH_COOKIE = "sinapsistencia-role";

/** Detecta si Supabase está configurado */
const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Preparar response base ──────────────────────────────────────
  let response = NextResponse.next({ request });

  // Si Supabase está configurado, refrescar sesión
  if (hasSupabase) {
    try {
      const { createServerClient } = await import("@supabase/ssr");
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
              response = NextResponse.next({ request });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              );
            },
          },
        }
      );
      // Refrescar sesión si el token expiró
      await supabase.auth.getUser();
    } catch {
      // Supabase no disponible — continuar con cookie de rol
    }
  }

  // ── 2. Rutas de API — pasar sin protección de rol ────────────────
  if (pathname.startsWith("/api")) {
    return response;
  }

  // ── 3. Rutas públicas — pasar siempre ────────────────────────────
  if (PUBLIC_PATHS.includes(pathname)) {
    // Si está autenticado y visita /login, redirigir a su dashboard
    if (pathname === "/login") {
      const roleCookie = request.cookies.get(AUTH_COOKIE)?.value;
      if (roleCookie && isValidRole(roleCookie)) {
        const redirect = NextResponse.redirect(
          new URL(ROLE_DASHBOARD[roleCookie], request.url)
        );
        response.cookies.getAll().forEach((cookie) => {
          redirect.cookies.set(cookie.name, cookie.value);
        });
        return redirect;
      }
    }
    return response;
  }

  // ── 4. Verificar autenticación ───────────────────────────────────
  const role = request.cookies.get(AUTH_COOKIE)?.value;
  if (!role || !isValidRole(role)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const redirect = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie.name, cookie.value);
    });
    return redirect;
  }

  // ── 5. Verificar que el rol coincide con el prefijo de ruta ──────
  for (const prefix of ROLE_PREFIXES) {
    if (pathname.startsWith(`/${prefix}`)) {
      if (role !== prefix) {
        const redirect = NextResponse.redirect(
          new URL(ROLE_DASHBOARD[role], request.url)
        );
        response.cookies.getAll().forEach((cookie) => {
          redirect.cookies.set(cookie.name, cookie.value);
        });
        return redirect;
      }
      return response;
    }
  }

  // ── 6. Cualquier otra ruta protegida — pasar ─────────────────────
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
