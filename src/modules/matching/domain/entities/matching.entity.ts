export type ContactRequestStatus =
  | "pendiente"
  | "aceptado"
  | "rechazado"
  | "cancelado";

export interface LawyerProfileEntity {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  cab: string;
  specialties: string[];
  yearsExperience: number;
  phone: string;
  bio?: string;
  available: boolean;
  rating: number;
  casesHandled: number;
}

export interface DoctorProfileEntity {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  cmp: string;
  specialty: string;
  hospital: string;
  yearsExperience: number;
  phone: string;
  bio?: string;
}

export interface MatchRecommendationEntity {
  id: string;
  doctorId: string;
  lawyer: LawyerProfileEntity;
  score: number;
  reasons: string[];
  createdAt: Date;
}

export interface ContactRequestEntity {
  id: string;
  fromDoctorId: string;
  fromDoctor: DoctorProfileEntity;
  toLawyerId: string;
  toLawyer: LawyerProfileEntity;
  caseId?: string;
  caseTitle?: string;
  status: ContactRequestStatus;
  message: string;
  responseMessage?: string;
  createdAt: Date;
  respondedAt?: Date;
}

// ─── Helpers de dominio ────────────────────────────────────────────────────────

export function isHighMatch(rec: MatchRecommendationEntity): boolean {
  return rec.score >= 90;
}

export function isPendingRequest(req: ContactRequestEntity): boolean {
  return req.status === "pendiente";
}
