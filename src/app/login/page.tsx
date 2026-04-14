"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff, Zap } from "lucide-react";
import { useState, Suspense } from "react";
import { loginSchema, type LoginFormValues } from "@/validators/auth";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/types";

const DEMO_ROLES: { role: UserRole; label: string; color: string }[] = [
  { role: "doctor",  label: "Médico",        color: "bg-blue-600 hover:bg-blue-700 text-white" },
  { role: "lawyer",  label: "Abogado",        color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
  { role: "admin",   label: "Administrador",  color: "bg-slate-700 hover:bg-slate-800 text-white" },
];

const ROLE_DASHBOARD: Record<UserRole, string> = {
  doctor: "/doctor/dashboard",
  lawyer: "/lawyer/dashboard",
  admin: "/admin/dashboard",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { login, loginByRole, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState<UserRole | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const redirectAfterLogin = (role: UserRole) => {
    if (redirectTo && redirectTo.startsWith(`/${role}`)) {
      router.push(redirectTo);
    } else {
      router.push(ROLE_DASHBOARD[role]);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      await login({ email: data.email, password: data.password });
      const { user } = useAuthStore.getState();
      if (user) redirectAfterLogin(user.role);
    } catch {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError(null);
    setDemoLoading(role);
    try {
      await loginByRole(role);
      const { user } = useAuthStore.getState();
      if (user) redirectAfterLogin(user.role);
    } catch {
      setError(`No se pudo ingresar como ${role} demo. Verifica que la cuenta exista.`);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-slate-900 mb-4">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Sinapsistencia</h1>
        <p className="text-sm text-slate-500 mt-1">Ingresa a tu cuenta</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="correo@ejemplo.pe" {...register("email")} />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>}

          <Button type="submit" className="w-full" variant="primary" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-slate-500 mt-5">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-blue-600 hover:underline font-medium">Crear cuenta</Link>
      </p>

      {/* Acceso rápido demo */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Zap className="h-3 w-3" />
            Acceso rápido (demo)
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <div className="flex gap-2">
          {DEMO_ROLES.map(({ role, label, color }) => (
            <button
              key={role}
              onClick={() => handleDemoLogin(role)}
              disabled={isLoading || demoLoading !== null}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${color}`}
            >
              {demoLoading === role ? "..." : label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
