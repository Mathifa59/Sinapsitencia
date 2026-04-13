import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/auth/logout
 *
 * Cierra la sesión del usuario en Supabase Auth.
 * Elimina la cookie `sinapsistencia-role` y las cookies de sesión.
 */
export async function POST() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();

  const response = NextResponse.json(
    { success: true, data: { message: "Sesión cerrada correctamente" } },
    { status: 200 }
  );

  // Limpiar cookie de rol
  response.cookies.set("sinapsistencia-role", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
