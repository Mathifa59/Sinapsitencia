import type {
  ICaseRepository,
  CaseFilters,
  PaginatedCases,
  CreateCaseInput,
} from "../../domain/repositories/ICaseRepository";
import type { LegalCaseEntity } from "../../domain/entities/legal-case.entity";
import { mockCases } from "@/mocks/cases";
import { mockLawyerProfiles, mockDoctorProfiles } from "@/mocks/users";

/** Mapea el tipo legacy de @/mocks a la entidad del dominio */
function toEntity(raw: (typeof mockCases)[0]): LegalCaseEntity {
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
    documentIds: raw.documents.map((d) => d.id),
    notes: raw.notes,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

export class MockCaseRepository implements ICaseRepository {
  private cases: LegalCaseEntity[] = mockCases.map(toEntity);

  async findAll(filters?: CaseFilters): Promise<PaginatedCases> {
    await new Promise((r) => setTimeout(r, 300));

    let data = [...this.cases];

    if (filters?.status) data = data.filter((c) => c.status === filters.status);
    if (filters?.priority) data = data.filter((c) => c.priority === filters.priority);
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      data = data.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.patient?.fullName.toLowerCase().includes(query)
      );
    }

    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const total = data.length;
    const paginated = data.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  async findByDoctorId(
    doctorId: string,
    filters?: CaseFilters
  ): Promise<PaginatedCases> {
    await new Promise((r) => setTimeout(r, 300));

    let data = this.cases.filter((c) => c.doctorId === doctorId);

    if (filters?.status) data = data.filter((c) => c.status === filters.status);
    if (filters?.priority) data = data.filter((c) => c.priority === filters.priority);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.patient?.fullName.toLowerCase().includes(q)
      );
    }

    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const total = data.length;
    const paginated = data.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  async findById(id: string): Promise<LegalCaseEntity | null> {
    await new Promise((r) => setTimeout(r, 200));
    return this.cases.find((c) => c.id === id) ?? null;
  }

  async create(data: CreateCaseInput): Promise<LegalCaseEntity> {
    await new Promise((r) => setTimeout(r, 400));
    const doctor = mockDoctorProfiles.find((d) => d.userId === data.doctorId)
      ?? mockDoctorProfiles[0];

    const newCase: LegalCaseEntity = {
      id: `c${Date.now()}`,
      title: data.title,
      description: data.description,
      status: "nuevo",
      priority: data.priority,
      doctorId: data.doctorId,
      doctor: {
        id: doctor.id,
        userId: doctor.userId,
        fullName: doctor.user.name,
        cmp: doctor.cmp,
        specialty: doctor.specialty,
        hospital: doctor.hospital,
      },
      documentIds: [],
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cases.push(newCase);
    return newCase;
  }

  async updateStatus(
    id: string,
    status: LegalCaseEntity["status"]
  ): Promise<LegalCaseEntity> {
    await new Promise((r) => setTimeout(r, 300));
    const idx = this.cases.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Caso "${id}" no encontrado`);
    this.cases[idx] = { ...this.cases[idx], status, updatedAt: new Date() };
    return this.cases[idx];
  }

  async assignLawyer(
    caseId: string,
    lawyerId: string
  ): Promise<LegalCaseEntity> {
    await new Promise((r) => setTimeout(r, 300));
    const idx = this.cases.findIndex((c) => c.id === caseId);
    if (idx === -1) throw new Error(`Caso "${caseId}" no encontrado`);
    const raw = mockLawyerProfiles.find((l) => l.id === lawyerId);
    if (!raw) throw new Error(`Abogado "${lawyerId}" no encontrado`);
    this.cases[idx] = {
      ...this.cases[idx],
      lawyer: {
        id: raw.id,
        userId: raw.userId,
        fullName: raw.user.name,
        cab: raw.cab,
        specialties: raw.specialties,
        phone: raw.phone,
      },
      updatedAt: new Date(),
    };
    return this.cases[idx];
  }
}
