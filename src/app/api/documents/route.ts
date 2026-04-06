import { apiSuccess, apiError, simulateLatency } from "@/lib/api";
import { mockDocuments } from "@/mocks/documents";
import { mockUsers } from "@/mocks/users";
import { mockPatients } from "@/mocks/cases";
import type { Document } from "@/types";

const documents: Document[] = [...mockDocuments];

export async function GET(request: Request) {
  await simulateLatency(200, 400);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const patientId = searchParams.get("patientId");
  const authorId = searchParams.get("authorId");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

  let result = [...documents];

  if (status) result = result.filter((d) => d.status === status);
  if (type) result = result.filter((d) => d.type === type);
  if (patientId) result = result.filter((d) => d.patientId === patientId);
  if (authorId) result = result.filter((d) => d.authorId === authorId);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.patient && `${d.patient.name} ${d.patient.lastName}`.toLowerCase().includes(q))
    );
  }

  const total = result.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = result.slice(start, start + pageSize);

  return apiSuccess({ data, total, page, pageSize, totalPages });
}

export async function POST(request: Request) {
  await simulateLatency(300, 500);

  const body = await request.json();
  const { title, type, authorId, authorName, patientId, patientName, initialContent } = body;

  if (!title || !type || !authorId) return apiError("Título, tipo y autor son requeridos", 400);

  const now = new Date().toISOString();
  const versionId = `v${Date.now()}`;
  const author = mockUsers.find((u) => u.id === authorId);
  const patient = patientId ? mockPatients.find((p) => p.id === patientId) : undefined;

  const newDoc: Document = {
    id: `doc${Date.now()}`,
    title,
    type,
    status: "borrador",
    patientId,
    patient,
    authorId,
    author: author ?? mockUsers[0],
    currentVersionId: versionId,
    versions: [
      {
        id: versionId,
        documentId: `doc${Date.now()}`,
        version: 1,
        content: initialContent ?? "",
        createdById: authorId,
        createdBy: author ?? mockUsers[0],
        createdAt: now,
      },
    ],
    signatures: [],
    createdAt: now,
    updatedAt: now,
  };

  documents.push(newDoc);
  return apiSuccess(newDoc, 201);
}
