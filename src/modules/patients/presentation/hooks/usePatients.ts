"use client";

import { useQuery } from "@tanstack/react-query";
import { getPatientsUseCase } from "../../domain/use-cases/get-patients.use-case";
import { queryKeys } from "@/lib/query-keys";
import type { PatientFilters } from "../../domain/repositories/IPatientRepository";

export function usePatients(filters?: PatientFilters) {
  return useQuery({
    queryKey: queryKeys.patients.list(filters ?? {}),
    queryFn: async () => {
      const { patientRepository } = await import("@/infrastructure/di/container");
      return getPatientsUseCase(patientRepository, filters);
    },
  });
}
