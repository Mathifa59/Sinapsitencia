import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

/**
 * GET /api/legal-cases
 *
 * Lista casos legales con filtros y paginación.
 * Incluye relaciones: doctor (profiles), lawyer (profiles), patient.
 * Query params: status, priority, doctorId, search, page, pageSize
 */
export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const doctorId = searchParams.get("doctorId");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

  // Query con relaciones embebidas (evita N+1)
  let query = supabase
    .from("cases")
    .select(
      `
      *,
      doctor:profiles!cases_doctor_id_fkey(id, name, email),
      lawyer:profiles!cases_lawyer_id_fkey(id, name, email),
      patient:patients!cases_patient_id_fkey(id, name, last_name, dni, phone, gender, blood_type)
    `,
      { count: "exact" }
    );

  if (status) query = query.eq("status", status as Database["public"]["Enums"]["case_status"]);
  if (priority) query = query.eq("priority", priority as Database["public"]["Enums"]["case_priority"]);
  if (doctorId) query = query.eq("doctor_id", doctorId);
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to).order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    return apiError(`Error al obtener casos: ${error.message}`, 500);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  // Transformar a formato API con relaciones aplanadas
  const cases = (data ?? []).map((c) => {
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
  });

  return apiSuccess({ data: cases, total, page, pageSize, totalPages });
}

/**
 * POST /api/legal-cases
 *
 * Crea un nuevo caso legal.
 * Body: { title, description, priority, doctorId, patientId?, episodeId?, notes? }
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const body = await request.json();

  const { title, description, priority, doctorId, patientId, episodeId, notes } = body;

  if (!title || !description || !priority || !doctorId) {
    return apiError(
      "Título, descripción, prioridad y doctorId son requeridos",
      400
    );
  }

  const { data, error } = await supabase
    .from("cases")
    .insert({
      title,
      description,
      priority,
      doctor_id: doctorId,
      patient_id: patientId ?? null,
      episode_id: episodeId ?? null,
      notes: notes ?? null,
    })
    .select(
      `
      *,
      doctor:profiles!cases_doctor_id_fkey(id, name, email),
      patient:patients!cases_patient_id_fkey(id, name, last_name, dni)
    `
    )
    .single();

  if (error) {
    return apiError(`Error al crear caso: ${error.message}`, 500);
  }

  const doctor = data.doctor as { id: string; name: string; email: string } | null;
  const patient = data.patient as {
    id: string;
    name: string;
    last_name: string;
    dni: string;
  } | null;

  return apiSuccess(
    {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      doctorId: data.doctor_id,
      doctor: doctor
        ? { id: doctor.id, fullName: doctor.name, email: doctor.email }
        : undefined,
      patientId: data.patient_id,
      patient: patient
        ? {
            id: patient.id,
            fullName: `${patient.name} ${patient.last_name}`,
            dni: patient.dni,
          }
        : undefined,
      episodeId: data.episode_id,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
    201
  );
}
