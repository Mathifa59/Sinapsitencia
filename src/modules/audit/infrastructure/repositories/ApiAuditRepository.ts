import { apiFetch } from "@/lib/api";
import type { IAuditRepository, AuditFilters, PaginatedAuditLogs } from "../../domain/repositories/IAuditRepository";
import type { AuditLogEntity } from "../../domain/entities/audit-log.entity";

interface AuditLogRaw {
  id: string;
  userId: string;
  user: { name: string; role: string };
  action: AuditLogEntity["action"];
  resource: string;
  resourceId: string;
  description: string;
  ipAddress: string;
  createdAt: string;
}

function toEntity(raw: AuditLogRaw): AuditLogEntity {
  return {
    id: raw.id,
    userId: raw.userId,
    userName: raw.user.name,
    userRole: raw.user.role,
    action: raw.action,
    resource: raw.resource,
    resourceId: raw.resourceId,
    description: raw.description,
    ipAddress: raw.ipAddress,
    createdAt: new Date(raw.createdAt),
  };
}

export class ApiAuditRepository implements IAuditRepository {
  async findAll(filters?: AuditFilters): Promise<PaginatedAuditLogs> {
    const p = new URLSearchParams();
    if (filters?.action) p.set("action", filters.action);
    if (filters?.userId) p.set("userId", filters.userId);
    if (filters?.resource) p.set("resource", filters.resource);
    if (filters?.search) p.set("search", filters.search);
    const qs = p.toString();
    const url = `/api/audit${qs ? `?${qs}` : ""}`;

    const raw = await apiFetch<{ data: AuditLogRaw[]; total: number }>(url);
    return { data: raw.data.map(toEntity), total: raw.total };
  }
}
