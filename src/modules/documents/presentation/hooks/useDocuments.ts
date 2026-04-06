"use client";

import { useQuery } from "@tanstack/react-query";
import { getDocumentsUseCase } from "../../domain/use-cases/get-documents.use-case";
import { queryKeys } from "@/lib/query-keys";
import type { DocumentFilters } from "../../domain/repositories/IDocumentRepository";

export function useDocuments(filters?: DocumentFilters) {
  return useQuery({
    queryKey: queryKeys.documents.list(filters ?? {}),
    queryFn: async () => {
      const { documentRepository } = await import("@/infrastructure/di/container");
      return getDocumentsUseCase(documentRepository, filters);
    },
  });
}
