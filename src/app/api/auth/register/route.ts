import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockUsers } from "@/mocks/users";

export async function POST(request: Request) {
  await simulateLatency();

  const body = await request.json();
  const { name, email, role } = body;

  if (!name || !email || !role) {
    return apiError("Nombre, correo y rol son requeridos", 400);
  }

  const exists = mockUsers.some((u) => u.email === email);
  if (exists) {
    return apiError("Ya existe una cuenta con ese correo electrónico", 409);
  }

  return apiSuccess({
    message: "Solicitud de acceso recibida. Recibirás un correo cuando tu cuenta sea activada.",
  }, 201);
}
