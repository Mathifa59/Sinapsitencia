import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockUsers } from "@/mocks/users";
import type { UserRole } from "@/types";

let users = [...mockUsers];

export async function GET(request: Request) {
  await simulateLatency(200, 400);

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") as UserRole | null;

  let result = users;
  if (role) {
    result = result.filter((u) => u.role === role);
  }

  return apiSuccess(result);
}

export async function POST(request: Request) {
  await simulateLatency(300, 500);

  const body = await request.json();
  const { name, email, role } = body;

  if (!name || !email || !role) return apiError("Nombre, email y rol son requeridos", 400);
  if (users.some((u) => u.email === email)) return apiError("El email ya está registrado", 409);

  const newUser = {
    id: `u${Date.now()}`,
    name,
    email,
    role,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return apiSuccess(newUser, 201);
}
