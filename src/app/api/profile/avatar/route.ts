import { apiSuccess, apiError } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/profile/avatar
 *
 * Sube una imagen de perfil a Supabase Storage y actualiza avatar_url en profiles.
 * Body: FormData con campo "file" (imagen) y "userId" (string).
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServer();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const userId = formData.get("userId") as string | null;

  if (!file || !userId) {
    return apiError("file y userId son requeridos", 400);
  }

  // Validar tipo de archivo
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return apiError("Solo se permiten imágenes JPEG, PNG o WebP", 400);
  }

  // Validar tamaño (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return apiError("La imagen no debe superar 2MB", 400);
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filePath = `avatars/${userId}.${ext}`;

  // Subir a Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return apiError(`Error al subir imagen: ${uploadError.message}`, 500);
  }

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  const avatarUrl = urlData.publicUrl;

  // Actualizar avatar_url en profiles
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (updateError) {
    return apiError(`Error actualizando perfil: ${updateError.message}`, 500);
  }

  return apiSuccess({ avatarUrl });
}
