"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth.store";
import type { UserRole } from "../../domain/entities/session.entity";

/** Mapa de dashboard por rol */
const ROLE_DASHBOARD: Record<UserRole, string> = {
  doctor: "/doctor/dashboard",
  lawyer: "/lawyer/dashboard",
  admin: "/admin/dashboard",
};

/**
 * Hook principal de autenticación.
 * Provee el estado del usuario, acciones (login/logout) y helpers de rol.
 */
export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, error, login, loginByRole, logout, clearError } =
    useAuthStore();

  const role = user?.role ?? null;

  /** Cierra sesión y redirige a /login */
  const signOut = () => {
    logout();
    router.push("/login");
  };

  /** Redirige al dashboard correspondiente al rol actual */
  const redirectToDashboard = () => {
    if (role) router.push(ROLE_DASHBOARD[role]);
  };

  /** Obtiene la ruta del dashboard para un rol dado */
  const getDashboardPath = (r: UserRole) => ROLE_DASHBOARD[r];

  return {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginByRole,
    signOut,
    clearError,
    redirectToDashboard,
    getDashboardPath,
  };
}
