"use client";

import { useEffect, useState } from "react";
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
 * Guard de layout — protege rutas a nivel de componente (complementa al proxy).
 * Espera a que Zustand se hidrate desde localStorage antes de evaluar.
 * Si el usuario no está autenticado → redirige a /login.
 * Si el rol no coincide → redirige a su dashboard.
 */
export function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  // Esperar a que Zustand se hidrate desde localStorage
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    // Si ya hidrató antes de montar el efecto
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }
    if (user.role !== allowedRole) {
      router.replace(ROLE_DASHBOARD[user.role]);
    }
  }, [hydrated, isAuthenticated, user, allowedRole, router]);

  // Mientras hidrata o redirige, mostrar loader
  if (!hydrated || !isAuthenticated || !user || user.role !== allowedRole) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return <>{children}</>;
}
