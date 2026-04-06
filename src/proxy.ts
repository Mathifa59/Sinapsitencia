import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "sinapsistencia-role";

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rutas públicas — pasar siempre
  if (PUBLIC_PATHS.includes(pathname)) {
    // Si está autenticado y visita /login, redirigir a su dashboard
    const role = request.cookies.get(AUTH_COOKIE)?.value;
    if (pathname === "/login" && role && isValidRole(role)) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARD[role], request.url));
    }
    return NextResponse.next();
  }

  // 2. Verificar autenticación
  const role = request.cookies.get(AUTH_COOKIE)?.value;
  if (!role || !isValidRole(role)) {
    // No autenticado → login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Verificar que el rol coincide con el prefijo de ruta
  for (const prefix of ROLE_PREFIXES) {
    if (pathname.startsWith(`/${prefix}`)) {
      if (role !== prefix) {
        // Rol incorrecto → redirigir a su propio dashboard
        return NextResponse.redirect(new URL(ROLE_DASHBOARD[role], request.url));
      }
      // Rol correcto — pasar
      return NextResponse.next();
    }
  }

  // 4. Cualquier otra ruta protegida — pasar
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Proteger todas las rutas excepto:
     * - _next/static, _next/image (assets del framework)
     * - favicon.ico, archivos estáticos
     * - api routes (se protegen individualmente)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
