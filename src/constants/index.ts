import type { DocumentType, DocumentStatus, CaseStatus, CasePriority, ConsentStatus, UserRole } from "@/types";

export const ROLE_LABELS: Record<UserRole, string> = {
  doctor: "Médico",
  lawyer: "Abogado",
  admin: "Administrador",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  historia_clinica: "Historia Clínica",
  consentimiento_informado: "Consentimiento Informado",
  informe_medico: "Informe Médico",
  receta: "Receta Médica",
  orden_laboratorio: "Orden de Laboratorio",
  certificado_medico: "Certificado Médico",
  documento_legal: "Documento Legal",
  otro: "Otro",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  borrador: "Borrador",
  pendiente_firma: "Pendiente de Firma",
  firmado: "Firmado",
  archivado: "Archivado",
};

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  nuevo: "Nuevo",
  en_revision: "En Revisión",
  activo: "Activo",
  cerrado: "Cerrado",
  archivado: "Archivado",
};

export const CASE_PRIORITY_LABELS: Record<CasePriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  critica: "Crítica",
};

export const CONSENT_STATUS_LABELS: Record<ConsentStatus, string> = {
  pendiente: "Pendiente",
  firmado: "Firmado",
  rechazado: "Rechazado",
  expirado: "Expirado",
};

export const MEDICAL_SPECIALTIES = [
  "Medicina General",
  "Cirugía General",
  "Cardiología",
  "Neurología",
  "Oncología",
  "Pediatría",
  "Ginecología y Obstetricia",
  "Traumatología",
  "Oftalmología",
  "Dermatología",
  "Psiquiatría",
  "Urología",
  "Gastroenterología",
  "Endocrinología",
  "Reumatología",
  "Neumología",
  "Nefrología",
  "Infectología",
  "Hematología",
  "Anestesiología",
];

export const LEGAL_SPECIALTIES = [
  "Derecho Médico",
  "Responsabilidad Civil Médica",
  "Derecho Penal Médico",
  "Bioética y Derecho",
  "Seguros Médicos",
  "Derecho Sanitario",
  "Negligencia Médica",
  "Consentimiento Informado",
];

export const NAVIGATION_DOCTOR = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: "LayoutDashboard" },
  { label: "Mis Casos", href: "/doctor/cases", icon: "Briefcase" },
  { label: "Documentos", href: "/doctor/documents", icon: "FileText" },
  { label: "Abogados", href: "/doctor/lawyers", icon: "Scale" },
  { label: "Mi Perfil", href: "/doctor/profile", icon: "User" },
];

export const NAVIGATION_LAWYER = [
  { label: "Dashboard", href: "/lawyer/dashboard", icon: "LayoutDashboard" },
  { label: "Solicitudes", href: "/lawyer/requests", icon: "Bell" },
  { label: "Médicos", href: "/lawyer/doctors", icon: "Stethoscope" },
  { label: "Mi Perfil", href: "/lawyer/profile", icon: "User" },
];

export const NAVIGATION_ADMIN = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Usuarios", href: "/admin/users", icon: "Users" },
  { label: "Pacientes", href: "/admin/patients", icon: "Heart" },
  { label: "Episodios", href: "/admin/episodes", icon: "Activity" },
  { label: "Documentos", href: "/admin/documents", icon: "FolderOpen" },
  { label: "Auditoría", href: "/admin/audit", icon: "ShieldCheck" },
];
