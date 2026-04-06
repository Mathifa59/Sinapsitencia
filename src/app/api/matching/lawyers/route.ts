import { apiSuccess, simulateLatency } from "@/lib/api";
import { mockLawyerProfiles } from "@/mocks/users";
import { mockMatchRecommendations } from "@/mocks/matching";

export async function GET(request: Request) {
  await simulateLatency(200, 400);

  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");

  // Si se pasa doctorId, devolver recomendaciones de matching
  if (doctorId) {
    const recs = mockMatchRecommendations.filter((r) => r.doctorId === doctorId);
    return apiSuccess(recs);
  }

  // Sin filtro, devolver todos los perfiles de abogados
  return apiSuccess(mockLawyerProfiles);
}
