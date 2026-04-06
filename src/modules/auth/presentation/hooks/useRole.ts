"use client";

import { useAuthStore } from "../stores/auth.store";
import type { UserRole } from "../../domain/entities/session.entity";

/**
 * Hook de rol — devuelve el rol actual y helpers para verificar permisos.
 */
export function useRole() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? null;

  /** ¿El usuario tiene exactamente este rol? */
  const is = (r: UserRole) => role === r;

  /** ¿El usuario tiene alguno de estos roles? */
  const isOneOf = (roles: UserRole[]) => role !== null && roles.includes(role);

  return { role, is, isOneOf };
}
