"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuditLogsUseCase } from "../../domain/use-cases/get-audit-logs.use-case";
import { queryKeys } from "@/lib/query-keys";
import type { AuditFilters } from "../../domain/repositories/IAuditRepository";

export function useAuditLogs(filters?: AuditFilters) {
  return useQuery({
    queryKey: queryKeys.audit.logs(filters ?? {}),
    queryFn: async () => {
      const { auditRepository } = await import("@/infrastructure/di/container");
      return getAuditLogsUseCase(auditRepository, filters);
    },
  });
}
