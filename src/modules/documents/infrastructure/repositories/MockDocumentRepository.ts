import type {
  IDocumentRepository,
  DocumentFilters,
  PaginatedDocuments,
  CreateDocumentInput,
} from "../../domain/repositories/IDocumentRepository";
import type { DocumentEntity, DocumentStatus } from "../../domain/entities/document.entity";
import { mockDocuments } from "@/mocks/documents";

function toEntity(raw: (typeof mockDocuments)[0]): DocumentEntity {
  return {
    id: raw.id,
    title: raw.title,
    type: raw.type,
    status: raw.status,
    patientId: raw.patientId,
    patientName: raw.patient
      ? `${raw.patient.name} ${raw.patient.lastName}`
      : undefined,
    authorId: raw.authorId,
    authorName: raw.author.name,
    currentVersionId: raw.currentVersionId,
    versions: raw.versions.map((v) => ({
      id: v.id,
      version: v.version,
      content: v.content,
      fileUrl: v.fileUrl,
      createdById: v.createdById,
      createdByName: v.createdBy.name,
      createdAt: new Date(v.createdAt),
      notes: v.notes,
    })),
    signatures: raw.signatures.map((s) => ({
      id: s.id,
      signerId: s.signerId,
      signerName: s.signer.name,
      type: s.type,
      signedAt: new Date(s.signedAt),
      isValid: s.isValid,
      hash: s.hash,
    })),
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

export class MockDocumentRepository implements IDocumentRepository {
  private documents: DocumentEntity[] = mockDocuments.map(toEntity);

  private applyFilters(data: DocumentEntity[], filters?: DocumentFilters) {
    let result = [...data];
    if (filters?.status) result = result.filter((d) => d.status === filters.status);
    if (filters?.type) result = result.filter((d) => d.type === filters.type);
    if (filters?.patientId) result = result.filter((d) => d.patientId === filters.patientId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.patientName ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }

  private paginate(
    data: DocumentEntity[],
    page = 1,
    pageSize = 20
  ): PaginatedDocuments {
    const total = data.length;
    const paginated = data.slice((page - 1) * pageSize, page * pageSize);
    return { data: paginated, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
  }

  async findAll(filters?: DocumentFilters): Promise<PaginatedDocuments> {
    await new Promise((r) => setTimeout(r, 250));
    const filtered = this.applyFilters(this.documents, filters);
    return this.paginate(filtered, filters?.page, filters?.pageSize);
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    await new Promise((r) => setTimeout(r, 200));
    return this.documents.find((d) => d.id === id) ?? null;
  }

  async findByAuthor(
    authorId: string,
    filters?: DocumentFilters
  ): Promise<PaginatedDocuments> {
    await new Promise((r) => setTimeout(r, 250));
    const byAuthor = this.documents.filter((d) => d.authorId === authorId);
    const filtered = this.applyFilters(byAuthor, filters);
    return this.paginate(filtered, filters?.page, filters?.pageSize);
  }

  async create(input: CreateDocumentInput): Promise<DocumentEntity> {
    await new Promise((r) => setTimeout(r, 400));
    const versionId = `v${Date.now()}`;
    const newDocument: DocumentEntity = {
      id: `doc${Date.now()}`,
      title: input.title,
      type: input.type,
      status: "borrador",
      patientId: input.patientId,
      patientName: input.patientName,
      authorId: input.authorId,
      authorName: input.authorName,
      currentVersionId: versionId,
      versions: [
        {
          id: versionId,
          version: 1,
          content: input.initialContent ?? "",
          createdById: input.authorId,
          createdByName: input.authorName,
          createdAt: new Date(),
        },
      ],
      signatures: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.push(newDocument);
    return newDocument;
  }

  async updateStatus(
    id: string,
    status: DocumentStatus
  ): Promise<DocumentEntity> {
    await new Promise((r) => setTimeout(r, 300));
    const idx = this.documents.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Documento "${id}" no encontrado`);
    this.documents[idx] = { ...this.documents[idx], status, updatedAt: new Date() };
    return this.documents[idx];
  }
}
