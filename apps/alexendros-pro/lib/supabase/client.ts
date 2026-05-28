// Cliente Supabase para Client Components.
// Usar SOLO bajo "use client".

"use client";

import { createBrowserSupabase, type BrowserSupabase } from "@repo/db";

let cached: BrowserSupabase | null = null;

export function getBrowserSupabase(): BrowserSupabase {
  cached ??= createBrowserSupabase();
  return cached;
}
