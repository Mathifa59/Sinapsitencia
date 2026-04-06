"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocumentsUseCase } from "../../domain/use-cases/get-documents.use-case";
import { createDocumentUseCase } from "../../domain/use-cases/create-document.use-case";
import { queryKeys } from "@/lib/query-keys";
import type { DocumentFilters, CreateDocumentInput } from "../../domain/repositories/IDocumentRepository";
import type { DocumentStatus } from "../../domain/entities/document.entity";

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

export function useUpdateDocumentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DocumentStatus }) => {
      const { documentRepository } = await import("@/infrastructure/di/container");
      return documentRepository.updateStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}
