import type { IUserRepository, CreateUserInput } from "../repositories/IUserRepository";
import type { UserEntity } from "@/modules/auth/domain/entities/session.entity";

export async function createUserUseCase(
  userRepository: IUserRepository,
  input: CreateUserInput
): Promise<UserEntity> {
  return userRepository.create(input);
}
