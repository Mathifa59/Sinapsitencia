"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import type { UserRole } from "../../domain/entities/session.entity";

const ROLE_DASHBOARD: Record<UserRole, string> = {
  doctor: "/doctor/dashboard",
  lawyer: "/lawyer/dashboard",
  admin: "/admin/dashboard",
};

interface RoleGuardProps {
  /** Rol requerido para acceder al contenido */
  allowedRole: UserRole;
  children: React.ReactNode;
}

/**
 * Guard de layout — protege rutas a nivel de componente (complementa al middleware).
 * Si el usuario no está autenticado → redirige a /login.
 * Si el rol no coincide → redirige a su dashboard.
 * Mientras evalúa, muestra un loader.
 */
export function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }
    if (user.role !== allowedRole) {
      router.replace(ROLE_DASHBOARD[user.role]);
    }
  }, [isAuthenticated, user, allowedRole, router]);

  // Mientras redirige o no hay usuario, mostrar loader
  if (!isAuthenticated || !user || user.role !== allowedRole) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return <>{children}</>;
}
