"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserUseCase } from "../../domain/use-cases/create-user.use-case";
import { toggleUserStatusUseCase } from "../../domain/use-cases/toggle-user-status.use-case";
import { queryKeys } from "@/lib/query-keys";
import type { CreateUserInput } from "../../domain/repositories/IUserRepository";

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const { userRepository } = await import("@/infrastructure/di/container");
      return userRepository.findAll();
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const { userRepository } = await import("@/infrastructure/di/container");
      return createUserUseCase(userRepository, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { userRepository } = await import("@/infrastructure/di/container");
      return toggleUserStatusUseCase(userRepository, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
