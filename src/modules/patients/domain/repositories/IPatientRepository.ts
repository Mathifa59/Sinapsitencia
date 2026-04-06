import type { PatientEntity } from "../entities/patient.entity";

export interface PatientFilters {
  search?: string;
  gender?: "M" | "F" | "other";
  page?: number;
  pageSize?: number;
}

export interface PaginatedPatients {
  data: PatientEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IPatientRepository {
  findAll(filters?: PatientFilters): Promise<PaginatedPatients>;
  findById(id: string): Promise<PatientEntity | null>;
}
