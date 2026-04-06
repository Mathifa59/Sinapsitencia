import type { IPatientRepository, PatientFilters, PaginatedPatients } from "../repositories/IPatientRepository";

export async function getPatientsUseCase(
  patientRepository: IPatientRepository,
  filters?: PatientFilters
): Promise<PaginatedPatients> {
  return patientRepository.findAll(filters);
}
