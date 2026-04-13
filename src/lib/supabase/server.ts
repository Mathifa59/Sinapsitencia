/**
 * ─── Cliente Supabase para el servidor ──────────────────────────────────────
 *
 * Uso: en Route Handlers (API Routes) y Server Components
 * - Lee cookies del request para obtener la sesión del usuario
 * - RLS se aplica automáticamente según auth.uid()
 * - NUNCA importar en código del cliente
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll puede lanzar error cuando se llama desde Server Components
            // donde las cookies son de solo lectura. En Route Handlers funciona bien.
          }
        },
      },
    }
  );
}

/**
 * Helper: obtiene el usuario autenticado o null.
 * Siempre usar getUser() (valida el JWT con Supabase Auth)
 * en vez de getSession() (que solo lee cookies sin validar).
 */
export async function getAuthenticatedUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}
