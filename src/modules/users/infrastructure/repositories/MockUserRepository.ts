import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { UserEntity } from "@/modules/auth/domain/entities/session.entity";
import { mockUsers } from "@/mocks/users";

export class MockUserRepository implements IUserRepository {
  private users: UserEntity[] = mockUsers.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role as UserEntity["role"],
    isActive: u.isActive,
    createdAt: new Date(u.createdAt),
  }));

  async findAll(): Promise<UserEntity[]> {
    await new Promise((r) => setTimeout(r, 200));
    return this.users;
  }

  async findById(id: string): Promise<UserEntity | null> {
    await new Promise((r) => setTimeout(r, 150));
    return this.users.find((u) => u.id === id) ?? null;
  }
}
