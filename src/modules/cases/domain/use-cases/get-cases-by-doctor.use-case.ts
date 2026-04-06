import type { ICaseRepository, CaseFilters, PaginatedCases } from "../repositories/ICaseRepository";

export async function getCasesByDoctorUseCase(
  repository: ICaseRepository,
  doctorId: string,
  filters?: CaseFilters
): Promise<PaginatedCases> {
  if (!doctorId) throw new Error("doctorId es requerido");

  const result = await repository.findByDoctorId(doctorId, filters);

  // Ordenar críticos primero (regla de negocio independiente del origen de datos)
  const priorityOrder: Record<string, number> = {
    critica: 0, alta: 1, media: 2, baja: 3,
  };
  const sorted = [...result.data].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return { ...result, data: sorted };
}
