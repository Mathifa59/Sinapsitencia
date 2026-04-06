"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Stethoscope } from "lucide-react";
import { mockDoctorProfiles } from "@/mocks/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(3),
  cmp: z.string().min(3),
  specialty: z.string().min(2),
  hospital: z.string().min(3),
  phone: z.string().min(9),
  bio: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

export default function DoctorProfilePage() {
  const doctor = mockDoctorProfiles[0];
  const { register, handleSubmit, formState: { isSubmitting, isDirty } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: doctor.user.name,
      cmp: doctor.cmp,
      specialty: doctor.specialty,
      hospital: doctor.hospital,
      phone: doctor.phone,
      bio: doctor.bio ?? "",
    },
  });

  const onSubmit = async (_data: ProfileForm) => {
    await new Promise((r) => setTimeout(r, 600));
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="text-slate-500 text-sm mt-1">Gestiona tu información profesional</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
          <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {getInitials(doctor.user.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{doctor.user.name}</h2>
            <p className="text-slate-500 text-sm">{doctor.user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="info" className="gap-1">
                <Stethoscope className="h-3 w-3" />
                Médico
              </Badge>
              <Badge variant="secondary">{doctor.yearsExperience} años exp.</Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <Input {...register("name")} />
            </div>
            <div className="space-y-1.5">
              <Label>CMP</Label>
              <Input {...register("cmp")} />
            </div>
            <div className="space-y-1.5">
              <Label>Especialidad</Label>
              <Input {...register("specialty")} />
            </div>
            <div className="space-y-1.5">
              <Label>Hospital</Label>
              <Input {...register("hospital")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Teléfono</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Biografía / Descripción profesional</Label>
              <Textarea rows={3} placeholder="Describe tu perfil profesional..." {...register("bio")} />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" className="gap-2" disabled={isSubmitting || !isDirty}>
              <Save className="h-4 w-4" />
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
