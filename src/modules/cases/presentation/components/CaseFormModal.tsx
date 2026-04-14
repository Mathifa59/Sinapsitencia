"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateCase } from "../hooks/useCases";
import { usePatients } from "@/modules/patients/presentation/hooks/usePatients";
import { useAuthStore } from "@/store/auth.store";
import { caseFormSchema, type CaseFormValues } from "@/validators/case";
import type { CasePriority } from "../../domain/entities/legal-case.entity";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CaseFormModalProps {
  open: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CaseFormModal({ open, onClose }: CaseFormModalProps) {
  const { user } = useAuthStore();
  const { mutateAsync: createCase, isPending } = useCreateCase(user?.id ?? "");
  const { data: paginatedPatients } = usePatients({ pageSize: 100 });
  const patients = paginatedPatients?.data ?? [];
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CaseFormValues>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "media",
      patientId: "",
      notes: "",
    },
  });

  const selectedPriority = watch("priority");
  const selectedPatientId = watch("patientId");

  const onSubmit = async (formValues: CaseFormValues) => {
    setServerError(null);
    try {
      await createCase({
        title: formValues.title,
        description: formValues.description,
        priority: formValues.priority as CasePriority,
        doctorId: user?.id ?? "",
        patientId: formValues.patientId || undefined,
        notes: formValues.notes || undefined,
      });
      reset();
      onClose();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Error al crear el caso");
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
          <DialogTitle>Nuevo caso</DialogTitle>
          <DialogDescription>
            Registra un nuevo caso clínico-legal para seguimiento y gestión.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Título */}
          <div className="space-y-1.5">
            <Label htmlFor="case-title">Título del caso *</Label>
            <Input
              id="case-title"
              placeholder="Ej: Revisión de consentimiento informado — Cirugía"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <Label htmlFor="case-description">Descripción *</Label>
            <Textarea
              id="case-description"
              placeholder="Describe el contexto clínico y los aspectos legales relevantes..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Prioridad */}
            <div className="space-y-1.5">
              <Label>Prioridad *</Label>
              <Select
                value={selectedPriority}
                onValueChange={(val) => setValue("priority", val as CasePriority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Paciente */}
            <div className="space-y-1.5">
              <Label>Paciente asociado</Label>
              <Select
                value={selectedPatientId || "__none__"}
                onValueChange={(val) => setValue("patientId", val === "__none__" ? "" : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin paciente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Sin paciente asignado</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <Label htmlFor="case-notes">Notas adicionales</Label>
            <Textarea
              id="case-notes"
              placeholder="Observaciones o información adicional relevante..."
              rows={2}
              {...register("notes")}
            />
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
              Crear caso
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
