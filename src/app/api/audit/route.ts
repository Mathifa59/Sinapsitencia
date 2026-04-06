import { apiSuccess, simulateLatency } from "@/lib/api";
import { mockAuditLogs } from "@/mocks/documents";

export async function GET(request: Request) {
  await simulateLatency(200, 400);

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const userId = searchParams.get("userId");
  const resource = searchParams.get("resource");
  const search = searchParams.get("search");

  let result = [...mockAuditLogs];

  if (action) result = result.filter((l) => l.action === action);
  if (userId) result = result.filter((l) => l.userId === userId);
  if (resource) result = result.filter((l) => l.resource === resource);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (l) =>
        l.description.toLowerCase().includes(q) ||
        l.user.name.toLowerCase().includes(q)
    );
  }

  return apiSuccess({ data: result, total: result.length });
}
