import type { IUserRepository, CreateUserInput } from "../../domain/repositories/IUserRepository";
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

  async create(input: CreateUserInput): Promise<UserEntity> {
    await new Promise((r) => setTimeout(r, 350));
    const exists = this.users.some((u) => u.email === input.email);
    if (exists) throw new Error("Ya existe un usuario con ese correo electrónico");
    const newUser: UserEntity = {
      id: `u${Date.now()}`,
      name: input.name,
      email: input.email,
      role: input.role,
      isActive: true,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async toggleStatus(id: string): Promise<UserEntity> {
    await new Promise((r) => setTimeout(r, 250));
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error(`Usuario "${id}" no encontrado`);
    this.users[idx] = { ...this.users[idx], isActive: !this.users[idx].isActive };
    return this.users[idx];
  }
}
