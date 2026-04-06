import type { ICaseRepository } from "../repositories/ICaseRepository";
import type { LegalCaseEntity } from "../entities/legal-case.entity";

export async function getCaseByIdUseCase(
  repository: ICaseRepository,
  id: string
): Promise<LegalCaseEntity> {
  if (!id) throw new Error("El ID del caso es requerido");
  const result = await repository.findById(id);
  if (!result) throw new Error(`Caso con ID "${id}" no encontrado`);
  return result;
}
