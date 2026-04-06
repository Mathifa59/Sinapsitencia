export type CaseStatus = "nuevo" | "en_revision" | "activo" | "cerrado" | "archivado";
export type CasePriority = "baja" | "media" | "alta" | "critica";

export interface PatientSnapshot {
  id: string;
  dni: string;
  fullName: string;
  bloodType?: string;
  phone?: string;
  gender?: "M" | "F" | "other";
}

export interface LawyerSnapshot {
  id: string;
  userId: string;
  fullName: string;
  cab: string;
  specialties: string[];
  phone: string;
}

export interface DoctorSnapshot {
  id: string;
  userId: string;
  fullName: string;
  cmp: string;
  specialty: string;
  hospital: string;
}

export interface LegalCaseEntity {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  doctorId: string;
  doctor: DoctorSnapshot;
  lawyer?: LawyerSnapshot;
  patient?: PatientSnapshot;
  episodeId?: string;
  documentIds: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Helpers de dominio ────────────────────────────────────────────────────────

export function isActiveCase(c: LegalCaseEntity): boolean {
  return c.status === "activo" || c.status === "en_revision";
}

export function isCritical(c: LegalCaseEntity): boolean {
  return c.priority === "critica" || c.priority === "alta";
}

export function hasLawyer(c: LegalCaseEntity): boolean {
  return c.lawyer !== undefined;
}

export function needsAttention(c: LegalCaseEntity): boolean {
  return isActiveCase(c) && !hasLawyer(c) && isCritical(c);
}
