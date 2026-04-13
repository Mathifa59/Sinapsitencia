import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

/**
 * GET /api/patients
 *
 * Lista pacientes con filtros y paginación.
 * Query params: search, gender, page, pageSize
 */
export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const gender = searchParams.get("gender");
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

  // Construir query base
  let query = supabase.from("patients").select("*", { count: "exact" });

  // Filtro por género
  if (gender) {
    query = query.eq("gender", gender as Database["public"]["Enums"]["patient_gender"]);
  }

  // Búsqueda por nombre o DNI usando pg_trgm
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,last_name.ilike.%${search}%,dni.ilike.%${search}%`
    );
  }

  // Paginación
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to).order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    return apiError(`Error al obtener pacientes: ${error.message}`, 500);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  // Transformar snake_case → camelCase para la API
  const patients = (data ?? []).map((p) => ({
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
  }));

  return apiSuccess({ data: patients, total, page, pageSize, totalPages });
}

/**
 * POST /api/patients
 *
 * Crea un nuevo paciente.
 * Body: { dni, name, lastName, birthDate, gender, phone?, email?, address?, bloodType? }
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const body = await request.json();

  const { dni, name, lastName, birthDate, gender } = body;

  if (!dni || !name || !lastName || !birthDate || !gender) {
    return apiError("DNI, nombre, apellido, fecha de nacimiento y género son requeridos", 400);
  }

  // Obtener el usuario autenticado para created_by
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("patients")
    .insert({
      dni,
      name,
      last_name: lastName,
      birth_date: birthDate,
      gender,
      phone: body.phone ?? null,
      email: body.email ?? null,
      address: body.address ?? null,
      blood_type: body.bloodType ?? null,
      created_by: user?.id ?? null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return apiError("Ya existe un paciente con ese DNI", 409);
    }
    return apiError(`Error al crear paciente: ${error.message}`, 500);
  }

  return apiSuccess(
    {
      id: data.id,
      dni: data.dni,
      name: data.name,
      lastName: data.last_name,
      birthDate: data.birth_date,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      address: data.address,
      bloodType: data.blood_type,
      createdAt: data.created_at,
    },
    201
  );
}
