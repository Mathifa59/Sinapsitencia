import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockUsers } from "@/mocks/users";
import type { UserRole } from "@/types";

const ROLE_BY_EMAIL: Record<string, UserRole> = {
  "dr.ramirez@hospital.pe": "doctor",
  "dr.torres@hospital.pe": "doctor",
  "abg.vasquez@legal.pe": "lawyer",
  "abg.flores@legal.pe": "lawyer",
  "admin@hngai.pe": "admin",
  "mathiwen519@gmail.com": "admin",
  "natoreyes0211@gmail.com": "admin",
};

const ROLE_USER_ID: Record<UserRole, string> = {
  doctor: "u1",
  lawyer: "u3",
  admin: "u5",
};

/** Usuarios con contraseña protegida (no demo) */
const PROTECTED_USERS: Record<string, string> = {
  "mathiwen519@gmail.com": "12345678",
  "natoreyes0211@gmail.com": "12345678",
};

function buildUserResponse(user: (typeof mockUsers)[number]) {
  return apiSuccess({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, isActive: user.isActive, createdAt: user.createdAt },
    token: `mock-token-${user.id}`,
  });
}

export async function POST(request: Request) {
  await simulateLatency();

  const body = await request.json();
  const { email, password, role } = body;

  // Login por rol (acceso rápido demo)
  if (role) {
    const userId = ROLE_USER_ID[role as UserRole];
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return apiError("Rol no válido", 400);
    return buildUserResponse(user);
  }

  // Login por email/password
  if (!email || !password) return apiError("Email y contraseña son requeridos", 400);

  const matchedRole = ROLE_BY_EMAIL[email];
  if (!matchedRole) return apiError("Credenciales incorrectas", 401);

  // Validar contraseña para usuarios protegidos
  if (PROTECTED_USERS[email] && PROTECTED_USERS[email] !== password) {
    return apiError("Credenciales incorrectas", 401);
  }

  // Buscar usuario directamente por email (para usuarios con cuenta propia)
  const user = mockUsers.find((u) => u.email === email) ?? mockUsers.find((u) => u.id === ROLE_USER_ID[matchedRole]);
  if (!user) return apiError("Usuario no encontrado", 404);

  return buildUserResponse(user);
}
