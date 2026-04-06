import type { PatientEntity, PatientGender } from "../entities/patient.entity";

export interface PatientFilters {
  search?: string;
  gender?: PatientGender;
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

export interface CreatePatientInput {
  dni: string;
  name: string;
  lastName: string;
  birthDate: string;
  gender: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  bloodType?: string;
}

export interface UpdatePatientInput {
  name?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  bloodType?: string;
}

export interface IPatientRepository {
  findAll(filters?: PatientFilters): Promise<PaginatedPatients>;
  findById(id: string): Promise<PatientEntity | null>;
  create(input: CreatePatientInput): Promise<PatientEntity>;
  update(id: string, input: UpdatePatientInput): Promise<PatientEntity>;
}
