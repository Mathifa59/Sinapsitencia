// ─── Roles ────────────────────────────────────────────────────────────────────
export type UserRole = "doctor" | "lawyer" | "admin";

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

// ─── Profiles ─────────────────────────────────────────────────────────────────
export interface DoctorProfile {
  id: string;
  userId: string;
  user: User;
  cmp: string; // Colegio Médico del Perú
  specialty: string;
  hospital: string;
  hospitalId: string;
  yearsExperience: number;
  phone: string;
  bio?: string;
}

export interface LawyerProfile {
  id: string;
  userId: string;
  user: User;
  cab: string; // Colegio de Abogados
  specialties: string[];
  yearsExperience: number;
  phone: string;
  bio?: string;
  available: boolean;
  rating: number;
  casesHandled: number;
}

export interface AdminProfile {
  id: string;
  userId: string;
  user: User;
  hospital: string;
  hospitalId: string;
  department: string;
}

// ─── Hospital ─────────────────────────────────────────────────────────────────
export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  isActive: boolean;
}

// ─── Patient ──────────────────────────────────────────────────────────────────
export interface Patient {
  id: string;
  dni: string;
  name: string;
  lastName: string;
  birthDate: string;
  gender: "M" | "F" | "other";
  phone?: string;
  email?: string;
  address?: string;
  bloodType?: string;
  createdAt: string;
}

// ─── Clinical Episode ─────────────────────────────────────────────────────────
export type EpisodeStatus = "active" | "closed" | "archived";

export interface ClinicalEpisode {
  id: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  doctor: DoctorProfile;
  hospitalId: string;
  title: string;
  description: string;
  diagnosis?: string;
  status: EpisodeStatus;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

// ─── Documents ────────────────────────────────────────────────────────────────
export type DocumentType =
  | "historia_clinica"
  | "consentimiento_informado"
  | "informe_medico"
  | "receta"
  | "orden_laboratorio"
  | "certificado_medico"
  | "documento_legal"
  | "otro";

export type DocumentStatus =
  | "borrador"
  | "pendiente_firma"
  | "firmado"
  | "archivado";

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  episodeId?: string;
  patientId?: string;
  patient?: Patient;
  authorId: string;
  author: User;
  currentVersionId: string;
  versions: DocumentVersion[];
  signatures: SignatureRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  createdById: string;
  createdBy: User;
  createdAt: string;
  notes?: string;
}

// ─── Consent ──────────────────────────────────────────────────────────────────
export type ConsentStatus = "pendiente" | "firmado" | "rechazado" | "expirado";

export interface ConsentRecord {
  id: string;
  documentId: string;
  document: Document;
  patientId: string;
  patient: Patient;
  doctorId: string;
  doctor: DoctorProfile;
  status: ConsentStatus;
  signedAt?: string;
  expiresAt?: string;
  ipAddress?: string;
  notes?: string;
  createdAt: string;
}

// ─── Signatures ───────────────────────────────────────────────────────────────
export type SignatureType = "digital" | "huella" | "firma_manuscrita";

export interface SignatureRecord {
  id: string;
  documentId: string;
  signerId: string;
  signer: User;
  type: SignatureType;
  signedAt: string;
  ipAddress?: string;
  isValid: boolean;
  hash?: string;
}

// ─── Legal Case ───────────────────────────────────────────────────────────────
export type CaseStatus =
  | "nuevo"
  | "en_revision"
  | "activo"
  | "cerrado"
  | "archivado";

export type CasePriority = "baja" | "media" | "alta" | "critica";

export interface LegalCase {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  doctorId: string;
  doctor: DoctorProfile;
  lawyerId?: string;
  lawyer?: LawyerProfile;
  patientId?: string;
  patient?: Patient;
  episodeId?: string;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// ─── Matching ─────────────────────────────────────────────────────────────────
export interface MatchRecommendation {
  id: string;
  doctorId: string;
  lawyerId: string;
  lawyer: LawyerProfile;
  score: number;
  reasons: string[];
  createdAt: string;
}

export type ContactRequestStatus =
  | "pendiente"
  | "aceptado"
  | "rechazado"
  | "cancelado";

export interface ContactRequest {
  id: string;
  fromDoctorId: string;
  fromDoctor: DoctorProfile;
  toLawyerId: string;
  toLawyer: LawyerProfile;
  caseId?: string;
  case?: LegalCase;
  status: ContactRequestStatus;
  message: string;
  responseMessage?: string;
  createdAt: string;
  respondedAt?: string;
}

// ─── Audit ────────────────────────────────────────────────────────────────────
export type AuditAction =
  | "login"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "view"
  | "sign"
  | "download"
  | "share";

export interface AuditLog {
  id: string;
  userId: string;
  user: User;
  action: AuditAction;
  resource: string;
  resourceId: string;
  description: string;
  ipAddress: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── API helpers ──────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}
