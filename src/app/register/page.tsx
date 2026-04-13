"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Shield, CheckCircle2 } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "@/validators/auth";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "doctor" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: data.name, email: data.email, role: data.role }),
      });
      setSubmitted(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Error al enviar la solicitud");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 mb-5">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Solicitud enviada</h1>
          <p className="text-sm text-slate-500 mb-6">
            Tu solicitud de acceso fue recibida correctamente. Recibirás un correo electrónico cuando tu cuenta sea activada por un administrador.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-slate-900 mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Crear cuenta</h1>
          <p className="text-sm text-slate-500 mt-1">Solicita acceso a la plataforma</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <Input placeholder="Nombre y apellidos" {...register("name")} />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <Input type="email" placeholder="correo@ejemplo.pe" {...register("email")} />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Tipo de cuenta</Label>
              <select {...register("role")} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400">
                <option value="doctor">Médico</option>
                <option value="lawyer">Abogado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Contraseña</Label>
              <Input type="password" placeholder="Mínimo 8 caracteres" {...register("password")} />
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Confirmar contraseña</Label>
              <Input type="password" placeholder="Repite la contraseña" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            {serverError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {serverError}
              </p>
            )}

            <Button type="submit" className="w-full" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Enviando solicitud..." : "Solicitar acceso"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">Ingresar</Link>
        </p>
      </div>
    </div>
  );
}
