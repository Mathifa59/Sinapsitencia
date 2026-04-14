"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import {
  ProfileHeader,
  SaveFeedback,
  useProfile,
  useAvatarUpload,
} from "@/components/profile";

const adminProfileSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});
type AdminProfileForm = z.infer<typeof adminProfileSchema>;

export default function AdminProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = user?.id ?? "";
  const { data: profile, isLoading } = useProfile(userId);
  const avatar = useAvatarUpload(user?.id);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AdminProfileForm>({
    resolver: zodResolver(adminProfileSchema),
    values: profile ? { name: profile.name } : undefined,
  });

  const onSubmit = async (data: AdminProfileForm) => {
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await apiFetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          userId: user?.id,
          name: data.name,
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

  const displayAvatar = avatar.preview ?? profile?.avatar;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="text-slate-500 text-sm mt-1">
          Gestiona tu información de administrador
        </p>
      </div>

      <ProfileHeader
        name={user?.name ?? ""}
        email={user?.email ?? ""}
        avatarUrl={displayAvatar ?? null}
        bannerGradient="from-slate-800 via-slate-700 to-slate-600"
        avatarFallbackClass="bg-slate-700"
        fileInputRef={avatar.fileInputRef}
        uploading={avatar.uploading}
        onFileChange={avatar.handleChange}
        onPickerOpen={avatar.openPicker}
        badges={
          <Badge variant="warning" className="gap-1">
            <ShieldCheck className="h-3 w-3" />
            Administrador
          </Badge>
        }
      />

      {/* ─── Formulario ─── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-5">
          Información de la cuenta
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <Input {...register("name")} placeholder="Nombre del administrador" />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <Input value={user?.email ?? ""} disabled className="bg-slate-50" />
              <p className="text-xs text-slate-400">No se puede modificar</p>
            </div>
          </div>

          <SaveFeedback error={saveError} success={saveSuccess} />

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
