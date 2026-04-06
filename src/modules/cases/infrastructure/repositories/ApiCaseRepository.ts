import { apiFetch } from "@/lib/api";
import type {
  ICaseRepository,
  CaseFilters,
  PaginatedCases,
  CreateCaseInput,
} from "../../domain/repositories/ICaseRepository";
import type { LegalCaseEntity, CaseStatus } from "../../domain/entities/legal-case.entity";

// Tipo crudo retornado por la API
interface CaseRaw {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: LegalCaseEntity["priority"];
  doctorId: string;
  doctor: {
    id: string;
    userId: string;
    user: { name: string };
    cmp: string;
    specialty: string;
    hospital: string;
  };
  lawyerId?: string;
  lawyer?: {
    id: string;
    userId: string;
    user: { name: string };
    cab: string;
    specialties: string[];
    phone: string;
  };
  patientId?: string;
  patient?: {
    id: string;
    dni: string;
    name: string;
    lastName: string;
    bloodType?: string;
    phone?: string;
    gender?: "M" | "F" | "other";
  };
  documents: string[];
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
    doctor: {
      id: raw.doctor.id,
      userId: raw.doctor.userId,
      fullName: raw.doctor.user.name,
      cmp: raw.doctor.cmp,
      specialty: raw.doctor.specialty,
      hospital: raw.doctor.hospital,
    },
    lawyer: raw.lawyer
      ? {
          id: raw.lawyer.id,
          userId: raw.lawyer.userId,
          fullName: raw.lawyer.user.name,
          cab: raw.lawyer.cab,
          specialties: raw.lawyer.specialties,
          phone: raw.lawyer.phone,
        }
      : undefined,
    patient: raw.patient
      ? {
          id: raw.patient.id,
          dni: raw.patient.dni,
          fullName: `${raw.patient.name} ${raw.patient.lastName}`,
          bloodType: raw.patient.bloodType,
          phone: raw.patient.phone,
          gender: raw.patient.gender,
        }
      : undefined,
    documentIds: raw.documents ?? [],
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
