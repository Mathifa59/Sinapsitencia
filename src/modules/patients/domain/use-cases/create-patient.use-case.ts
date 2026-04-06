import type { IPatientRepository, CreatePatientInput } from "../repositories/IPatientRepository";
import type { PatientEntity } from "../entities/patient.entity";

export async function createPatientUseCase(
  patientRepository: IPatientRepository,
  input: CreatePatientInput
): Promise<PatientEntity> {
  return patientRepository.create(input);
}
