import type { IPatientRepository, UpdatePatientInput } from "../repositories/IPatientRepository";
import type { PatientEntity } from "../entities/patient.entity";

export async function updatePatientUseCase(
  patientRepository: IPatientRepository,
  id: string,
  input: UpdatePatientInput
): Promise<PatientEntity> {
  return patientRepository.update(id, input);
}
