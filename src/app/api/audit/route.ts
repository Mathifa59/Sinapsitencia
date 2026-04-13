import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/audit
 *
 * Lista registros de auditoría con filtros.
 * Query params: action, userId, resource, search, page, pageSize
 */
export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);

  const action = searchParams.get("action");
  const userId = searchParams.get("userId");
  const resource = searchParams.get("resource");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "50");

  let query = supabase
    .from("audit_logs")
    .select(
      `
      *,
      user:profiles!audit_logs_user_id_fkey(id, name, role)
    `,
      { count: "exact" }
    );

  if (action) query = query.eq("action", action);
  if (userId) query = query.eq("user_id", userId);
  if (resource) query = query.eq("resource", resource);
  if (search) {
    // Buscar en details (jsonb) o en resource
    query = query.or(`resource.ilike.%${search}%,action.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to).order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    return apiError(`Error al obtener logs de auditoría: ${error.message}`, 500);
  }

  const total = count ?? 0;

  const logs = (data ?? []).map((l) => {
    const user = l.user as { id: string; name: string; role: string } | null;

    return {
      id: l.id,
      userId: l.user_id,
      userName: user?.name ?? "Sistema",
      userRole: user?.role ?? "admin",
      action: l.action,
      resource: l.resource,
      resourceId: l.resource_id,
      description:
        (l.details as Record<string, string>)?.description ??
        `${l.action} en ${l.resource}`,
      details: l.details,
      ipAddress: l.ip_address,
      createdAt: l.created_at,
    };
  });

  return apiSuccess({ data: logs, total });
}
