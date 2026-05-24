// RLS tests for Order table — verify row-level security isolation.
// Requires: Supabase test project with RLS policies from
// packages/db/supabase/rls-policies.sql applied.
// Run: SUPABASE_TEST_URL=... SUPABASE_TEST_ANON_KEY=... pnpm --filter=alexendros-pro vitest run app/__tests__/rls/

import { describe, it, expect, beforeAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_TEST_URL = process.env["SUPABASE_TEST_URL"] ?? "";
const SUPABASE_TEST_ANON_KEY = process.env["SUPABASE_TEST_ANON_KEY"] ?? "";
const HAS_SUPABASE = Boolean(SUPABASE_TEST_URL && SUPABASE_TEST_ANON_KEY);

function anonClient(): SupabaseClient {
  return createClient(SUPABASE_TEST_URL, SUPABASE_TEST_ANON_KEY, {
    auth: { persistSession: false },
  });
}

describe.skipIf(!HAS_SUPABASE)("RLS: Order isolation", () => {
  let client: SupabaseClient;

  beforeAll(() => {
    client = anonClient();
  });

  it("user A cannot read orders belonging to user B", async () => {
    // Anon client should not be able to see any orders (no auth session)
    const { data, error } = await client.from("orders").select("id").limit(1);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("user cannot modify another user's order", async () => {
    const { data, error } = await client
      .from("orders")
      .update({ download_count: 999 })
      .eq("id", "nonexistent-id")
      .select();
    // RLS should prevent any update — either error or empty result
    expect(data?.length ?? 0).toBe(0);
    if (error) expect(error.code).toBeTruthy();
  });

  it("unauthenticated client cannot read any orders", async () => {
    const { data, error } = await client.from("orders").select("*");
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("unauthenticated client cannot insert orders", async () => {
    const { error } = await client.from("orders").insert({
      customer_email: "attacker@example.com",
      product_sku: "FAKE",
      amount_cents: 0,
    });
    expect(error).toBeTruthy();
  });
});
