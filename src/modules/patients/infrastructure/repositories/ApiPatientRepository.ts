import { apiFetch } from "@/lib/api";
import type {
  IPatientRepository,
  PatientFilters,
  PaginatedPatients,
  CreatePatientInput,
  UpdatePatientInput,
} from "../../domain/repositories/IPatientRepository";
import type { PatientEntity } from "../../domain/entities/patient.entity";

interface PatientRaw {
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

function toEntity(raw: PatientRaw): PatientEntity {
  return {
    id: raw.id,
    dni: raw.dni,
    fullName: `${raw.name} ${raw.lastName}`,
    birthDate: new Date(raw.birthDate),
    gender: raw.gender,
    phone: raw.phone,
    email: raw.email,
    address: raw.address,
    bloodType: raw.bloodType,
    createdAt: new Date(raw.createdAt),
  };
}

function buildParams(filters?: PatientFilters): string {
  const p = new URLSearchParams();
  if (filters?.search) p.set("search", filters.search);
  if (filters?.gender) p.set("gender", filters.gender);
  if (filters?.page) p.set("page", String(filters.page));
  if (filters?.pageSize) p.set("pageSize", String(filters.pageSize));
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

export class ApiPatientRepository implements IPatientRepository {
  async findAll(filters?: PatientFilters): Promise<PaginatedPatients> {
    const raw = await apiFetch<{ data: PatientRaw[]; total: number; page: number; pageSize: number; totalPages: number }>(
      `/api/patients${buildParams(filters)}`
    );
    return { ...raw, data: raw.data.map(toEntity) };
  }

  async findById(id: string): Promise<PatientEntity | null> {
    try {
      const raw = await apiFetch<PatientRaw>(`/api/patients/${id}`);
      return toEntity(raw);
    } catch {
      return null;
    }
  }

  async create(input: CreatePatientInput): Promise<PatientEntity> {
    const raw = await apiFetch<PatientRaw>("/api/patients", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return toEntity(raw);
  }

  async update(id: string, input: UpdatePatientInput): Promise<PatientEntity> {
    const raw = await apiFetch<PatientRaw>(`/api/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    return toEntity(raw);
  }
}
