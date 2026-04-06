import { apiFetch } from "@/lib/api";
import type { IUserRepository, CreateUserInput } from "../../domain/repositories/IUserRepository";
import type { UserEntity } from "@/modules/auth/domain/entities/session.entity";

interface UserRaw {
  id: string;
  email: string;
  name: string;
  role: "doctor" | "lawyer" | "admin";
  isActive: boolean;
  createdAt: string;
}

function toEntity(raw: UserRaw): UserEntity {
  return { ...raw, createdAt: new Date(raw.createdAt) };
}

export class ApiUserRepository implements IUserRepository {
  async findAll(): Promise<UserEntity[]> {
    const data = await apiFetch<UserRaw[]>("/api/users");
    return data.map(toEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    try {
      const raw = await apiFetch<UserRaw>(`/api/users/${id}`);
      return toEntity(raw);
    } catch {
      return null;
    }
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const raw = await apiFetch<UserRaw>("/api/users", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return toEntity(raw);
  }

  async toggleStatus(id: string): Promise<UserEntity> {
    const raw = await apiFetch<UserRaw>(`/api/users/${id}`, { method: "PATCH" });
    return toEntity(raw);
  }
}
