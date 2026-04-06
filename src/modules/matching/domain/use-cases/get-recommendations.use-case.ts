import type { IMatchingRepository } from "../repositories/IMatchingRepository";
import type { MatchRecommendationEntity } from "../entities/matching.entity";

export async function getRecommendationsUseCase(
  repository: IMatchingRepository,
  doctorId: string
): Promise<MatchRecommendationEntity[]> {
  if (!doctorId) throw new Error("doctorId es requerido");
  const recs = await repository.getRecommendationsForDoctor(doctorId);
  // Ordenar por score descendente
  return [...recs].sort((a, b) => b.score - a.score);
}
