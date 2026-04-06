/** Rol del usuario en el sistema */
export type UserRole = "doctor" | "lawyer" | "admin";

/** Snapshot del usuario autenticado (sin contraseña ni datos sensibles) */
export interface UserEntity {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

/** Sesión activa — lo que se persiste en el store */
export interface SessionEntity {
  user: UserEntity;
  /** Token JWT (vacío en modo mock) */
  token: string;
  expiresAt?: Date;
}

// ─── Helpers de dominio ────────────────────────────────────────────────────────

export function isSessionExpired(session: SessionEntity): boolean {
  if (!session.expiresAt) return false;
  return new Date() > session.expiresAt;
}

export function hasRole(user: UserEntity, role: UserRole): boolean {
  return user.role === role;
}
