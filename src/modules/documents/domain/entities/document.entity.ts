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

export type SignatureType = "digital" | "huella" | "firma_manuscrita";

export interface SignatureEntity {
  id: string;
  signerId: string;
  signerName: string;
  type: SignatureType;
  signedAt: Date;
  isValid: boolean;
  hash?: string;
}

export interface DocumentVersionEntity {
  id: string;
  version: number;
  content: string;
  fileUrl?: string;
  createdById: string;
  createdByName: string;
  createdAt: Date;
  notes?: string;
}

export interface DocumentEntity {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  patientId?: string;
  patientName?: string;
  authorId: string;
  authorName: string;
  currentVersionId: string;
  versions: DocumentVersionEntity[];
  signatures: SignatureEntity[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Helpers de dominio ────────────────────────────────────────────────────────

export function isSigned(doc: DocumentEntity): boolean {
  return doc.status === "firmado";
}

export function needsSignature(doc: DocumentEntity): boolean {
  return doc.status === "pendiente_firma";
}

export function isDraft(doc: DocumentEntity): boolean {
  return doc.status === "borrador";
}

export function getSignatureCount(doc: DocumentEntity): number {
  return doc.signatures.filter((s) => s.isValid).length;
}
