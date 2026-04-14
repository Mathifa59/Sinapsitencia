import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/matching/lawyers
 *
 * Si se pasa ?doctorId=xxx → devuelve recomendaciones ML para ese doctor.
 * Sin filtro → devuelve todos los perfiles de abogados.
 */
export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");

  // ── Con doctorId: obtener recomendaciones ───────────────────────
  if (doctorId) {
    return await getRecommendations(supabase, doctorId);
  }

  // ── Sin filtro: listar todos los abogados ───────────────────────
  const { data, error } = await supabase
    .from("lawyer_profiles")
    .select(
      `
      *,
      user:profiles!lawyer_profiles_user_id_fkey(id, name, email, is_active, avatar_url)
    `
    )
    .order("rating", { ascending: false });

  if (error) {
    return apiError(`Error al obtener perfiles de abogados: ${error.message}`, 500);
  }

  const lawyers = (data ?? []).map(toLawyerResponse);
  return apiSuccess(lawyers);
}

// ─── Obtener recomendaciones del ML service ─────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getRecommendations(supabase: any, doctorId: string) {
  const mlUrl = process.env.ML_SERVICE_URL ?? "http://localhost:8000";

  // Obtener perfil del doctor para el ML
  const { data: doctorProfile } = await supabase
    .from("doctor_profiles")
    .select("*, user:profiles!doctor_profiles_user_id_fkey(name)")
    .eq("user_id", doctorId)
    .single();

  if (!doctorProfile) {
    return apiError("Perfil de médico no encontrado", 404);
  }

  // Obtener todos los abogados para enriquecimiento
  const { data: lawyers } = await supabase
    .from("lawyer_profiles")
    .select(
      `
      *,
      user:profiles!lawyer_profiles_user_id_fkey(id, name, email, is_active, avatar_url)
    `
    );

  try {
    // Llamar al ML service con el formato que ahora acepta (doctor_id + doctor_profile)
    const mlResponse = await fetch(`${mlUrl}/api/v1/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctor_id: doctorId,
        doctor_profile: {
          name: doctorProfile.user?.name ?? "",
          specialty: doctorProfile.specialty,
          sub_specialties: doctorProfile.sub_specialties ?? [],
          hospital: doctorProfile.hospital ?? "",
          years_experience: doctorProfile.years_experience ?? 0,
        },
        top_k: 10,
      }),
      signal: AbortSignal.timeout(5000), // timeout 5s
    });

    if (mlResponse.ok) {
      const mlData = await mlResponse.json();

      // Enriquecer recomendaciones con datos completos de abogados
      const recommendations = mlData.recommendations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((rec: any) => {
          // Buscar el abogado por user_id (UUID real de Supabase)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const lawyer = (lawyers ?? []).find((l: any) => l.user_id === rec.lawyer_id);
          if (!lawyer) return null;

          return {
            id: `rec-${doctorId}-${rec.lawyer_id}`,
            doctorId,
            lawyer: toLawyerResponse(lawyer),
            score: Math.round(rec.score * 100),
            contentScore: Math.round((rec.content_score ?? 0) * 100),
            collaborativeScore: Math.round((rec.collaborative_score ?? 0) * 100),
            matchedSpecialties: rec.matched_specialties ?? [],
            modelUsed: rec.model_used ?? "unknown",
            featureImportance: rec.feature_importance ?? [],
            reasons: rec.reasons ?? [],
            createdAt: new Date().toISOString(),
          };
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((r: any) => r !== null);

      return apiSuccess({
        recommendations,
        modelInfo: mlData.model_info ?? {},
      });
    }
  } catch {
    // ML service no disponible — fallback a matching por especialidad
  }

  // ── Fallback: matching básico por especialidad ──────────────────
  const recommendations = (lawyers ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((l: any) => {
      const medicalAreas: string[] = l.medical_areas ?? [];
      return medicalAreas.some(
        (area: string) =>
          area.toLowerCase().includes(doctorProfile.specialty.toLowerCase()) ||
          doctorProfile.specialty
            .toLowerCase()
            .includes(area.toLowerCase())
      );
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((l: any) => ({
      id: `rec-${doctorId}-${l.user_id}`,
      doctorId,
      lawyer: toLawyerResponse(l),
      score: 70 + Math.floor(Math.random() * 20), // Score estimado sin ML
      contentScore: 0,
      collaborativeScore: 0,
      matchedSpecialties: [],
      modelUsed: "fallback",
      featureImportance: [],
      reasons: ["Coincidencia por área médica (sin ML service)"],
      createdAt: new Date().toISOString(),
    }));

  return apiSuccess({
    recommendations,
    modelInfo: { model: "fallback", message: "ML service no disponible" },
  });
}

// ─── Helper: transformar perfil de abogado ──────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toLawyerResponse(l: any) {
  const user = l.user as {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    avatar_url: string | null;
  };

  return {
    id: l.id,
    userId: l.user_id,
    fullName: user.name,
    email: user.email,
    cab: l.cab,
    specialties: l.specialties,
    medicalAreas: l.medical_areas,
    yearsExperience: l.years_experience,
    resolvedCases: l.resolved_cases,
    rating: Number(l.rating),
    phone: l.phone,
    bio: l.bio,
    available: user.is_active,
    avatar: user.avatar_url,
  };
}
