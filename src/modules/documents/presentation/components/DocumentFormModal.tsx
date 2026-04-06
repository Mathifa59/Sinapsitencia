"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useCreateDocument } from "../hooks/useDocuments";
import { usePatients } from "@/modules/patients/presentation/hooks/usePatients";
import { useAuthStore } from "@/store/auth.store";
import { DOCUMENT_TYPE_LABELS } from "@/constants";
import type { DocumentType } from "../../domain/entities/document.entity";

// ─── Schema ───────────────────────────────────────────────────────────────────

const documentFormSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  type: z.enum([
    "historia_clinica",
    "consentimiento_informado",
    "informe_medico",
    "receta",
    "orden_laboratorio",
    "certificado_medico",
    "documento_legal",
    "otro",
  ]),
  patientId: z.string().optional(),
  initialContent: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface DocumentFormModalProps {
  open: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DOCUMENT_TYPES: DocumentType[] = [
  "historia_clinica",
  "consentimiento_informado",
  "informe_medico",
  "receta",
  "orden_laboratorio",
  "certificado_medico",
  "documento_legal",
  "otro",
];

export function DocumentFormModal({ open, onClose }: DocumentFormModalProps) {
  const { user } = useAuthStore();
  const { mutateAsync: createDocument, isPending } = useCreateDocument();
  const { data: paginatedPatients } = usePatients({ pageSize: 100 });
  const patients = paginatedPatients?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: "",
      type: "informe_medico",
      patientId: "",
      initialContent: "",
    },
  });

  const selectedType = watch("type");
  const selectedPatientId = watch("patientId");

  const onSubmit = async (formValues: DocumentFormValues) => {
    if (!user) return;
    const selectedPatient = patients.find((p) => p.id === formValues.patientId);
    try {
      await createDocument({
        title: formValues.title,
        type: formValues.type as DocumentType,
        authorId: user.id,
        authorName: user.name,
        patientId: formValues.patientId || undefined,
        patientName: selectedPatient?.fullName,
        initialContent: formValues.initialContent || undefined,
      });
      reset();
      onClose();
    } catch {
      // Errores visibles en consola en modo demo
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo documento</DialogTitle>
          <DialogDescription>
            Crea un nuevo documento clínico o legal en el sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Título */}
          <div className="space-y-1.5">
            <Label htmlFor="doc-title">Título *</Label>
            <Input
              id="doc-title"
              placeholder="Ej: Informe de consulta — Dr. García"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo */}
            <div className="space-y-1.5">
              <Label>Tipo de documento *</Label>
              <Select
                value={selectedType}
                onValueChange={(val) => setValue("type", val as DocumentType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((docType) => (
                    <SelectItem key={docType} value={docType}>
                      {DOCUMENT_TYPE_LABELS[docType]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Paciente */}
            <div className="space-y-1.5">
              <Label>Paciente asociado</Label>
              <Select
                value={selectedPatientId ?? ""}
                onValueChange={(val) => setValue("patientId", val || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin paciente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin paciente</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contenido inicial */}
          <div className="space-y-1.5">
            <Label htmlFor="doc-content">Contenido inicial</Label>
            <Textarea
              id="doc-content"
              placeholder="Escribe el contenido del documento..."
              rows={4}
              {...register("initialContent")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Crear documento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
