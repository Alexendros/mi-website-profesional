/**
 * Factory de clientes Supabase para apps Next.js 16.
 *
 * - `createServerSupabase`: Server Components, Route Handlers, Server Actions.
 *   Recibe el cookie store de Next 16 (async).
 * - `createBrowserSupabase`: Client Components.
 * - `createServiceRoleSupabase`: tareas privilegiadas (webhooks Stripe, jobs).
 *   Lanza si se intenta instanciar en el navegador (CP-03 service_role leak).
 *
 * Importante:
 *   - Nunca usar `getSession()`; usar `supabase.auth.getUser()` (CP-01).
 *   - `getUser()` valida el JWT contra GoTrue en vez de fiarse de la cookie.
 */

import {
  createBrowserClient,
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

export type ServerSupabase = SupabaseClient;
export type BrowserSupabase = SupabaseClient;

interface ServerCookieStore {
  getAll: () => Array<{ name: string; value: string }>;
  set: (name: string, value: string, options: CookieOptions) => void;
}

function readPublicEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY ausentes",
    );
  }
  return { url, anonKey };
}

/** Server Components / Route Handlers / Server Actions. */
export function createServerSupabase(cookieStore: ServerCookieStore): ServerSupabase {
  const { url, anonKey } = readPublicEnv();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          cookieStore.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });
}

/** Client Components únicamente. */
export function createBrowserSupabase(): BrowserSupabase {
  const { url, anonKey } = readPublicEnv();
  return createBrowserClient(url, anonKey);
}

/**
 * Cliente con service role — bypass total de RLS. SÓLO para:
 *   - Stripe webhook handler.
 *   - Jobs de background (CLI, n8n).
 *   - Migraciones programáticas.
 *
 * Lanza si se intenta instanciar en el navegador (CP-03).
 */
export function createServiceRoleSupabase(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error(
      "createServiceRoleSupabase no puede invocarse en el navegador (CP-03)",
    );
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY ausentes",
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
