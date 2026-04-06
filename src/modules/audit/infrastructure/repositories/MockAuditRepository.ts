import type { IAuditRepository, AuditFilters } from "../../domain/repositories/IAuditRepository";
import type { AuditLogEntity } from "../../domain/entities/audit-log.entity";
import { mockAuditLogs } from "@/mocks/documents";

function toEntity(raw: (typeof mockAuditLogs)[0]): AuditLogEntity {
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

export class MockAuditRepository implements IAuditRepository {
  private logs: AuditLogEntity[] = mockAuditLogs.map(toEntity);

  async findAll(filters?: AuditFilters) {
    await new Promise((r) => setTimeout(r, 200));
    let data = [...this.logs].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    if (filters?.action) data = data.filter((l) => l.action === filters.action);
    if (filters?.userId) data = data.filter((l) => l.userId === filters.userId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (l) =>
          l.description.toLowerCase().includes(q) ||
          l.userName.toLowerCase().includes(q)
      );
    }
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const total = data.length;
    return { data: data.slice((page - 1) * pageSize, page * pageSize), total };
  }
}
