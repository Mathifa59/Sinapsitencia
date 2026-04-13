import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/matching/doctors
 *
 * Lista todos los perfiles de médicos con datos del usuario.
 */
export async function GET() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("doctor_profiles")
    .select(
      `
      *,
      user:profiles!doctor_profiles_user_id_fkey(id, name, email, is_active, avatar_url)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return apiError(`Error al obtener perfiles de médicos: ${error.message}`, 500);
  }

  const doctors = (data ?? []).map((d) => {
    const user = d.user as {
      id: string;
      name: string;
      email: string;
      is_active: boolean;
      avatar_url: string | null;
    };

    return {
      id: d.id,
      userId: d.user_id,
      fullName: user.name,
      email: user.email,
      cmp: d.cmp,
      specialty: d.specialty,
      subSpecialties: d.sub_specialties,
      hospital: d.hospital,
      yearsExperience: d.years_experience,
      phone: d.phone,
      bio: d.bio,
      languages: d.languages,
      available: user.is_active,
      avatar: user.avatar_url,
    };
  });

  return apiSuccess(doctors);
}
