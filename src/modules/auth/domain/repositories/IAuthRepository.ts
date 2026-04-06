import type { SessionEntity, UserRole } from "../entities/session.entity";

export interface LoginCredentials {
  email: string;
  password: string;
}

/** Puerto de autenticación — implementado por Mock o Api */
export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<SessionEntity>;
  loginByRole(role: UserRole): Promise<SessionEntity>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<SessionEntity | null>;
}
