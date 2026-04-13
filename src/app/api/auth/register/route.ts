import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/auth/register
 *
 * Registro público de nuevos usuarios (médicos o abogados).
 * Body base: { name, email, password, role }
 * Doctor:    + { cmp?, specialty, hospital? }
 * Lawyer:    + { cab?, legalSpecialties, medicalAreas }
 *
 * Flujo:
 * 1. Valida campos
 * 2. Crea usuario en Supabase Auth
 * 3. Trigger crea perfil en profiles
 * 4. Actualiza perfil con rol y nombre
 * 5. Crea doctor_profiles o lawyer_profiles con datos profesionales
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password || !role) {
    return apiError("Todos los campos son requeridos", 400);
  }

  if (!["doctor", "lawyer"].includes(role)) {
    return apiError("Rol no válido", 400);
  }

  if (password.length < 8) {
    return apiError("La contraseña debe tener al menos 8 caracteres", 400);
  }

  // Validar campos profesionales
  if (role === "doctor" && !body.specialty) {
    return apiError("La especialidad médica es requerida", 400);
  }
  if (role === "lawyer") {
    if (!body.legalSpecialties?.length) {
      return apiError("Selecciona al menos una especialidad legal", 400);
    }
    if (!body.medicalAreas?.length) {
      return apiError("Selecciona al menos un área médica de interés", 400);
    }
  }

  // Verificar email no duplicado
  const supabase = await createSupabaseServer();
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return apiError("El correo electrónico ya está registrado", 409);
  }

  try {
    const { createSupabaseAdmin } = await import("@/lib/supabase/admin");
    const adminClient = createSupabaseAdmin();

    // 1. Crear usuario en Supabase Auth
    const { data: authUser, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role },
      });

    if (authError) {
      return apiError(`Error al crear cuenta: ${authError.message}`, 500);
    }

    const userId = authUser.user.id;

    // 2. Actualizar perfil con nombre y rol correcto
    await adminClient
      .from("profiles")
      .update({ name, role })
      .eq("id", userId);

    // 3. Crear perfil profesional según el rol
    if (role === "doctor") {
      const { error: doctorError } = await adminClient
        .from("doctor_profiles")
        .insert({
          user_id: userId,
          cmp: body.cmp || "",
          specialty: body.specialty,
          hospital: body.hospital || "No especificado",
          phone: "",
          years_experience: 0,
        });

      if (doctorError) {
        console.error("Error creando doctor_profile:", doctorError.message);
      }
    } else if (role === "lawyer") {
      const { error: lawyerError } = await adminClient
        .from("lawyer_profiles")
        .insert({
          user_id: userId,
          cab: body.cab || "",
          specialties: body.legalSpecialties ?? [],
          medical_areas: body.medicalAreas ?? [],
          phone: "",
          years_experience: 0,
        });

      if (lawyerError) {
        console.error("Error creando lawyer_profile:", lawyerError.message);
      }
    }

    return apiSuccess(
      { message: "Cuenta creada exitosamente. Ya puedes iniciar sesión." },
      201
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido al registrar";
    return apiError(message, 500);
  }
}
