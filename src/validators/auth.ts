import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  // Paso 1: Datos básicos
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
  role: z.enum(["doctor", "lawyer"]),

  // Paso 2: Datos profesionales (doctor)
  cmp: z.string().optional(),
  specialty: z.string().optional(),
  hospital: z.string().optional(),

  // Paso 2: Datos profesionales (lawyer)
  cab: z.string().optional(),
  legalSpecialties: z.array(z.string()).optional(),
  medicalAreas: z.array(z.string()).optional(),
})
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine(
    (d) => {
      if (d.role === "doctor") return !!d.specialty;
      return true;
    },
    { message: "La especialidad es requerida", path: ["specialty"] }
  )
  .refine(
    (d) => {
      if (d.role === "lawyer")
        return d.legalSpecialties && d.legalSpecialties.length > 0;
      return true;
    },
    { message: "Selecciona al menos una especialidad legal", path: ["legalSpecialties"] }
  )
  .refine(
    (d) => {
      if (d.role === "lawyer")
        return d.medicalAreas && d.medicalAreas.length > 0;
      return true;
    },
    { message: "Selecciona al menos un área médica", path: ["medicalAreas"] }
  );

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
