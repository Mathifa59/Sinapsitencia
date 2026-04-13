"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser } from "../hooks/useUsers";
import type { UserRole } from "@/modules/auth/domain/entities/session.entity";

// ─── Schema ───────────────────────────────────────────────────────────────────

const userFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().min(1, "El correo es requerido").email("Correo electrónico inválido"),
  role: z.enum(["doctor", "lawyer", "admin"]),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UserFormModal({ open, onClose }: UserFormModalProps) {
  const { mutateAsync: createUser, isPending } = useCreateUser();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "doctor",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (formValues: UserFormValues) => {
    setServerError(null);
    try {
      await createUser({
        name: formValues.name,
        email: formValues.email,
        role: formValues.role as UserRole,
      });
      reset();
      onClose();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Error al crear el usuario");
    }
  };

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>
            Crea una cuenta para un médico, abogado o administrador del sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre completo */}
          <div className="space-y-1.5">
            <Label htmlFor="user-name">Nombre completo *</Label>
            <Input
              id="user-name"
              placeholder="Ej: Dr. Juan Pérez"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Correo electrónico */}
          <div className="space-y-1.5">
            <Label htmlFor="user-email">Correo electrónico *</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="usuario@sinapsistencia.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Rol */}
          <div className="space-y-1.5">
            <Label>Rol *</Label>
            <Select
              value={selectedRole}
              onValueChange={(val) => setValue("role", val as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Médico</SelectItem>
                <SelectItem value="lawyer">Abogado</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {serverError}
            </p>
          )}

          <p className="text-xs text-slate-400">
            Se generará una contraseña temporal y se enviará al correo del usuario.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              className="gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Crear usuario
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
