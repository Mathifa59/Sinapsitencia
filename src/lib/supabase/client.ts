/**
 * ─── Cliente Supabase para el navegador ─────────────────────────────────────
 *
 * Uso: en Client Components ("use client")
 * - Login/signup del usuario
 * - Suscripciones en tiempo real
 * - Acceso a Storage
 *
 * NO usar para operaciones en el servidor (API Routes, Server Components).
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function createSupabaseBrowser() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
