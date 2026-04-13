import { apiFetch } from "@/lib/api";
import type {
  ICaseRepository,
  CaseFilters,
  PaginatedCases,
  CreateCaseInput,
} from "../../domain/repositories/ICaseRepository";
import type { LegalCaseEntity, CaseStatus } from "../../domain/entities/legal-case.entity";

// Tipo crudo retornado por la API (ya camelCase, relaciones aplanadas)
interface CaseRaw {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: LegalCaseEntity["priority"];
  doctorId: string;
  doctor?: { id: string; fullName: string; email?: string };
  lawyerId?: string;
  lawyer?: { id: string; fullName: string; email?: string };
  patientId?: string;
  patient?: {
    id: string;
    fullName: string;
    dni: string;
    bloodType?: string;
    phone?: string;
    gender?: "M" | "F" | "other";
  };
  episodeId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

function toEntity(raw: CaseRaw): LegalCaseEntity {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    priority: raw.priority,
    doctorId: raw.doctorId,
    doctor: raw.doctor ?? { id: raw.doctorId, fullName: "Médico" },
    lawyer: raw.lawyer,
    patient: raw.patient,
    episodeId: raw.episodeId,
    documentIds: [],
    notes: raw.notes,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

function buildParams(filters?: CaseFilters, doctorId?: string): string {
  const p = new URLSearchParams();
  if (doctorId) p.set("doctorId", doctorId);
  if (filters?.status) p.set("status", filters.status);
  if (filters?.priority) p.set("priority", filters.priority);
  if (filters?.search) p.set("search", filters.search);
  if (filters?.page) p.set("page", String(filters.page));
  if (filters?.pageSize) p.set("pageSize", String(filters.pageSize));
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

export class ApiCaseRepository implements ICaseRepository {
  async findAll(filters?: CaseFilters): Promise<PaginatedCases> {
    const raw = await apiFetch<{ data: CaseRaw[]; total: number; page: number; pageSize: number; totalPages: number }>(
      `/api/legal-cases${buildParams(filters)}`
    );
    return { ...raw, data: raw.data.map(toEntity) };
  }

  async findByDoctorId(doctorId: string, filters?: CaseFilters): Promise<PaginatedCases> {
    const raw = await apiFetch<{ data: CaseRaw[]; total: number; page: number; pageSize: number; totalPages: number }>(
      `/api/legal-cases${buildParams(filters, doctorId)}`
    );
    return { ...raw, data: raw.data.map(toEntity) };
  }

  async findById(id: string): Promise<LegalCaseEntity | null> {
    try {
      const raw = await apiFetch<CaseRaw>(`/api/legal-cases/${id}`);
      return toEntity(raw);
    } catch {
      return null;
    }
  }

  async create(data: CreateCaseInput): Promise<LegalCaseEntity> {
    const raw = await apiFetch<CaseRaw>("/api/legal-cases", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return toEntity(raw);
  }

  async updateStatus(id: string, status: CaseStatus): Promise<LegalCaseEntity> {
    const raw = await apiFetch<CaseRaw>(`/api/legal-cases/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return toEntity(raw);
  }

  async assignLawyer(caseId: string, lawyerId: string): Promise<LegalCaseEntity> {
    const raw = await apiFetch<CaseRaw>(`/api/legal-cases/${caseId}`, {
      method: "PUT",
      body: JSON.stringify({ lawyerId }),
    });
    return toEntity(raw);
  }
}
