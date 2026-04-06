import type { IDocumentRepository, CreateDocumentInput } from "../repositories/IDocumentRepository";
import type { DocumentEntity } from "../entities/document.entity";

export async function createDocumentUseCase(
  documentRepository: IDocumentRepository,
  input: CreateDocumentInput
): Promise<DocumentEntity> {
  return documentRepository.create(input);
}
