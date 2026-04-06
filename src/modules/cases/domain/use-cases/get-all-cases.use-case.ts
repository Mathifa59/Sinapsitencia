import type { ICaseRepository, CaseFilters, PaginatedCases } from "../repositories/ICaseRepository";

/**
 * Obtiene todos los casos legales del sistema (vista de administrador).
 * A diferencia de getCasesByDoctorUseCase, no filtra por médico.
 */
export async function getAllCasesUseCase(
  caseRepository: ICaseRepository,
  filters?: CaseFilters
): Promise<PaginatedCases> {
  return caseRepository.findAll(filters);
}
