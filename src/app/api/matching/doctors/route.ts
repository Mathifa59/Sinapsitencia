import { apiSuccess, simulateLatency } from "@/lib/api";
import { mockDoctorProfiles } from "@/mocks/users";

export async function GET() {
  await simulateLatency(200, 400);
  return apiSuccess(mockDoctorProfiles);
}
