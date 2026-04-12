import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

/**
 * GET /api/documents
 *
 * Lista documentos con filtros, paginación y relaciones.
 * Query params: status, type, patientId, authorId, search, page, pageSize
 */
export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const patientId = searchParams.get("patientId");
  const authorId = searchParams.get("authorId");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

  let query = supabase
    .from("documents")
    .select(
      `
      *,
      author:profiles!documents_author_id_fkey(id, name, email),
      patient:patients!documents_patient_id_fkey(id, name, last_name),
      versions:document_versions(id, version, content, file_url, created_by, notes, created_at),
      signatures:document_signatures(id, signer_id, type, signed_at, is_valid, hash)
    `,
      { count: "exact" }
    );

  if (status) query = query.eq("status", status as Database["public"]["Enums"]["document_status"]);
  if (type) query = query.eq("type", type as Database["public"]["Enums"]["document_type"]);
  if (patientId) query = query.eq("patient_id", patientId);
  if (authorId) query = query.eq("author_id", authorId);
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to).order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    return apiError(`Error al obtener documentos: ${error.message}`, 500);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const documents = (data ?? []).map(toDocResponse);

  return apiSuccess({ data: documents, total, page, pageSize, totalPages });
}

/**
 * POST /api/documents
 *
 * Crea un nuevo documento con su versión inicial.
 * Body: { title, type, authorId, authorName?, patientId?, initialContent? }
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const body = await request.json();

  const { title, type, authorId, patientId, initialContent } = body;

  if (!title || !type || !authorId) {
    return apiError("Título, tipo y autor son requeridos", 400);
  }

  // 1. Crear el documento
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({
      title,
      type,
      author_id: authorId,
      patient_id: patientId ?? null,
    })
    .select()
    .single();

  if (docError) {
    return apiError(`Error al crear documento: ${docError.message}`, 500);
  }

  // 2. Crear la versión inicial
  const { data: version, error: versionError } = await supabase
    .from("document_versions")
    .insert({
      document_id: doc.id,
      version: 1,
      content: initialContent ?? "",
      created_by: authorId,
    })
    .select()
    .single();

  if (versionError) {
    return apiError(
      `Error al crear versión inicial: ${versionError.message}`,
      500
    );
  }

  // 3. Actualizar current_version_id en el documento
  await supabase
    .from("documents")
    .update({ current_version_id: version.id })
    .eq("id", doc.id);

  // 4. Obtener el documento completo con relaciones
  const { data: fullDoc } = await supabase
    .from("documents")
    .select(
      `
      *,
      author:profiles!documents_author_id_fkey(id, name, email),
      patient:patients!documents_patient_id_fkey(id, name, last_name),
      versions:document_versions(id, version, content, file_url, created_by, notes, created_at),
      signatures:document_signatures(id, signer_id, type, signed_at, is_valid, hash)
    `
    )
    .eq("id", doc.id)
    .single();

  if (!fullDoc) {
    return apiError("Error al obtener documento creado", 500);
  }

  return apiSuccess(toDocResponse(fullDoc), 201);
}

// ─── Helper: transforma fila DB → respuesta API ────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDocResponse(d: any) {
  const author = d.author as { id: string; name: string; email: string } | null;
  const patient = d.patient as {
    id: string;
    name: string;
    last_name: string;
  } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const versions = (d.versions ?? []).map((v: any) => ({
    id: v.id,
    version: v.version,
    content: v.content,
    fileUrl: v.file_url,
    createdById: v.created_by,
    createdAt: v.created_at,
    notes: v.notes,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signatures = (d.signatures ?? []).map((s: any) => ({
    id: s.id,
    signerId: s.signer_id,
    type: s.type,
    signedAt: s.signed_at,
    isValid: s.is_valid,
    hash: s.hash,
  }));

  return {
    id: d.id,
    title: d.title,
    type: d.type,
    status: d.status,
    patientId: d.patient_id,
    patient: patient
      ? {
          id: patient.id,
          name: patient.name,
          lastName: patient.last_name,
          fullName: `${patient.name} ${patient.last_name}`,
        }
      : undefined,
    authorId: d.author_id,
    authorName: author?.name ?? "Desconocido",
    currentVersionId: d.current_version_id,
    versions,
    signatures,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}
