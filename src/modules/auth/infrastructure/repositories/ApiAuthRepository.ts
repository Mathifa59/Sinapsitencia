import { apiFetch } from "@/lib/api";
import type { IAuthRepository, LoginCredentials } from "../../domain/repositories/IAuthRepository";
import type { SessionEntity, UserRole } from "../../domain/entities/session.entity";

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
  };
  token: string;
}

function toSession(res: LoginResponse): SessionEntity {
  return {
    user: {
      id: res.user.id,
      email: res.user.email,
      name: res.user.name,
      role: res.user.role,
      isActive: res.user.isActive,
      createdAt: new Date(res.user.createdAt),
    },
    token: res.token,
  };
}

export class ApiAuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<SessionEntity> {
    const res = await apiFetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
    return toSession(res);
  }

  async loginByRole(role: UserRole): Promise<SessionEntity> {
    const res = await apiFetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ role }),
    });
    return toSession(res);
  }

  async logout(): Promise<void> {
    await apiFetch("/api/auth/logout", { method: "POST" });
  }

  async getCurrentSession(): Promise<SessionEntity | null> {
    try {
      const res = await apiFetch<LoginResponse["user"]>("/api/auth/me");
      return {
        user: { ...res, createdAt: new Date(res.createdAt) },
        token: "",
      };
    } catch {
      return null;
    }
  }
}
