/**
 * ─── Contenedor de Dependencias ───────────────────────────────────────────────
 *
 * Este es el ÚNICO lugar donde se decide qué implementación de repositorio usar.
 *
 * AHORA → ApiXxxRepository (llamadas a /api/* routes con mock data detrás)
 * FUTURO → Mismo ApiXxxRepository apuntando a Spring Boot real
 *
 * Para migrar a un backend real, solo se cambian las URLs base en apiFetch.
 * Ningún hook, page, ni caso de uso necesita modificarse.
 */

import { ApiAuthRepository }     from "@/modules/auth/infrastructure/repositories/ApiAuthRepository";
import { ApiCaseRepository }     from "@/modules/cases/infrastructure/repositories/ApiCaseRepository";
import { ApiDocumentRepository } from "@/modules/documents/infrastructure/repositories/ApiDocumentRepository";
import { ApiMatchingRepository } from "@/modules/matching/infrastructure/repositories/ApiMatchingRepository";
import { ApiAuditRepository }    from "@/modules/audit/infrastructure/repositories/ApiAuditRepository";
import { ApiUserRepository }     from "@/modules/users/infrastructure/repositories/ApiUserRepository";
import { ApiPatientRepository }  from "@/modules/patients/infrastructure/repositories/ApiPatientRepository";

// Instancias singleton — todos consumen /api/* routes
export const authRepository     = new ApiAuthRepository();
export const caseRepository     = new ApiCaseRepository();
export const documentRepository = new ApiDocumentRepository();
export const matchingRepository = new ApiMatchingRepository();
export const auditRepository    = new ApiAuditRepository();
export const userRepository     = new ApiUserRepository();
export const patientRepository  = new ApiPatientRepository();
