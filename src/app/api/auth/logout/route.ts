import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/auth/logout
 *
 * Cierra la sesión del usuario en Supabase Auth.
 * Elimina las cookies de sesión.
 */
export async function POST() {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return apiError("Error al cerrar sesión", 500);
  }

  return apiSuccess({ message: "Sesión cerrada correctamente" });
}
