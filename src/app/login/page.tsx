"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginSchema, type LoginFormValues } from "@/validators/auth";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/types";

const ROLE_SHORTCUTS: { role: UserRole; label: string; email: string }[] = [
  { role: "doctor", label: "Médico demo", email: "dr.ramirez@hospital.pe" },
  { role: "lawyer", label: "Abogado demo", email: "abg.vasquez@legal.pe" },
  { role: "admin", label: "Admin demo", email: "admin@hngai.pe" },
];

export default function LoginPage() {
  const router = useRouter();
  const { loginByRole, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    // TODO: cuando el backend esté disponible, usar login({ email: data.email, password: data.password })
    const role = ROLE_SHORTCUTS.find((r) => r.email === data.email)?.role ?? "doctor";
    await loginByRole(role);
    router.push(`/${role}/dashboard`);
  };

  const loginAs = async (role: UserRole) => {
    await loginByRole(role);
    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
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

          <div className="mt-5">
            <div className="relative flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400">Acceso rápido demo</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_SHORTCUTS.map((s) => (
                <button key={s.role} type="button" onClick={() => loginAs(s.role)}
                  className="text-xs font-medium text-slate-600 border border-slate-200 rounded-md py-2 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          ¿Sin cuenta?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">Solicitar acceso</Link>
        </p>
      </div>
    </div>
  );
}
