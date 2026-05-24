// Supabase client factories — server-only.
// SUPABASE_SERVICE_ROLE_KEY bypasa RLS: uso estrictamente server-only.
// Para auth SSR usar @supabase/ssr (Phase 6).

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serviceClient: SupabaseClient | null = null;

/**
 * Service-role client (bypasa RLS).
 * Uso: Storage signed URLs, admin queries, seed scripts.
 * NUNCA exponer al cliente.
 */
export function getServiceRoleClient(
  url?: string,
  key?: string,
): SupabaseClient {
  if (serviceClient) return serviceClient;

  const resolvedUrl = url ?? process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const resolvedKey = key ?? process.env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!resolvedUrl || !resolvedKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridos",
    );
  }

  serviceClient = createClient(resolvedUrl, resolvedKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceClient;
}

export type { SupabaseClient } from "@supabase/supabase-js";
