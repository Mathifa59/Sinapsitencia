"use client";

import { useIsAuthorized } from "../hooks/useIsAuthorized";
import type { UserRole } from "../../domain/entities/session.entity";

interface AuthorizedProps {
  /** Roles que pueden ver este contenido */
  roles: UserRole[];
  /** Contenido a mostrar si no está autorizado (opcional) */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Muestra u oculta contenido según el rol del usuario actual.
 *
 * @example
 * <Authorized roles={["admin"]}>
 *   <Button>Eliminar usuario</Button>
 * </Authorized>
 *
 * <Authorized roles={["doctor", "admin"]} fallback={<p>Sin acceso</p>}>
 *   <PatientList />
 * </Authorized>
 */
export function Authorized({ roles, fallback = null, children }: AuthorizedProps) {
  const isAuthorized = useIsAuthorized(roles);
  return isAuthorized ? <>{children}</> : <>{fallback}</>;
}
