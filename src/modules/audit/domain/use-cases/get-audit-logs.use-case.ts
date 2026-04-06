import type { IAuditRepository, AuditFilters, PaginatedAuditLogs } from "../repositories/IAuditRepository";

/**
 * Obtiene los registros de auditoría aplicando filtros opcionales.
 * Delega toda la lógica de filtrado y paginación al repositorio.
 */
export async function getAuditLogsUseCase(
  auditRepository: IAuditRepository,
  filters?: AuditFilters
): Promise<PaginatedAuditLogs> {
  return auditRepository.findAll(filters);
}
