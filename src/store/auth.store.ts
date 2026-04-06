/**
 * Re-exporta el store desde su nueva ubicación en la capa de presentación.
 * Mantiene compatibilidad con todos los imports existentes (@/store/auth.store).
 */
export { useAuthStore } from "@/modules/auth/presentation/stores/auth.store";
