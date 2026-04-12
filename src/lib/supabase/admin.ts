/**
 * ─── Cliente Supabase con Service Role (Admin) ─────────────────────────────
 *
 * PELIGROSO: Bypasa TODAS las políticas RLS.
 * Solo usar en:
 *   - API Routes que necesitan operaciones de admin
 *   - Crear usuarios (supabase.auth.admin.createUser)
 *   - Insertar match_recommendations desde el ML service
 *   - Operaciones de auditoría del sistema
 *
 * NUNCA importar en código del cliente.
 * NUNCA exponer la SUPABASE_SERVICE_ROLE_KEY al navegador.
 *
 * Para obtener la key: Supabase Dashboard > Settings > API > service_role key
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export function createSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY no está configurada. " +
        "Agrégala en .env.local desde Supabase Dashboard > Settings > API."
    );
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
