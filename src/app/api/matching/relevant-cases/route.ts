import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/matching/relevant-cases?lawyerId=xxx
 *
 * Devuelve casos SIN abogado asignado donde la especialidad del doctor
 * coincide con las medical_areas del abogado.
 *
 * Esto permite que un abogado vea casos relevantes según su perfil.
 */
export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);
  const lawyerId = searchParams.get("lawyerId");

  if (!lawyerId) {
    return apiError("lawyerId es requerido", 400);
  }

  // 1. Obtener el perfil del abogado con sus medical_areas
  const { data: lawyerProfile, error: profileError } = await supabase
    .from("lawyer_profiles")
    .select("medical_areas")
    .eq("user_id", lawyerId)
    .single();

  if (profileError || !lawyerProfile) {
    return apiError("Perfil de abogado no encontrado", 404);
  }

  const medicalAreas: string[] = lawyerProfile.medical_areas ?? [];

  if (medicalAreas.length === 0) {
    return apiSuccess({ data: [], medicalAreas: [] });
  }

  // 2. Obtener IDs de doctores cuya especialidad está en las medical_areas del abogado
  const { data: matchingDoctors } = await supabase
    .from("doctor_profiles")
    .select("user_id, specialty")
    .in("specialty", medicalAreas);

  const doctorUserIds = (matchingDoctors ?? []).map((d) => d.user_id);

  if (doctorUserIds.length === 0) {
    return apiSuccess({ data: [], medicalAreas });
  }

  // 3. Obtener casos sin abogado asignado de esos doctores
  const { data: cases, error: casesError } = await supabase
    .from("cases")
    .select(
      `
      *,
      doctor:profiles!cases_doctor_id_fkey(id, name, email),
      patient:patients!cases_patient_id_fkey(id, name, last_name)
    `
    )
    .in("doctor_id", doctorUserIds)
    .is("lawyer_id", null)
    .in("status", ["nuevo", "en_revision", "activo"])
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20);

  if (casesError) {
    return apiError(`Error al obtener casos: ${casesError.message}`, 500);
  }

  // 4. Enriquecer con la especialidad del doctor
  const doctorSpecialtyMap = Object.fromEntries(
    (matchingDoctors ?? []).map((d) => [d.user_id, d.specialty])
  );

  const enrichedCases = (cases ?? []).map((c) => {
    const doctor = c.doctor as { id: string; name: string; email: string } | null;
    const patient = c.patient as { id: string; name: string; last_name: string } | null;

    return {
      id: c.id,
      title: c.title,
      description: c.description,
      status: c.status,
      priority: c.priority,
      doctorId: c.doctor_id,
      doctor: doctor
        ? {
            id: doctor.id,
            fullName: doctor.name,
            specialty: doctorSpecialtyMap[c.doctor_id] ?? "No especificada",
          }
        : undefined,
      patient: patient
        ? {
            id: patient.id,
            fullName: `${patient.name} ${patient.last_name}`,
          }
        : undefined,
      notes: c.notes,
      createdAt: c.created_at,
    };
  });

  return apiSuccess({ data: enrichedCases, medicalAreas });
}
