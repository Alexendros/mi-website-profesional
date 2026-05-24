// Supabase Storage — signed URLs para descargas de productos digitales.
// Si Supabase no está configurado, retorna error (graceful degradation).

import { getServiceRoleClient } from "@repo/db/supabase";
import { storageEnv } from "./env";

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
  let env;
  try {
    env = storageEnv();
  } catch {
    return { ok: false, error: "Supabase no configurado" };
  }

  const client = getServiceRoleClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );

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
