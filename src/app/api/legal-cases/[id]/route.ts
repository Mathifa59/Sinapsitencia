import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

const CASE_SELECT = `
  *,
  doctor:profiles!cases_doctor_id_fkey(id, name, email),
  lawyer:profiles!cases_lawyer_id_fkey(id, name, email),
  patient:patients!cases_patient_id_fkey(id, name, last_name, dni, phone, gender, blood_type)
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCaseResponse(c: any) {
  const doctor = c.doctor as { id: string; name: string; email: string } | null;
  const lawyer = c.lawyer as { id: string; name: string; email: string } | null;
  const patient = c.patient as {
    id: string;
    name: string;
    last_name: string;
    dni: string;
    phone: string | null;
    gender: string;
    blood_type: string | null;
  } | null;

  return {
    id: c.id,
    title: c.title,
    description: c.description,
    status: c.status,
    priority: c.priority,
    doctorId: c.doctor_id,
    doctor: doctor
      ? { id: doctor.id, fullName: doctor.name, email: doctor.email }
      : undefined,
    lawyerId: c.lawyer_id,
    lawyer: lawyer
      ? { id: lawyer.id, fullName: lawyer.name, email: lawyer.email }
      : undefined,
    patientId: c.patient_id,
    patient: patient
      ? {
          id: patient.id,
          fullName: `${patient.name} ${patient.last_name}`,
          dni: patient.dni,
          phone: patient.phone,
          gender: patient.gender,
          bloodType: patient.blood_type,
        }
      : undefined,
    episodeId: c.episode_id,
    notes: c.notes,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

/**
 * GET /api/legal-cases/:id
 *
 * Obtiene un caso legal por ID con sus relaciones.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { id } = await params;

  const { data, error } = await supabase
    .from("cases")
    .select(CASE_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    return apiError("Caso no encontrado", 404);
  }

  return apiSuccess(toCaseResponse(data));
}

/**
 * PUT /api/legal-cases/:id
 *
 * Actualiza un caso legal.
 * Body: { status?, lawyerId? }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { id } = await params;
  const body = await request.json();

  const updateData: Database["public"]["Tables"]["cases"]["Update"] = {};
  if (body.status) updateData.status = body.status;
  if (body.lawyerId) updateData.lawyer_id = body.lawyerId;

  const hasChanges = Object.values(updateData).some((v) => v !== undefined);
  if (!hasChanges) {
    return apiError("No se proporcionaron campos para actualizar", 400);
  }

  const { data, error } = await supabase
    .from("cases")
    .update(updateData)
    .eq("id", id)
    .select(CASE_SELECT)
    .single();

  if (error || !data) {
    return apiError("Caso no encontrado o error al actualizar", 404);
  }

  return apiSuccess(toCaseResponse(data));
}
