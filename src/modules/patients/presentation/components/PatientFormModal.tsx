"use client";

import { useEffect, useState } from "react";
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
import { useCreatePatient, useUpdatePatient } from "../hooks/usePatients";
import type { PatientEntity } from "../../domain/entities/patient.entity";
import type {
  CreatePatientInput,
  UpdatePatientInput,
} from "../../domain/repositories/IPatientRepository";

// ─── Schema ───────────────────────────────────────────────────────────────────

const patientFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  dni: z.string().min(7, "El DNI debe tener al menos 7 caracteres"),
  birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
  gender: z.enum(["M", "F", "other"]),
  phone: z.string().optional(),
  email: z.string().optional(),
  bloodType: z.string().optional(),
  address: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface PatientFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Si se proporciona, el modal opera en modo edición */
  patient?: PatientEntity;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PatientFormModal({ open, onClose, patient }: PatientFormModalProps) {
  const isEditMode = Boolean(patient);

  const { mutateAsync: createPatient, isPending: isCreating } = useCreatePatient();
  const { mutateAsync: updatePatient, isPending: isUpdating } = useUpdatePatient();
  const isPending = isCreating || isUpdating;
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      lastName: "",
      dni: "",
      birthDate: "",
      gender: "M",
      phone: "",
      email: "",
      bloodType: "",
      address: "",
    },
  });

  const selectedGender = watch("gender");

  // Populate form when editing or reset when creating
  useEffect(() => {
    if (!open) return;

    if (patient) {
      const nameParts = patient.fullName.split(" ");
      const firstName = nameParts[0] ?? "";
      const lastName = nameParts.slice(1).join(" ");
      reset({
        name: firstName,
        lastName,
        dni: patient.dni,
        birthDate: patient.birthDate.toISOString().split("T")[0],
        gender: patient.gender,
        phone: patient.phone ?? "",
        email: patient.email ?? "",
        bloodType: patient.bloodType ?? "",
        address: patient.address ?? "",
      });
    } else {
      reset({
        name: "",
        lastName: "",
        dni: "",
        birthDate: "",
        gender: "M",
        phone: "",
        email: "",
        bloodType: "",
        address: "",
      });
    }
  }, [patient, open, reset]);

  const onSubmit = async (formValues: PatientFormValues) => {
    setServerError(null);
    try {
      if (isEditMode && patient) {
        const updateInput: UpdatePatientInput = {
          name: formValues.name,
          lastName: formValues.lastName,
          phone: formValues.phone || undefined,
          email: formValues.email || undefined,
          bloodType: formValues.bloodType || undefined,
          address: formValues.address || undefined,
        };
        await updatePatient({ id: patient.id, input: updateInput });
      } else {
        const createInput: CreatePatientInput = {
          name: formValues.name,
          lastName: formValues.lastName,
          dni: formValues.dni,
          birthDate: formValues.birthDate,
          gender: formValues.gender,
          phone: formValues.phone || undefined,
          email: formValues.email || undefined,
          bloodType: formValues.bloodType || undefined,
          address: formValues.address || undefined,
        };
        await createPatient(createInput);
      }
      onClose();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Error al guardar el paciente");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) { setServerError(null); onClose(); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar paciente" : "Registrar paciente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifica los datos del paciente y guarda los cambios."
              : "Completa los datos para registrar un nuevo paciente en el sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-name">Nombre *</Label>
              <Input
                id="patient-name"
                placeholder="Ej: María"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Apellido */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-lastName">Apellido *</Label>
              <Input
                id="patient-lastName"
                placeholder="Ej: García López"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>

            {/* DNI */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-dni">DNI / Documento *</Label>
              <Input
                id="patient-dni"
                placeholder="Ej: 12345678"
                disabled={isEditMode}
                {...register("dni")}
              />
              {errors.dni && (
                <p className="text-xs text-red-500">{errors.dni.message}</p>
              )}
            </div>

            {/* Fecha de nacimiento */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-birthDate">Fecha de nacimiento *</Label>
              <Input
                id="patient-birthDate"
                type="date"
                disabled={isEditMode}
                {...register("birthDate")}
              />
              {errors.birthDate && (
                <p className="text-xs text-red-500">{errors.birthDate.message}</p>
              )}
            </div>

            {/* Género */}
            <div className="space-y-1.5">
              <Label>Género *</Label>
              <Select
                value={selectedGender}
                disabled={isEditMode}
                onValueChange={(val) =>
                  setValue("gender", val as "M" | "F" | "other")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo sanguíneo */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-bloodType">Tipo sanguíneo</Label>
              <Input
                id="patient-bloodType"
                placeholder="Ej: O+"
                {...register("bloodType")}
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-phone">Teléfono</Label>
              <Input
                id="patient-phone"
                placeholder="Ej: 999 888 777"
                {...register("phone")}
              />
            </div>

            {/* Correo */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-email">Correo electrónico</Label>
              <Input
                id="patient-email"
                type="email"
                placeholder="paciente@correo.com"
                {...register("email")}
              />
            </div>

            {/* Dirección */}
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="patient-address">Dirección</Label>
              <Input
                id="patient-address"
                placeholder="Ej: Av. Principal 123, Lima"
                {...register("address")}
              />
            </div>
          </div>

          {serverError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {serverError}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => { setServerError(null); onClose(); }}
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
              {isEditMode ? "Guardar cambios" : "Registrar paciente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
