import type { ICaseRepository, CreateCaseInput } from "../repositories/ICaseRepository";
import type { LegalCaseEntity } from "../entities/legal-case.entity";

export async function createCaseUseCase(
  caseRepository: ICaseRepository,
  input: CreateCaseInput
): Promise<LegalCaseEntity> {
  return caseRepository.create(input);
}
