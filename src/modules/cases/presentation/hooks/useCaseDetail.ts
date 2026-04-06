"use client";

import { useQuery } from "@tanstack/react-query";
import { getCaseByIdUseCase } from "../../domain/use-cases/get-case-by-id.use-case";
import { queryKeys } from "@/lib/query-keys";

export function useCaseDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.cases.detail(id),
    queryFn: async () => {
      const { caseRepository } = await import("@/infrastructure/di/container");
      return getCaseByIdUseCase(caseRepository, id);
    },
    enabled: Boolean(id),
  });
}
