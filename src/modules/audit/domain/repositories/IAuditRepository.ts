import type { AuditLogEntity, AuditAction } from "../entities/audit-log.entity";

export interface AuditFilters {
  action?: AuditAction;
  userId?: string;
  resource?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedAuditLogs {
  data: AuditLogEntity[];
  total: number;
}

export interface IAuditRepository {
  findAll(filters?: AuditFilters): Promise<PaginatedAuditLogs>;
}
