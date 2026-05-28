// Cliente Supabase para Server Components / Route Handlers / Server Actions.
// Next.js 16 obliga a awaitar `cookies()` (params/cookies/headers async).
//
// Patrón de uso en una page server:
//   import { getServerSupabase } from "@/lib/supabase/server";
//   const supabase = await getServerSupabase();
//   const { data: { user } } = await supabase.auth.getUser(); // CP-01

import { cookies } from "next/headers";
import { createServerSupabase, type ServerSupabase } from "@repo/db";

export async function getServerSupabase(): Promise<ServerSupabase> {
  const cookieStore = await cookies();
  return createServerSupabase({
    getAll() {
      return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
    },
    set(name, value, options) {
      cookieStore.set({ name, value, ...options });
    },
  });
}
