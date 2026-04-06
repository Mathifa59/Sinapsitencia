import { z } from "zod";

export const caseFormSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  priority: z.enum(["baja", "media", "alta", "critica"]),
  patientId: z.string().optional(),
  notes: z.string().optional(),
});

export type CaseFormValues = z.infer<typeof caseFormSchema>;
