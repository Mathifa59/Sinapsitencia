import type { UserRole } from "@/modules/auth/domain/entities/session.entity";

const COOKIE_NAME = "sinapsistencia-role";

/** Establece la cookie de rol (accesible por middleware) */
export function setAuthCookie(role: UserRole): void {
  document.cookie = `${COOKIE_NAME}=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

/** Elimina la cookie de rol */
export function clearAuthCookie(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

/** Nombre de la cookie — usado por middleware para leer la cookie desde el request */
export const AUTH_COOKIE_NAME = COOKIE_NAME;
