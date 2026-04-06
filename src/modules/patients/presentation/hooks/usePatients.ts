"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatientsUseCase } from "../../domain/use-cases/get-patients.use-case";
import { createPatientUseCase } from "../../domain/use-cases/create-patient.use-case";
import { updatePatientUseCase } from "../../domain/use-cases/update-patient.use-case";
import { queryKeys } from "@/lib/query-keys";
import type {
  PatientFilters,
  CreatePatientInput,
  UpdatePatientInput,
} from "../../domain/repositories/IPatientRepository";

export function usePatients(filters?: PatientFilters) {
  return useQuery({
    queryKey: queryKeys.patients.list(filters ?? {}),
    queryFn: async () => {
      const { patientRepository } = await import("@/infrastructure/di/container");
      return getPatientsUseCase(patientRepository, filters);
    },
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePatientInput) => {
      const { patientRepository } = await import("@/infrastructure/di/container");
      return createPatientUseCase(patientRepository, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdatePatientInput }) => {
      const { patientRepository } = await import("@/infrastructure/di/container");
      return updatePatientUseCase(patientRepository, id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
    },
  });
}
