// RLS tests for StripeEvent table — verify server-only access.
// Requires: Supabase test project with RLS policies from
// packages/db/supabase/rls-policies.sql applied.

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

describe.skipIf(!HAS_SUPABASE)("RLS: StripeEvent access", () => {
  let client: SupabaseClient;

  beforeAll(() => {
    client = anonClient();
  });

  it("anon cannot read stripe events", async () => {
    const { data, error } = await client
      .from("stripe_events")
      .select("id")
      .limit(1);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("anon cannot insert stripe events", async () => {
    const { error } = await client.from("stripe_events").insert({
      id: "evt_fake_test",
      type: "test.event",
    });
    expect(error).toBeTruthy();
  });

  it("anon cannot delete stripe events", async () => {
    const { data } = await client
      .from("stripe_events")
      .delete()
      .eq("id", "evt_fake_test")
      .select();
    expect(data?.length ?? 0).toBe(0);
  });
});
