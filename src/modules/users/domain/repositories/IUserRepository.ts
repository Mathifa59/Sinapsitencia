import type { UserEntity } from "@/modules/auth/domain/entities/session.entity";

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
}
