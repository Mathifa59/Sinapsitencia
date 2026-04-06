import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockUsers } from "@/mocks/users";

export async function GET(request: Request) {
  await simulateLatency(100, 300);

  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return apiError("No autorizado", 401);

  // Extraer userId del mock token (formato: mock-token-{userId})
  const userId = token.replace("mock-token-", "");
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return apiError("Sesión no válida", 401);

  return apiSuccess({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  });
}
