import type { IDocumentRepository, DocumentFilters, PaginatedDocuments } from "../repositories/IDocumentRepository";

export async function getDocumentsUseCase(
  repository: IDocumentRepository,
  filters?: DocumentFilters
): Promise<PaginatedDocuments> {
  return repository.findAll(filters);
}

export async function getDocumentsByAuthorUseCase(
  repository: IDocumentRepository,
  authorId: string,
  filters?: DocumentFilters
): Promise<PaginatedDocuments> {
  if (!authorId) throw new Error("authorId es requerido");
  return repository.findByAuthor(authorId, filters);
}
