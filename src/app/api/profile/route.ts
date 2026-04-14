import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/profile?userId=xxx
 *
 * Devuelve el perfil completo del usuario (profiles + doctor_profiles/lawyer_profiles).
 */
export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return apiError("userId es requerido", 400);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return apiError("Perfil no encontrado", 404);
  }

  let professionalProfile = null;

  if (profile.role === "doctor") {
    const { data } = await supabase
      .from("doctor_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    professionalProfile = data;
  } else if (profile.role === "lawyer") {
    const { data } = await supabase
      .from("lawyer_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    professionalProfile = data;
  }

  return apiSuccess({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    avatar: profile.avatar_url,
    isActive: profile.is_active,
    createdAt: profile.created_at,
    professional: professionalProfile,
  });
}

/**
 * PATCH /api/profile
 *
 * Actualiza perfil base + perfil profesional.
 * Body: { userId, name?, avatar_url?, professional: { ...campos del rol } }
 */
export async function PATCH(request: Request) {
  const supabase = await createSupabaseServer();
  const body = await request.json();
  const { userId, name, professional } = body;

  if (!userId) {
    return apiError("userId es requerido", 400);
  }

  // 1. Obtener perfil para saber el rol
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return apiError("Perfil no encontrado", 404);
  }

  // 2. Actualizar tabla profiles (nombre)
  if (name) {
    const { error } = await supabase
      .from("profiles")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      return apiError(`Error actualizando perfil: ${error.message}`, 500);
    }
  }

  // 3. Actualizar perfil profesional según rol
  if (professional && profile.role === "doctor") {
    const { error } = await supabase
      .from("doctor_profiles")
      .update({
        cmp: professional.cmp ?? undefined,
        specialty: professional.specialty ?? undefined,
        hospital: professional.hospital ?? undefined,
        phone: professional.phone ?? undefined,
        bio: professional.bio ?? undefined,
        years_experience: professional.years_experience ?? undefined,
      })
      .eq("user_id", userId);

    if (error) {
      return apiError(`Error actualizando perfil médico: ${error.message}`, 500);
    }
  }

  if (professional && profile.role === "lawyer") {
    const { error } = await supabase
      .from("lawyer_profiles")
      .update({
        cab: professional.cab ?? undefined,
        specialties: professional.specialties ?? undefined,
        medical_areas: professional.medical_areas ?? undefined,
        phone: professional.phone ?? undefined,
        bio: professional.bio ?? undefined,
        years_experience: professional.years_experience ?? undefined,
      })
      .eq("user_id", userId);

    if (error) {
      return apiError(`Error actualizando perfil legal: ${error.message}`, 500);
    }
  }

  return apiSuccess({ message: "Perfil actualizado correctamente" });
}
