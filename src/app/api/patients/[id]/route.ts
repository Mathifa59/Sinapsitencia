import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockPatients } from "@/mocks/cases";
import type { Patient } from "@/types";

const patients: Patient[] = [...mockPatients];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await simulateLatency(150, 300);

  const { id } = await params;
  const patient = patients.find((p) => p.id === id);
  if (!patient) return apiError("Paciente no encontrado", 404);
  return apiSuccess(patient);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await simulateLatency(200, 400);

  const { id } = await params;
  const idx = patients.findIndex((p) => p.id === id);
  if (idx === -1) return apiError("Paciente no encontrado", 404);

  const body = await request.json();
  patients[idx] = { ...patients[idx], ...body };
  return apiSuccess(patients[idx]);
}
