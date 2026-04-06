"use client";

import { useQuery } from "@tanstack/react-query";
import { getCasesByDoctorUseCase } from "../../domain/use-cases/get-cases-by-doctor.use-case";
import { getAllCasesUseCase } from "../../domain/use-cases/get-all-cases.use-case";
import { queryKeys } from "@/lib/query-keys";
import type { CaseFilters } from "../../domain/repositories/ICaseRepository";

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
