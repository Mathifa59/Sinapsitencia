import type { DocumentEntity, DocumentStatus, DocumentType } from "../entities/document.entity";

export interface DocumentFilters {
  status?: DocumentStatus;
  type?: DocumentType;
  patientId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedDocuments {
  data: DocumentEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateDocumentInput {
  title: string;
  type: DocumentType;
  authorId: string;
  authorName: string;
  patientId?: string;
  patientName?: string;
  initialContent?: string;
}

export interface IDocumentRepository {
  findAll(filters?: DocumentFilters): Promise<PaginatedDocuments>;
  findById(id: string): Promise<DocumentEntity | null>;
  findByAuthor(authorId: string, filters?: DocumentFilters): Promise<PaginatedDocuments>;
  create(input: CreateDocumentInput): Promise<DocumentEntity>;
  updateStatus(id: string, status: DocumentStatus): Promise<DocumentEntity>;
}
