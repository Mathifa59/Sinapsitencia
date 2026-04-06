"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const { userRepository } = await import("@/infrastructure/di/container");
      return userRepository.findAll();
    },
  });
}
