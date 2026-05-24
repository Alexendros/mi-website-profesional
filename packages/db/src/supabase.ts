// Supabase client factories — server-only.
// SUPABASE_SERVICE_ROLE_KEY bypasa RLS: uso estrictamente server-only.
// Para auth SSR usar @supabase/ssr (Phase 6).

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serviceClient: SupabaseClient | null = null;

/**
 * Service-role client (bypasa RLS).
 * Uso: Storage signed URLs, admin queries, seed scripts.
 * NUNCA exponer al cliente.
 *
 * El caller DEBE pasar valores validados por Zod (via serverEnv / storageEnv).
 * No leer process.env directamente (CLAUDE.md §3, §7).
 */
export function getServiceRoleClient(url: string, key: string): SupabaseClient {
  if (serviceClient) return serviceClient;

  serviceClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceClient;
}

export type { SupabaseClient } from "@supabase/supabase-js";
