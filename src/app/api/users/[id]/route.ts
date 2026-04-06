import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockUsers } from "@/mocks/users";

const users = [...mockUsers];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await simulateLatency(150, 300);

  const { id } = await params;
  const user = users.find((u) => u.id === id);
  if (!user) return apiError("Usuario no encontrado", 404);
  return apiSuccess(user);
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await simulateLatency(200, 400);

  const { id } = await params;
  const user = users.find((u) => u.id === id);
  if (!user) return apiError("Usuario no encontrado", 404);

  user.isActive = !user.isActive;
  return apiSuccess(user);
}
