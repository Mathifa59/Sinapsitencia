import { NextResponse } from "next/server";

/** Respuesta estándar exitosa */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/** Respuesta estándar de error */
export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** Simula latencia de red (300–600ms) */
export async function simulateLatency(min = 300, max = 600) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((r) => setTimeout(r, ms));
}

// ─── Client-side fetch helper ─────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

/**
 * Fetch wrapper para consumir los API routes.
 * Lanza error si `success === false`.
 */
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error(json.error ?? "Error desconocido");
  }
  return json.data;
}
