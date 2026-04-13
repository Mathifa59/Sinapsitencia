import type { IAuthRepository, LoginCredentials } from "../../domain/repositories/IAuthRepository";
import type { SessionEntity } from "../../domain/entities/session.entity";
import type { UserRole } from "../../domain/entities/session.entity";
import { mockUsers } from "@/mocks/users";

const ROLE_BY_EMAIL: Record<string, UserRole> = {
  "dr.ramirez@hospital.pe": "doctor",
  "dr.torres@hospital.pe": "doctor",
  "abg.vasquez@legal.pe": "lawyer",
  "abg.flores@legal.pe": "lawyer",
  "admin@hngai.pe": "admin",
  "mathiwen519@gmail.com": "admin",
  "natoreyes0211@gmail.com": "admin",
};

/** Usuarios con contraseña protegida */
const PROTECTED_USERS: Record<string, string> = {
  "mathiwen519@gmail.com": "12345678",
  "natoreyes0211@gmail.com": "12345678",
};

function toSessionEntity(userId: string): SessionEntity {
  const raw = mockUsers.find((u) => u.id === userId);
  if (!raw) throw new Error("Usuario no encontrado");
  return {
    user: {
      id: raw.id,
      email: raw.email,
      name: raw.name,
      role: raw.role as UserRole,
      isActive: raw.isActive,
      createdAt: new Date(raw.createdAt),
    },
    token: `mock-token-${raw.id}`,
  };
}

const ROLE_USER_ID: Record<UserRole, string> = {
  doctor: "u1",
  lawyer: "u3",
  admin: "u5",
};

export class MockAuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<SessionEntity> {
    await new Promise((r) => setTimeout(r, 500));
    const role = ROLE_BY_EMAIL[credentials.email];
    if (!role) throw new Error("Credenciales incorrectas");

    // Validar contraseña para usuarios protegidos
    if (PROTECTED_USERS[credentials.email] && PROTECTED_USERS[credentials.email] !== credentials.password) {
      throw new Error("Credenciales incorrectas");
    }

    // Buscar usuario directamente por email (para cuentas propias) o por rol (demo)
    const directUser = mockUsers.find((u) => u.email === credentials.email);
    const userId = directUser?.id ?? ROLE_USER_ID[role];
    return toSessionEntity(userId);
  }

  async loginByRole(role: UserRole): Promise<SessionEntity> {
    await new Promise((r) => setTimeout(r, 400));
    return toSessionEntity(ROLE_USER_ID[role]);
  }

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
  }

  async getCurrentSession(): Promise<SessionEntity | null> {
    return null; // En mock no hay persistencia de sesión en servidor
  }
}
