import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

const CONTACT_REQUEST_SELECT = `
  *,
  from_doctor:profiles!contact_requests_from_doctor_id_fkey(
    id, name, email,
    doctor_profile:doctor_profiles(id, cmp, specialty, hospital, phone)
  ),
  to_lawyer:profiles!contact_requests_to_lawyer_id_fkey(
    id, name, email,
    lawyer_profile:lawyer_profiles(id, cab, specialties, phone, rating)
  )
`;

/**
 * GET /api/matching/contact-requests
 *
 * Lista solicitudes de contacto con filtros.
 * Query params: lawyerId, doctorId, status
 */
export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);

  const lawyerId = searchParams.get("lawyerId");
  const doctorId = searchParams.get("doctorId");
  const status = searchParams.get("status");

  let query = supabase
    .from("contact_requests")
    .select(CONTACT_REQUEST_SELECT)
    .order("created_at", { ascending: false });

  if (lawyerId) query = query.eq("to_lawyer_id", lawyerId);
  if (doctorId) query = query.eq("from_doctor_id", doctorId);
  if (status) query = query.eq("status", status as Database["public"]["Enums"]["contact_request_status"]);

  const { data, error } = await query;

  if (error) {
    return apiError(`Error al obtener solicitudes: ${error.message}`, 500);
  }

  const requests = (data ?? []).map(toContactRequestResponse);
  return apiSuccess(requests);
}

/**
 * POST /api/matching/contact-requests
 *
 * Crea una nueva solicitud de contacto de doctor a abogado.
 * Body: { fromDoctorId, toLawyerId, message, caseId? }
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const body = await request.json();

  const { fromDoctorId, toLawyerId, message, caseId } = body;

  if (!fromDoctorId || !toLawyerId || !message) {
    return apiError("Doctor, abogado y mensaje son requeridos", 400);
  }

  // Obtener título del caso si se proporcionó
  let caseTitle: string | null = null;
  if (caseId) {
    const { data: legalCase } = await supabase
      .from("cases")
      .select("title")
      .eq("id", caseId)
      .single();
    caseTitle = legalCase?.title ?? null;
  }

  const { data, error } = await supabase
    .from("contact_requests")
    .insert({
      from_doctor_id: fromDoctorId,
      to_lawyer_id: toLawyerId,
      message,
      case_title: caseTitle,
    })
    .select(CONTACT_REQUEST_SELECT)
    .single();

  if (error) {
    return apiError(`Error al crear solicitud: ${error.message}`, 500);
  }

  return apiSuccess(toContactRequestResponse(data), 201);
}

/**
 * PATCH /api/matching/contact-requests
 *
 * Responde a una solicitud de contacto (aceptar/rechazar).
 * Body: { requestId, status, responseMessage? }
 */
export async function PATCH(request: Request) {
  const supabase = await createSupabaseServer();
  const body = await request.json();

  const { requestId, status, responseMessage } = body;

  if (!requestId || !status) {
    return apiError("requestId y status son requeridos", 400);
  }

  if (!["aceptado", "rechazado"].includes(status)) {
    return apiError("Status debe ser 'aceptado' o 'rechazado'", 400);
  }

  const { data, error } = await supabase
    .from("contact_requests")
    .update({
      status,
      response_message: responseMessage ?? null,
    })
    .eq("id", requestId)
    .select(CONTACT_REQUEST_SELECT)
    .single();

  if (error || !data) {
    return apiError("Solicitud no encontrada o error al actualizar", 404);
  }

  return apiSuccess(toContactRequestResponse(data));
}

// ─── Helper: transformar solicitud de contacto ──────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toContactRequestResponse(r: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fromDoctor = r.from_doctor as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toLawyer = r.to_lawyer as any;

  const doctorProfile = fromDoctor?.doctor_profile;
  const lawyerProfile = toLawyer?.lawyer_profile;

  return {
    id: r.id,
    fromDoctorId: r.from_doctor_id,
    fromDoctor: fromDoctor
      ? {
          id: doctorProfile?.id ?? fromDoctor.id,
          userId: fromDoctor.id,
          fullName: fromDoctor.name,
          email: fromDoctor.email,
          cmp: doctorProfile?.cmp ?? "",
          specialty: doctorProfile?.specialty ?? "",
          hospital: doctorProfile?.hospital ?? "",
          phone: doctorProfile?.phone ?? "",
        }
      : undefined,
    toLawyerId: r.to_lawyer_id,
    toLawyer: toLawyer
      ? {
          id: lawyerProfile?.id ?? toLawyer.id,
          userId: toLawyer.id,
          fullName: toLawyer.name,
          email: toLawyer.email,
          cab: lawyerProfile?.cab ?? "",
          specialties: lawyerProfile?.specialties ?? [],
          phone: lawyerProfile?.phone ?? "",
          rating: Number(lawyerProfile?.rating ?? 0),
        }
      : undefined,
    caseTitle: r.case_title,
    status: r.status,
    message: r.message,
    responseMessage: r.response_message,
    mlScore: r.ml_score ? Number(r.ml_score) : undefined,
    createdAt: r.created_at,
    respondedAt: r.updated_at !== r.created_at ? r.updated_at : undefined,
  };
}
