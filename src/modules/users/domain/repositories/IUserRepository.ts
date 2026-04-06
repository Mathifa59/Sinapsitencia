import type { UserEntity, UserRole } from "@/modules/auth/domain/entities/session.entity";

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  create(input: CreateUserInput): Promise<UserEntity>;
  toggleStatus(id: string): Promise<UserEntity>;
}
