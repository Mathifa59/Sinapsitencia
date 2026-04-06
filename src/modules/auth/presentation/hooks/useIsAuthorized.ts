"use client";

import { useAuthStore } from "../stores/auth.store";
import type { UserRole } from "../../domain/entities/session.entity";

/**
 * Hook que evalúa si el usuario actual cumple un criterio de autorización.
 *
 * @param allowedRoles - Lista de roles permitidos
 * @returns `true` si el usuario está autenticado y su rol está en la lista
 *
 * @example
 * const canManageUsers = useIsAuthorized(["admin"]);
 * const canViewCases = useIsAuthorized(["doctor", "admin"]);
 */
export function useIsAuthorized(allowedRoles: UserRole[]): boolean {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated || !user) return false;
  return allowedRoles.includes(user.role);
}
