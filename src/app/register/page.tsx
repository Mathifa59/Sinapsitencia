"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
<<<<<<< HEAD
import { Shield, CheckCircle2 } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "@/validators/auth";
import { apiFetch } from "@/lib/api";
=======
import {
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Stethoscope,
  Scale,
} from "lucide-react";
import { registerSchema, type RegisterFormValues } from "@/validators/auth";
import { MEDICAL_SPECIALTIES, LEGAL_SPECIALTIES } from "@/constants";
>>>>>>> eb03f5647503b3e78cd4e58ff820bd5a577d7297
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
<<<<<<< HEAD
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
=======
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
>>>>>>> eb03f5647503b3e78cd4e58ff820bd5a577d7297
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "doctor",
      legalSpecialties: [],
      medicalAreas: [],
    },
  });

<<<<<<< HEAD
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
=======
  const selectedRole = watch("role");
  const selectedLegalSpecialties = watch("legalSpecialties") ?? [];
  const selectedMedicalAreas = watch("medicalAreas") ?? [];

  const toggleArrayValue = (
    field: "legalSpecialties" | "medicalAreas",
    value: string,
    current: string[]
  ) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next, { shouldValidate: true });
  };

  // Avanzar al paso 2 validando solo los campos del paso 1
  const goToStep2 = async () => {
    const valid = await trigger(["name", "email", "password", "confirmPassword"]);
    if (valid) {
      setError(null);
      setStep(2);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      if (data.role === "doctor") {
        payload.cmp = data.cmp;
        payload.specialty = data.specialty;
        payload.hospital = data.hospital;
      } else {
        payload.cab = data.cab;
        payload.legalSpecialties = data.legalSpecialties;
        payload.medicalAreas = data.medicalAreas;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? "Error al crear la cuenta");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 mb-4">
            <CheckCircle className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Cuenta creada</h2>
          <p className="text-sm text-slate-500">
            Tu cuenta ha sido registrada exitosamente. Redirigiendo al login...
          </p>
>>>>>>> eb03f5647503b3e78cd4e58ff820bd5a577d7297
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-slate-900 mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Crear cuenta</h1>
          <p className="text-sm text-slate-500 mt-1">
            {step === 1 ? "Datos de acceso" : "Perfil profesional"}
          </p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 1 ? "bg-blue-500" : "bg-slate-200"}`} />
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 2 ? "bg-blue-500" : "bg-slate-200"}`} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
<<<<<<< HEAD
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
=======
            {/* ─── PASO 1: Datos básicos ─── */}
            {step === 1 && (
              <>
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
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setValue("role", "doctor")}
                      className={`flex items-center justify-center gap-2 rounded-lg border-2 px-3 py-3 text-sm font-medium transition-all ${
                        selectedRole === "doctor"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <Stethoscope className="h-4 w-4" />
                      Médico
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("role", "lawyer")}
                      className={`flex items-center justify-center gap-2 rounded-lg border-2 px-3 py-3 text-sm font-medium transition-all ${
                        selectedRole === "lawyer"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <Scale className="h-4 w-4" />
                      Abogado
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Contraseña</Label>
                  <Input type="password" placeholder="Mínimo 8 caracteres" {...register("password")} />
                  {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Confirmar contraseña</Label>
                  <Input type="password" placeholder="Repite la contraseña" {...register("confirmPassword")} />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="button" className="w-full" variant="primary" onClick={goToStep2}>
                  Continuar
                </Button>
              </>
            )}

            {/* ─── PASO 2: Perfil profesional ─── */}
            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-2"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Volver
                </button>

                {selectedRole === "doctor" && (
                  <>
                    <div className="space-y-1.5">
                      <Label>Especialidad médica *</Label>
                      <select
                        {...register("specialty")}
                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
                      >
                        <option value="">Selecciona tu especialidad</option>
                        {MEDICAL_SPECIALTIES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.specialty && (
                        <p className="text-xs text-red-600">{errors.specialty.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label>CMP (Colegio Médico del Perú)</Label>
                      <Input placeholder="Ej: 012345" {...register("cmp")} />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Hospital o centro de salud</Label>
                      <Input placeholder="Ej: Hospital Nacional Arzobispo Loayza" {...register("hospital")} />
                    </div>
                  </>
                )}

                {selectedRole === "lawyer" && (
                  <>
                    <div className="space-y-1.5">
                      <Label>Especialidades legales *</Label>
                      <p className="text-xs text-slate-400 mb-2">Selecciona las áreas legales en las que te especializas</p>
                      <div className="flex flex-wrap gap-1.5">
                        {LEGAL_SPECIALTIES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleArrayValue("legalSpecialties", s, selectedLegalSpecialties)}
                            className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
                              selectedLegalSpecialties.includes(s)
                                ? "bg-blue-50 border-blue-300 text-blue-700"
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      {errors.legalSpecialties && (
                        <p className="text-xs text-red-600">{errors.legalSpecialties.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Áreas médicas de interés *</Label>
                      <p className="text-xs text-slate-400 mb-2">
                        Selecciona las especialidades médicas cuyos casos puedes atender
                      </p>
                      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                        {MEDICAL_SPECIALTIES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleArrayValue("medicalAreas", s, selectedMedicalAreas)}
                            className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
                              selectedMedicalAreas.includes(s)
                                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      {errors.medicalAreas && (
                        <p className="text-xs text-red-600">{errors.medicalAreas.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label>CAB (Colegio de Abogados)</Label>
                      <Input placeholder="Ej: CAL-12345" {...register("cab")} />
                    </div>
                  </>
                )}

                {error && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </span>
                  ) : (
                    "Crear cuenta"
                  )}
                </Button>
              </>
            )}
>>>>>>> eb03f5647503b3e78cd4e58ff820bd5a577d7297
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  );
}
