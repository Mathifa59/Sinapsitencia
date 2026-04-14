"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  Scale,
  Star,
  Loader2,
  Phone,
  Award,
  Calendar,
  Briefcase,
  Stethoscope,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { LEGAL_SPECIALTIES, MEDICAL_SPECIALTIES } from "@/constants";
import {
  ProfileHeader,
  SaveFeedback,
  useProfile,
  useAvatarUpload,
} from "@/components/profile";
import type { LawyerProfessional } from "@/components/profile";

const lawyerProfileSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  cab: z.string().optional(),
  phone: z.string().optional(),
  yearsExperience: z.number().min(0).max(60).optional(),
  bio: z.string().optional(),
});
type LawyerProfileForm = z.infer<typeof lawyerProfileSchema>;

export default function LawyerProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = user?.id ?? "";
  const { data: profile, isLoading } = useProfile<LawyerProfessional>(userId);
  const avatar = useAvatarUpload(user?.id);
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
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail(userId) });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Error al guardar los cambios. Intenta de nuevo.");
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

  const displayAvatar = avatar.preview ?? profile?.avatar;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil Legal</h1>
        <p className="text-slate-500 text-sm mt-1">
          Configura tu perfil para recibir mejores coincidencias de casos
        </p>
      </div>

      <ProfileHeader
        name={user?.name ?? ""}
        email={user?.email ?? ""}
        avatarUrl={displayAvatar ?? null}
        bannerGradient="from-slate-900 via-slate-800 to-slate-700"
        avatarFallbackClass="bg-slate-800"
        fileInputRef={avatar.fileInputRef}
        uploading={avatar.uploading}
        onFileChange={avatar.handleChange}
        onPickerOpen={avatar.openPicker}
        badges={
          <>
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
          </>
        }
      />

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
          <SaveFeedback error={saveError} success={saveSuccess} />

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
