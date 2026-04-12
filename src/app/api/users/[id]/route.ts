import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/users/:id
 *
 * Obtiene un usuario por su ID.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { id } = await params;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return apiError("Usuario no encontrado", 404);
  }

  return apiSuccess({
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
    avatar: data.avatar_url,
    isActive: data.is_active,
    createdAt: data.created_at,
  });
}

/**
 * PATCH /api/users/:id
 *
 * Alterna el estado activo/inactivo de un usuario.
 * Requiere service_role para bypass de RLS.
 */
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { createSupabaseAdmin } = await import("@/lib/supabase/admin");
    const adminClient = createSupabaseAdmin();

    // Obtener estado actual
    const { data: current, error: findError } = await adminClient
      .from("profiles")
      .select("is_active")
      .eq("id", id)
      .single();

    if (findError || !current) {
      return apiError("Usuario no encontrado", 404);
    }

    // Toggle status
    const { data, error } = await adminClient
      .from("profiles")
      .update({ is_active: !current.is_active })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return apiError("Error al actualizar estado del usuario", 500);
    }

    return apiSuccess({
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: data.avatar_url,
      isActive: data.is_active,
      createdAt: data.created_at,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido";
    return apiError(message, 500);
  }
}
