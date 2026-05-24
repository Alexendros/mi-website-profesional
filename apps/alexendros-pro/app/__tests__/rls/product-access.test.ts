// RLS tests for Product table — verify public catalog read, admin-only write.
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

describe.skipIf(!HAS_SUPABASE)("RLS: Product access", () => {
  let client: SupabaseClient;

  beforeAll(() => {
    client = anonClient();
  });

  it("anon can read active products", async () => {
    // If there are active products seeded, they should be visible
    const { data, error } = await client
      .from("products")
      .select("sku, title, is_active")
      .eq("is_active", true);
    expect(error).toBeNull();
    // All returned products must be active
    for (const p of data ?? []) {
      expect(p.is_active).toBe(true);
    }
  });

  it("anon cannot read inactive products", async () => {
    const { data, error } = await client
      .from("products")
      .select("sku")
      .eq("is_active", false);
    expect(error).toBeNull();
    // RLS policy blocks inactive products from anon
    expect(data).toEqual([]);
  });

  it("anon cannot insert products", async () => {
    const { error } = await client.from("products").insert({
      sku: "FAKE-PRODUCT",
      slug: "fake",
      title: "Fake",
      description_md: "x",
      category: "test",
      price_cents: 100,
    });
    expect(error).toBeTruthy();
  });

  it("anon cannot update products", async () => {
    const { data } = await client
      .from("products")
      .update({ title: "Hacked" })
      .eq("sku", "TEMPLATE-PORTFOLIO-V1")
      .select();
    expect(data?.length ?? 0).toBe(0);
  });

  it("anon cannot delete products", async () => {
    const { data } = await client
      .from("products")
      .delete()
      .eq("sku", "TEMPLATE-PORTFOLIO-V1")
      .select();
    expect(data?.length ?? 0).toBe(0);
  });
});
