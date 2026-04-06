import type {
  IPatientRepository,
  PatientFilters,
  PaginatedPatients,
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
}
