export type PatientGender = "M" | "F" | "other";

export interface PatientEntity {
  id: string;
  dni: string;
  fullName: string;
  birthDate: Date;
  gender: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  bloodType?: string;
  createdAt: Date;
}

// ─── Helpers de dominio ────────────────────────────────────────────────────────

export function getPatientAge(patient: PatientEntity): number {
  const today = new Date();
  const birth = patient.birthDate;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function formatPatientGender(gender: PatientGender): string {
  const labels: Record<PatientGender, string> = {
    M: "Masculino",
    F: "Femenino",
    other: "Otro",
  };
  return labels[gender];
}
