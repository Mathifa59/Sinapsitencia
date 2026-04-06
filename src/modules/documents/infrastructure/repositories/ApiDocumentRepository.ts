import { apiFetch } from "@/lib/api";
import type {
  IDocumentRepository,
  DocumentFilters,
  PaginatedDocuments,
  CreateDocumentInput,
} from "../../domain/repositories/IDocumentRepository";
import type { DocumentEntity, DocumentStatus } from "../../domain/entities/document.entity";

// Tipo crudo que retorna la API (fechas como strings)
interface DocumentRaw {
  id: string;
  title: string;
  type: DocumentEntity["type"];
  status: DocumentEntity["status"];
  patientId?: string;
  patient?: { name: string; lastName: string };
  authorId: string;
  author: { id: string; name: string };
  currentVersionId: string;
  versions: Array<{
    id: string;
    version: number;
    content: string;
    createdById: string;
    createdBy: { name: string };
    createdAt: string;
    notes?: string;
  }>;
  signatures: Array<{
    id: string;
    signerId: string;
    signer: { name: string };
    type: "digital" | "huella" | "firma_manuscrita";
    signedAt: string;
    isValid: boolean;
    hash?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

function toEntity(raw: DocumentRaw): DocumentEntity {
  return {
    id: raw.id,
    title: raw.title,
    type: raw.type,
    status: raw.status,
    patientId: raw.patientId,
    patientName: raw.patient ? `${raw.patient.name} ${raw.patient.lastName}` : undefined,
    authorId: raw.authorId,
    authorName: raw.author.name,
    currentVersionId: raw.currentVersionId,
    versions: raw.versions.map((v) => ({
      id: v.id,
      version: v.version,
      content: v.content,
      createdById: v.createdById,
      createdByName: v.createdBy.name,
      createdAt: new Date(v.createdAt),
      notes: v.notes,
    })),
    signatures: raw.signatures.map((s) => ({
      id: s.id,
      signerId: s.signerId,
      signerName: s.signer.name,
      type: s.type,
      signedAt: new Date(s.signedAt),
      isValid: s.isValid,
      hash: s.hash,
    })),
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

function buildParams(filters?: DocumentFilters): string {
  const p = new URLSearchParams();
  if (filters?.status) p.set("status", filters.status);
  if (filters?.type) p.set("type", filters.type);
  if (filters?.patientId) p.set("patientId", filters.patientId);
  if (filters?.search) p.set("search", filters.search);
  if (filters?.page) p.set("page", String(filters.page));
  if (filters?.pageSize) p.set("pageSize", String(filters.pageSize));
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

export class ApiDocumentRepository implements IDocumentRepository {
  async findAll(filters?: DocumentFilters): Promise<PaginatedDocuments> {
    const raw = await apiFetch<{ data: DocumentRaw[]; total: number; page: number; pageSize: number; totalPages: number }>(
      `/api/documents${buildParams(filters)}`
    );
    return { ...raw, data: raw.data.map(toEntity) };
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    try {
      const raw = await apiFetch<DocumentRaw>(`/api/documents/${id}`);
      return toEntity(raw);
    } catch {
      return null;
    }
  }

  async findByAuthor(authorId: string, filters?: DocumentFilters): Promise<PaginatedDocuments> {
    return this.findAll({ ...filters, ...({ authorId } as Record<string, string>) });
  }

  async create(input: CreateDocumentInput): Promise<DocumentEntity> {
    const raw = await apiFetch<DocumentRaw>("/api/documents", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return toEntity(raw);
  }

  async updateStatus(id: string, status: DocumentStatus): Promise<DocumentEntity> {
    const raw = await apiFetch<DocumentRaw>(`/api/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return toEntity(raw);
  }
}
