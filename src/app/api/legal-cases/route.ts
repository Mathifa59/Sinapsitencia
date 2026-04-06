import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockCases, mockPatients } from "@/mocks/cases";
import { mockDoctorProfiles } from "@/mocks/users";
import type { LegalCase } from "@/types";

const cases: LegalCase[] = [...mockCases];

export async function GET(request: Request) {
  await simulateLatency(200, 400);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const doctorId = searchParams.get("doctorId");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

  let result = [...cases];

  if (status) result = result.filter((c) => c.status === status);
  if (priority) result = result.filter((c) => c.priority === priority);
  if (doctorId) result = result.filter((c) => c.doctorId === doctorId);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  const total = result.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = result.slice(start, start + pageSize);

  return apiSuccess({ data, total, page, pageSize, totalPages });
}

export async function POST(request: Request) {
  await simulateLatency(300, 500);

  const body = await request.json();
  const { title, description, priority, doctorId, patientId, notes } = body;

  if (!title || !description || !priority || !doctorId)
    return apiError("Título, descripción, prioridad y doctorId son requeridos", 400);

  const doctor = mockDoctorProfiles.find((d) => d.id === doctorId);
  if (!doctor) return apiError("Médico no encontrado", 404);

  const patient = patientId ? mockPatients.find((p) => p.id === patientId) : undefined;
  const now = new Date().toISOString();

  const newCase: LegalCase = {
    id: `c${Date.now()}`,
    title,
    description,
    status: "nuevo",
    priority,
    doctorId,
    doctor,
    patientId,
    patient,
    documents: [],
    notes,
    createdAt: now,
    updatedAt: now,
  };

  cases.push(newCase);
  return apiSuccess(newCase, 201);
}
