/**
 * ─── Contenedor de Dependencias ───────────────────────────────────────────────
 *
 * Este es el ÚNICO lugar donde se decide qué implementación de repositorio usar.
 *
 * HOY → MockXxxRepository (datos en memoria)
 * MAÑANA → ApiXxxRepository (llamadas REST reales)
 *
 * Para migrar un módulo a la API real, solo cambia la importación aquí.
 * Ningún hook, page, ni caso de uso necesita modificarse.
 *
 * Ejemplo de migración futura:
 *   import { ApiCaseRepository } from "@/modules/cases/infrastructure/repositories/ApiCaseRepository";
 *   export const caseRepository = new ApiCaseRepository(apiClient);
 */

import { MockAuthRepository }     from "@/modules/auth/infrastructure/repositories/MockAuthRepository";
import { MockCaseRepository }     from "@/modules/cases/infrastructure/repositories/MockCaseRepository";
import { MockDocumentRepository } from "@/modules/documents/infrastructure/repositories/MockDocumentRepository";
import { MockMatchingRepository } from "@/modules/matching/infrastructure/repositories/MockMatchingRepository";
import { MockAuditRepository }    from "@/modules/audit/infrastructure/repositories/MockAuditRepository";
import { MockUserRepository }     from "@/modules/users/infrastructure/repositories/MockUserRepository";

// Instancias singleton — los mocks mantienen estado en memoria durante la sesión
export const authRepository     = new MockAuthRepository();
export const caseRepository     = new MockCaseRepository();
export const documentRepository = new MockDocumentRepository();
export const matchingRepository = new MockMatchingRepository();
export const auditRepository    = new MockAuditRepository();
export const userRepository     = new MockUserRepository();
