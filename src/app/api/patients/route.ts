import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockPatients } from "@/mocks/cases";
import type { Patient } from "@/types";

const patients: Patient[] = [...mockPatients];

export async function GET(request: Request) {
  await simulateLatency(200, 400);

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const gender = searchParams.get("gender");
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

  let result = [...patients];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        `${p.name} ${p.lastName}`.toLowerCase().includes(q) ||
        p.dni.includes(q)
    );
  }
  if (gender) {
    result = result.filter((p) => p.gender === gender);
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
  const { dni, name, lastName, birthDate, gender } = body;

  if (!dni || !name || !lastName || !birthDate || !gender)
    return apiError("Campos obligatorios faltantes", 400);

  const newPatient: Patient = {
    id: `p${Date.now()}`,
    dni,
    name,
    lastName,
    birthDate,
    gender,
    phone: body.phone,
    email: body.email,
    address: body.address,
    bloodType: body.bloodType,
    createdAt: new Date().toISOString(),
  };
  patients.push(newPatient);
  return apiSuccess(newPatient, 201);
}
