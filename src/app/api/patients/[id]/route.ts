import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

// Helper: transforma fila de DB a formato API (camelCase)
function toApiPatient(p: {
  id: string;
  dni: string;
  name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  blood_type: string | null;
  created_at: string;
}) {
  return {
    id: p.id,
    dni: p.dni,
    name: p.name,
    lastName: p.last_name,
    birthDate: p.birth_date,
    gender: p.gender,
    phone: p.phone,
    email: p.email,
    address: p.address,
    bloodType: p.blood_type,
    createdAt: p.created_at,
  };
}

/**
 * GET /api/patients/:id
 *
 * Obtiene un paciente por su ID.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { id } = await params;

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return apiError("Paciente no encontrado", 404);
  }

  return apiSuccess(toApiPatient(data));
}

/**
 * PUT /api/patients/:id
 *
 * Actualiza un paciente existente.
 * Body: { name?, lastName?, phone?, email?, address?, bloodType? }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { id } = await params;
  const body = await request.json();

  // Construir objeto de actualización (solo campos proporcionados)
  const updateData: Database["public"]["Tables"]["patients"]["Update"] = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.lastName !== undefined) updateData.last_name = body.lastName;
  if (body.phone !== undefined) updateData.phone = body.phone;
  if (body.email !== undefined) updateData.email = body.email;
  if (body.address !== undefined) updateData.address = body.address;
  if (body.bloodType !== undefined) updateData.blood_type = body.bloodType;

  const hasChanges = Object.values(updateData).some((v) => v !== undefined);
  if (!hasChanges) {
    return apiError("No se proporcionaron campos para actualizar", 400);
  }

  const { data, error } = await supabase
    .from("patients")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return apiError("Paciente no encontrado o error al actualizar", 404);
  }

  return apiSuccess(toApiPatient(data));
}
