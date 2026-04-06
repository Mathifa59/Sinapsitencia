import type { IAuthRepository, LoginCredentials } from "../repositories/IAuthRepository";
import type { SessionEntity } from "../entities/session.entity";

export async function loginUseCase(
  repository: IAuthRepository,
  credentials: LoginCredentials
): Promise<SessionEntity> {
  if (!credentials.email || !credentials.password) {
    throw new Error("Correo y contraseña son requeridos");
  }

  const session = await repository.login(credentials);

  if (!session.user.isActive) {
    throw new Error("Tu cuenta está inactiva. Contacta al administrador.");
  }

  return session;
}
