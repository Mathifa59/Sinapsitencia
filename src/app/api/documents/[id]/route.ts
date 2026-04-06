import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockDocuments } from "@/mocks/documents";
import type { Document } from "@/types";

const documents: Document[] = [...mockDocuments];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await simulateLatency(150, 300);

  const { id } = await params;
  const doc = documents.find((d) => d.id === id);
  if (!doc) return apiError("Documento no encontrado", 404);
  return apiSuccess(doc);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await simulateLatency(200, 400);

  const { id } = await params;
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) return apiError("Documento no encontrado", 404);

  const body = await request.json();

  // Actualizar status si se proporciona
  if (body.status) {
    documents[idx] = {
      ...documents[idx],
      status: body.status,
      updatedAt: new Date().toISOString(),
    };
  }

  return apiSuccess(documents[idx]);
}
