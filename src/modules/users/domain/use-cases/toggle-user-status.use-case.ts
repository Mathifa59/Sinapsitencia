import type { IUserRepository } from "../repositories/IUserRepository";
import type { UserEntity } from "@/modules/auth/domain/entities/session.entity";

export async function toggleUserStatusUseCase(
  userRepository: IUserRepository,
  id: string
): Promise<UserEntity> {
  return userRepository.toggleStatus(id);
}
