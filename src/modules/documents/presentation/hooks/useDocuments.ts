"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocumentsUseCase } from "../../domain/use-cases/get-documents.use-case";
import { createDocumentUseCase } from "../../domain/use-cases/create-document.use-case";
import { queryKeys } from "@/lib/query-keys";
import type { DocumentFilters, CreateDocumentInput } from "../../domain/repositories/IDocumentRepository";

export function useDocuments(filters?: DocumentFilters) {
  return useQuery({
    queryKey: queryKeys.documents.list(filters ?? {}),
    queryFn: async () => {
      const { documentRepository } = await import("@/infrastructure/di/container");
      return getDocumentsUseCase(documentRepository, filters);
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDocumentInput) => {
      const { documentRepository } = await import("@/infrastructure/di/container");
      return createDocumentUseCase(documentRepository, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}
