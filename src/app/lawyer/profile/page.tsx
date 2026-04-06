"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Scale, Star } from "lucide-react";
import { mockLawyerProfiles } from "@/mocks/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(3),
  cab: z.string().min(3),
  phone: z.string().min(9),
  bio: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

export default function LawyerProfilePage() {
  const lawyer = mockLawyerProfiles[0];
  const { register, handleSubmit, formState: { isSubmitting, isDirty } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: lawyer.user.name, cab: lawyer.cab, phone: lawyer.phone, bio: lawyer.bio ?? "" },
  });

  const onSubmit = async (_data: ProfileForm) => {
    await new Promise((r) => setTimeout(r, 600));
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil Legal</h1>
        <p className="text-slate-500 text-sm mt-1">Configura tu perfil para recibir mejores coincidencias</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
          <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xl">
            {getInitials(lawyer.user.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{lawyer.user.name}</h2>
            <p className="text-slate-500 text-sm">{lawyer.user.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className="gap-1">
                <Scale className="h-3 w-3" />Abogado
              </Badge>
              <Badge variant="warning" className="gap-1">
                <Star className="h-3 w-3 fill-amber-400" />{lawyer.rating} / 5.0
              </Badge>
              <Badge variant="info">{lawyer.casesHandled} casos</Badge>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-sm font-medium text-slate-700 mb-2">Especialidades</p>
          <div className="flex flex-wrap gap-2">
            {lawyer.specialties.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <Input {...register("name")} />
            </div>
            <div className="space-y-1.5">
              <Label>Nro. CAB</Label>
              <Input {...register("cab")} />
            </div>
            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Descripción profesional</Label>
              <Textarea rows={3} {...register("bio")} />
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
