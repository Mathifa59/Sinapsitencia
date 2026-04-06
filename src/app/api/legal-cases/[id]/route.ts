import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockCases } from "@/mocks/cases";
import { mockLawyerProfiles } from "@/mocks/users";
import type { LegalCase } from "@/types";

const cases: LegalCase[] = [...mockCases];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await simulateLatency(150, 300);

  const { id } = await params;
  const legalCase = cases.find((c) => c.id === id);
  if (!legalCase) return apiError("Caso no encontrado", 404);
  return apiSuccess(legalCase);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await simulateLatency(200, 400);

  const { id } = await params;
  const idx = cases.findIndex((c) => c.id === id);
  if (idx === -1) return apiError("Caso no encontrado", 404);

  const body = await request.json();

  if (body.status) {
    cases[idx] = { ...cases[idx], status: body.status, updatedAt: new Date().toISOString() };
  }

  if (body.lawyerId) {
    const lawyer = mockLawyerProfiles.find((l) => l.id === body.lawyerId);
    if (lawyer) {
      cases[idx] = { ...cases[idx], lawyerId: body.lawyerId, lawyer, updatedAt: new Date().toISOString() };
    }
  }

  return apiSuccess(cases[idx]);
}
