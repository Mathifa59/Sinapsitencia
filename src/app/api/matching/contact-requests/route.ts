import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockContactRequests, mockMatchRecommendations } from "@/mocks/matching";
import { mockDoctorProfiles, mockLawyerProfiles } from "@/mocks/users";
import { mockCases } from "@/mocks/cases";
import type { ContactRequest } from "@/types";

const requests: ContactRequest[] = [...mockContactRequests];

export async function GET(request: Request) {
  await simulateLatency(200, 400);

  const { searchParams } = new URL(request.url);
  const lawyerId = searchParams.get("lawyerId");
  const doctorId = searchParams.get("doctorId");
  const status = searchParams.get("status");

  let result = [...requests];

  if (lawyerId) result = result.filter((r) => r.toLawyerId === lawyerId);
  if (doctorId) result = result.filter((r) => r.fromDoctorId === doctorId);
  if (status) result = result.filter((r) => r.status === status);

  return apiSuccess(result);
}

export async function POST(request: Request) {
  await simulateLatency(300, 500);

  const body = await request.json();
  const { fromDoctorId, toLawyerId, message, caseId } = body;

  if (!fromDoctorId || !toLawyerId || !message)
    return apiError("Doctor, abogado y mensaje son requeridos", 400);

  const doctor = mockDoctorProfiles.find((d) => d.id === fromDoctorId);
  const lawyer = mockLawyerProfiles.find((l) => l.id === toLawyerId);
  if (!doctor || !lawyer) return apiError("Médico o abogado no encontrado", 404);

  const legalCase = caseId ? mockCases.find((c) => c.id === caseId) : undefined;

  const newRequest: ContactRequest = {
    id: `req${Date.now()}`,
    fromDoctorId,
    fromDoctor: doctor,
    toLawyerId,
    toLawyer: lawyer,
    caseId,
    case: legalCase,
    status: "pendiente",
    message,
    createdAt: new Date().toISOString(),
  };

  requests.push(newRequest);
  return apiSuccess(newRequest, 201);
}

export async function PATCH(request: Request) {
  await simulateLatency(200, 400);

  const body = await request.json();
  const { requestId, status, responseMessage } = body;

  if (!requestId || !status) return apiError("requestId y status son requeridos", 400);

  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return apiError("Solicitud no encontrada", 404);

  requests[idx] = {
    ...requests[idx],
    status,
    responseMessage,
    respondedAt: new Date().toISOString(),
  };

  return apiSuccess(requests[idx]);
}
