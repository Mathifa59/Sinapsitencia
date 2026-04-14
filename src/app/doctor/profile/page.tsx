"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  Stethoscope,
  Loader2,
  Camera,
  CheckCircle,
  Mail,
  Phone,
  Building2,
  Award,
  Calendar,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { apiFetch } from "@/lib/api";
import { getInitials } from "@/lib/utils";
import { MEDICAL_SPECIALTIES } from "@/constants";

const doctorProfileSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  cmp: z.string().optional(),
  specialty: z.string().min(1, "La especialidad es requerida"),
  hospital: z.string().optional(),
  phone: z.string().optional(),
  yearsExperience: z.number().min(0).max(60).optional(),
  bio: z.string().optional(),
});
type DoctorProfileForm = z.infer<typeof doctorProfileSchema>;

interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
  professional: {
    id: string;
    user_id: string;
    cmp: string;
    specialty: string;
    hospital: string;
    phone: string;
    bio: string | null;
    years_experience: number;
  } | null;
}

function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => apiFetch<ProfileResponse>(`/api/profile?userId=${userId}`),
    enabled: Boolean(userId),
  });
}

export default function DoctorProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useProfile(user?.id ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const prof = profile?.professional;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DoctorProfileForm>({
    resolver: zodResolver(doctorProfileSchema),
    values: prof
      ? {
          name: profile?.name ?? "",
          cmp: prof.cmp ?? "",
          specialty: prof.specialty ?? "",
          hospital: prof.hospital ?? "",
          phone: prof.phone ?? "",
          yearsExperience: prof.years_experience ?? 0,
          bio: prof.bio ?? "",
        }
      : undefined,
  });

  const onSubmit = async (data: DoctorProfileForm) => {
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await apiFetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          userId: user?.id,
          name: data.name,
          professional: {
            cmp: data.cmp,
            specialty: data.specialty,
            hospital: data.hospital,
            phone: data.phone,
            bio: data.bio,
            years_experience: data.yearsExperience,
          },
        }),
      });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Error al guardar los cambios. Intenta de nuevo.");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    } catch {
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Cargando perfil...</span>
      </div>
    );
  }

  if (!prof) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>No se encontró el perfil médico.</p>
      </div>
    );
  }

  const displayAvatar = avatarPreview ?? profile?.avatar;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="text-slate-500 text-sm mt-1">
          Gestiona tu información profesional
        </p>
      </div>

      {/* ─── Header card con avatar ─── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            {/* Avatar con upload */}
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                {displayAvatar && (
                  <AvatarImage src={displayAvatar} alt={user?.name} />
                )}
                <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                  {getInitials(user?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <h2 className="text-xl font-bold text-slate-900 truncate">
                {user?.name}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                {user?.email}
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="info" className="gap-1">
                  <Stethoscope className="h-3 w-3" />
                  {prof.specialty}
                </Badge>
                {prof.years_experience > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {prof.years_experience} años exp.
                  </Badge>
                )}
                {prof.cmp && (
                  <Badge variant="secondary" className="gap-1">
                    <Award className="h-3 w-3" />
                    CMP: {prof.cmp}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Formulario ─── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-5">
          Información profesional
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <Input value={user?.email ?? ""} disabled className="bg-slate-50" />
              <p className="text-xs text-slate-400">No se puede modificar</p>
            </div>

            <div className="space-y-1.5">
              <Label>Especialidad médica *</Label>
              <select
                {...register("specialty")}
                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
              >
                <option value="">Selecciona</option>
                {MEDICAL_SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.specialty && (
                <p className="text-xs text-red-600">{errors.specialty.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>CMP (Colegio Médico del Perú)</Label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input {...register("cmp")} className="pl-9" placeholder="Ej: 012345" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Hospital o centro de salud</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input {...register("hospital")} className="pl-9" placeholder="Ej: Hospital Loayza" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input {...register("phone")} className="pl-9" placeholder="+51 999 999 999" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Años de experiencia</Label>
              <Input
                type="number"
                min={0}
                max={60}
                {...register("yearsExperience", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Biografía / Descripción profesional</Label>
            <Textarea
              rows={4}
              placeholder="Describe tu experiencia, áreas de investigación, logros profesionales..."
              {...register("bio")}
            />
          </div>

          {saveError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {saveError}
            </p>
          )}

          {saveSuccess && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
              <CheckCircle className="h-4 w-4" />
              Perfil actualizado correctamente
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              className="gap-2"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
