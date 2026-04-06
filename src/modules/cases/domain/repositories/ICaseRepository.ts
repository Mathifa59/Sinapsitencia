import type { LegalCaseEntity, CaseStatus, CasePriority } from "../entities/legal-case.entity";

export interface CaseFilters {
  status?: CaseStatus;
  priority?: CasePriority;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedCases {
  data: LegalCaseEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateCaseInput {
  title: string;
  description: string;
  priority: CasePriority;
  doctorId: string;
  patientId?: string;
  episodeId?: string;
  notes?: string;
}

export interface ICaseRepository {
  findAll(filters?: CaseFilters): Promise<PaginatedCases>;
  findByDoctorId(doctorId: string, filters?: CaseFilters): Promise<PaginatedCases>;
  findById(id: string): Promise<LegalCaseEntity | null>;
  create(data: CreateCaseInput): Promise<LegalCaseEntity>;
  updateStatus(id: string, status: CaseStatus): Promise<LegalCaseEntity>;
  assignLawyer(caseId: string, lawyerId: string): Promise<LegalCaseEntity>;
}
