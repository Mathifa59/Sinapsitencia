import type {
  IPatientRepository,
  PatientFilters,
  PaginatedPatients,
  CreatePatientInput,
  UpdatePatientInput,
} from "../../domain/repositories/IPatientRepository";
import type { PatientEntity } from "../../domain/entities/patient.entity";
import { mockPatients } from "@/mocks/cases";

function toEntity(raw: (typeof mockPatients)[0]): PatientEntity {
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

export class MockPatientRepository implements IPatientRepository {
  private patients: PatientEntity[] = mockPatients.map(toEntity);

  async findAll(filters?: PatientFilters): Promise<PaginatedPatients> {
    await new Promise((r) => setTimeout(r, 250));

    let data = [...this.patients];

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      data = data.filter(
        (p) =>
          p.fullName.toLowerCase().includes(query) ||
          p.dni.includes(query)
      );
    }

    if (filters?.gender) {
      data = data.filter((p) => p.gender === filters.gender);
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

  async findById(id: string): Promise<PatientEntity | null> {
    await new Promise((r) => setTimeout(r, 150));
    return this.patients.find((p) => p.id === id) ?? null;
  }

  async create(input: CreatePatientInput): Promise<PatientEntity> {
    await new Promise((r) => setTimeout(r, 350));
    const newPatient: PatientEntity = {
      id: `p${Date.now()}`,
      dni: input.dni,
      fullName: `${input.name} ${input.lastName}`,
      birthDate: new Date(input.birthDate),
      gender: input.gender,
      phone: input.phone,
      email: input.email,
      address: input.address,
      bloodType: input.bloodType,
      createdAt: new Date(),
    };
    this.patients.push(newPatient);
    return newPatient;
  }

  async update(id: string, input: UpdatePatientInput): Promise<PatientEntity> {
    await new Promise((r) => setTimeout(r, 300));
    const idx = this.patients.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Paciente "${id}" no encontrado`);

    const current = this.patients[idx];
    const updatedFullName =
      input.name || input.lastName
        ? `${input.name ?? ""} ${input.lastName ?? ""}`.trim() || current.fullName
        : current.fullName;

    this.patients[idx] = {
      ...current,
      fullName: updatedFullName,
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.bloodType !== undefined && { bloodType: input.bloodType }),
    };
    return this.patients[idx];
  }
}
