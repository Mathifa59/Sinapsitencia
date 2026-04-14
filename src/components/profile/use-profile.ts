"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { ProfileResponse } from "./types";

export function useProfile<T = Record<string, unknown>>(userId: string) {
  return useQuery({
    queryKey: queryKeys.profile.detail(userId),
    queryFn: () => apiFetch<ProfileResponse<T>>(`/api/profile?userId=${userId}`),
    enabled: Boolean(userId),
  });
}
