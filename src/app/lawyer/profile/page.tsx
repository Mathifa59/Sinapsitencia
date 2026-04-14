"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  Scale,
  Star,
  Loader2,
  Camera,
  CheckCircle,
  Mail,
  Phone,
  Award,
  Calendar,
  Briefcase,
  Stethoscope,
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
import { LEGAL_SPECIALTIES, MEDICAL_SPECIALTIES } from "@/constants";

const lawyerProfileSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  cab: z.string().optional(),
  phone: z.string().optional(),
  yearsExperience: z.number().min(0).max(60).optional(),
  bio: z.string().optional(),
});
type LawyerProfileForm = z.infer<typeof lawyerProfileSchema>;

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
    cab: string;
    specialties: string[];
    medical_areas: string[];
    phone: string;
    bio: string | null;
    years_experience: number;
    rating: number;
    resolved_cases: number;
  } | null;
}

function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => apiFetch<ProfileResponse>(`/api/profile?userId=${userId}`),
    enabled: Boolean(userId),
  });
}

export default function LawyerProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useProfile(user?.id ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Chip state for specialties and medical areas (managed outside react-hook-form)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedMedicalAreas, setSelectedMedicalAreas] = useState<string[]>([]);
  const [chipsInitialized, setChipsInitialized] = useState(false);

  const prof = profile?.professional;

  // Sync chip state once profile loads
  if (prof && !chipsInitialized) {
    setSelectedSpecialties(prof.specialties ?? []);
    setSelectedMedicalAreas(prof.medical_areas ?? []);
    setChipsInitialized(true);
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LawyerProfileForm>({
    resolver: zodResolver(lawyerProfileSchema),
    values: prof
      ? {
          name: profile?.name ?? "",
          cab: prof.cab ?? "",
          phone: prof.phone ?? "",
          yearsExperience: prof.years_experience ?? 0,
          bio: prof.bio ?? "",
        }
      : undefined,
  });

  const toggleChip = (
    list: string[],
    setList: (v: string[]) => void,
    value: string
  ) => {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  // Track if chips changed vs original
  const chipsChanged =
    chipsInitialized &&
    (JSON.stringify(selectedSpecialties) !== JSON.stringify(prof?.specialties ?? []) ||
      JSON.stringify(selectedMedicalAreas) !== JSON.stringify(prof?.medical_areas ?? []));

  const formChanged = isDirty || chipsChanged;

  const onSubmit = async (data: LawyerProfileForm) => {
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await apiFetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          userId: user?.id,
          name: data.name,
          professional: {
            cab: data.cab,
            specialties: selectedSpecialties,
            medical_areas: selectedMedicalAreas,
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
        <p>No se encontró el perfil legal.</p>
      </div>
    );
  }

  const displayAvatar = avatarPreview ?? profile?.avatar;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil Legal</h1>
        <p className="text-slate-500 text-sm mt-1">
          Configura tu perfil para recibir mejores coincidencias de casos
        </p>
      </div>

      {/* ─── Header card con avatar ─── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            {/* Avatar con upload */}
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                {displayAvatar && (
                  <AvatarImage src={displayAvatar} alt={user?.name} />
                )}
                <AvatarFallback className="bg-slate-800 text-white text-2xl font-bold">
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
                <Badge variant="secondary" className="gap-1">
                  <Scale className="h-3 w-3" />
                  Abogado
                </Badge>
                {prof.rating > 0 && (
                  <Badge variant="warning" className="gap-1">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {prof.rating} / 5.0
                  </Badge>
                )}
                {prof.resolved_cases > 0 && (
                  <Badge variant="info" className="gap-1">
                    <Briefcase className="h-3 w-3" />
                    {prof.resolved_cases} casos
                  </Badge>
                )}
                {prof.years_experience > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {prof.years_experience} años exp.
                  </Badge>
                )}
                {prof.cab && (
                  <Badge variant="secondary" className="gap-1">
                    <Award className="h-3 w-3" />
                    CAB: {prof.cab}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Formulario ─── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Datos básicos */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-5">
            Datos personales
          </h3>
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
              <Label>Nro. CAB (Colegio de Abogados)</Label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input {...register("cab")} className="pl-9" placeholder="Ej: CAL-12345" />
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
        </div>

        {/* Especialidades legales */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-1 flex items-center gap-2">
            <Scale className="h-4 w-4 text-slate-600" />
            Especialidades legales
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Selecciona las áreas legales en las que te especializas
          </p>
          <div className="flex flex-wrap gap-2">
            {LEGAL_SPECIALTIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleChip(selectedSpecialties, setSelectedSpecialties, s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedSpecialties.includes(s)
                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Áreas médicas de interés */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-1 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-slate-600" />
            Áreas médicas de interés
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Selecciona las especialidades médicas cuyos casos puedes atender. Esto determina qué casos relevantes verás en tu dashboard.
          </p>
          <div className="flex flex-wrap gap-2">
            {MEDICAL_SPECIALTIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleChip(selectedMedicalAreas, setSelectedMedicalAreas, s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedMedicalAreas.includes(s)
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Descripción profesional
          </h3>
          <Textarea
            rows={4}
            placeholder="Describe tu experiencia, áreas de práctica, casos destacados..."
            {...register("bio")}
          />
        </div>

        {/* Feedback + Save */}
        <div className="space-y-3">
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

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="gap-2"
              disabled={isSubmitting || !formChanged}
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
        </div>
      </form>
    </div>
  );
}
