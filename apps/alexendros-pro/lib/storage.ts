// Supabase Storage — signed URLs para descargas de productos digitales.
// Si Supabase no está configurado, retorna null (graceful degradation).

import { getServiceRoleClient } from "@repo/db/supabase";

const SIGNED_URL_TTL_SECONDS = 5 * 60; // 5 minutos
const BUCKET = "digital-products";

type SignedUrlResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Genera una URL firmada de corta duración para un objeto en el bucket privado.
 * @param storagePath — ruta dentro del bucket (ej. "templates/portfolio-v1.zip")
 */
export async function createSignedDownloadUrl(
  storagePath: string,
): Promise<SignedUrlResult> {
  let client;
  try {
    client = getServiceRoleClient();
  } catch {
    return { ok: false, error: "Supabase no configurado" };
  }

  const { data, error } = await client.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS, {
      download: true,
    });

  if (error || !data?.signedUrl) {
    return { ok: false, error: error?.message ?? "Error generando URL firmada" };
  }

  return { ok: true, url: data.signedUrl };
}
