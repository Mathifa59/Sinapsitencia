"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCasesByDoctorUseCase } from "../../domain/use-cases/get-cases-by-doctor.use-case";
import { getAllCasesUseCase } from "../../domain/use-cases/get-all-cases.use-case";
import { createCaseUseCase } from "../../domain/use-cases/create-case.use-case";
import { queryKeys } from "@/lib/query-keys";
import type { CaseFilters, CreateCaseInput } from "../../domain/repositories/ICaseRepository";

export function useCases(doctorId: string, filters?: CaseFilters) {
  return useQuery({
    queryKey: queryKeys.cases.byDoctorFiltered(doctorId, filters ?? {}),
    queryFn: async () => {
      const { caseRepository } = await import("@/infrastructure/di/container");
      return getCasesByDoctorUseCase(caseRepository, doctorId, filters);
    },
    enabled: Boolean(doctorId),
  });
}

export function useCreateCase(doctorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCaseInput) => {
      const { caseRepository } = await import("@/infrastructure/di/container");
      return createCaseUseCase(caseRepository, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cases.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cases.byDoctor(doctorId) });
    },
  });
}

/** Vista admin: obtiene todos los casos del sistema sin filtrar por médico */
export function useAllCases(filters?: CaseFilters) {
  return useQuery({
    queryKey: queryKeys.cases.all,
    queryFn: async () => {
      const { caseRepository } = await import("@/infrastructure/di/container");
      return getAllCasesUseCase(caseRepository, filters);
    },
  });
}
