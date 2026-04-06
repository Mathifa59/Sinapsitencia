import { apiSuccess, simulateLatency } from "@/lib/api";

export async function POST() {
  await simulateLatency(100, 200);
  return apiSuccess({ message: "Sesión cerrada" });
}
