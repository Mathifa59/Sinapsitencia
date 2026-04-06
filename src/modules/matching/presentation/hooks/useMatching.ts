"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecommendationsUseCase } from "../../domain/use-cases/get-recommendations.use-case";
import { sendContactRequestUseCase } from "../../domain/use-cases/send-contact-request.use-case";
import { queryKeys } from "@/lib/query-keys";
import type {
  SendContactRequestInput,
  RespondContactRequestInput,
} from "../../domain/repositories/IMatchingRepository";

export function useMatchRecommendations(doctorId: string) {
  return useQuery({
    queryKey: queryKeys.matching.recommendations(doctorId),
    queryFn: async () => {
      const { matchingRepository } = await import("@/infrastructure/di/container");
      return getRecommendationsUseCase(matchingRepository, doctorId);
    },
    enabled: Boolean(doctorId),
  });
}

export function useLawyerProfiles() {
  return useQuery({
    queryKey: queryKeys.users.lawyerProfiles(),
    queryFn: async () => {
      const { matchingRepository } = await import("@/infrastructure/di/container");
      return matchingRepository.getLawyerProfiles();
    },
  });
}

export function useDoctorProfiles() {
  return useQuery({
    queryKey: queryKeys.users.doctorProfiles(),
    queryFn: async () => {
      const { matchingRepository } = await import("@/infrastructure/di/container");
      return matchingRepository.getDoctorProfiles();
    },
  });
}

export function useContactRequestsForLawyer(lawyerId: string) {
  return useQuery({
    queryKey: queryKeys.matching.contactRequests(lawyerId),
    queryFn: async () => {
      const { matchingRepository } = await import("@/infrastructure/di/container");
      return matchingRepository.getContactRequestsForLawyer(lawyerId);
    },
    enabled: Boolean(lawyerId),
  });
}

export function useSendContactRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SendContactRequestInput) => {
      const { matchingRepository } = await import("@/infrastructure/di/container");
      return sendContactRequestUseCase(matchingRepository, input);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matching.contactRequests(variables.fromDoctorId),
      });
    },
  });
}

export function useRespondContactRequest(lawyerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RespondContactRequestInput) => {
      const { matchingRepository } = await import("@/infrastructure/di/container");
      return matchingRepository.respondContactRequest(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matching.contactRequests(lawyerId),
      });
    },
  });
}
