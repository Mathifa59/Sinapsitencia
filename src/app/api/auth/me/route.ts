import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/auth/me
 *
 * Devuelve los datos del usuario autenticado.
 * Valida el JWT con Supabase Auth (no solo lee cookies).
 */
export async function GET() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return apiError("No autorizado", 401);
  }

  // Obtener perfil completo
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return apiError("Perfil no encontrado", 404);
  }

  return apiSuccess({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    isActive: profile.is_active,
    createdAt: profile.created_at,
    avatar: profile.avatar_url,
  });
}
