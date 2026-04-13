import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

const DOC_SELECT = `
  *,
  author:profiles!documents_author_id_fkey(id, name, email),
  patient:patients!documents_patient_id_fkey(id, name, last_name),
  versions:document_versions(id, version, content, file_url, created_by, notes, created_at),
  signatures:document_signatures(id, signer_id, type, signed_at, is_valid, hash)
`;

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

/**
 * GET /api/documents/:id
 *
 * Obtiene un documento con versiones y firmas.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { id } = await params;

  const { data, error } = await supabase
    .from("documents")
    .select(DOC_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    return apiError("Documento no encontrado", 404);
  }

  return apiSuccess(toDocResponse(data));
}

/**
 * PUT /api/documents/:id
 *
 * Actualiza el estado de un documento.
 * Body: { status }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { id } = await params;
  const body = await request.json();

  if (!body.status) {
    return apiError("El campo status es requerido", 400);
  }

  const { data, error } = await supabase
    .from("documents")
    .update({ status: body.status })
    .eq("id", id)
    .select(DOC_SELECT)
    .single();

  if (error || !data) {
    return apiError("Documento no encontrado o error al actualizar", 404);
  }

  return apiSuccess(toDocResponse(data));
}
