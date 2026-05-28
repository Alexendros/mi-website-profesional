import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @repo/db before importing the route handler.
vi.mock("@repo/db", () => ({
  prisma: {
    stripeEvent: { findUnique: vi.fn(), upsert: vi.fn() },
    order: { upsert: vi.fn() },
    $transaction: vi.fn(),
  },
}));

// Mock @repo/stripe — verifyWebhook throws for invalid sigs.
vi.mock("@repo/stripe", () => ({
  getStripe: vi.fn(),
  verifyWebhook: vi.fn().mockRejectedValue(new Error("Invalid signature")),
}));

// Mock @repo/email.
vi.mock("@repo/email", () => ({
  getResend: vi.fn(),
}));

// Mock fulfillment.
vi.mock("../../lib/fulfillment", () => ({
  fulfillOrder: vi.fn(),
}));

// Mock env — valid config.
vi.mock("../../lib/env", () => ({
  serverEnv: vi.fn(() => ({
    STRIPE_SECRET_KEY: "sk_test_fake",
    STRIPE_WEBHOOK_SECRET: "whsec_test_fake",
    DATABASE_URL: "postgresql://test",
    RESEND_API_KEY: "re_test_fake",
  })),
}));

import { POST } from "../api/webhooks/stripe/route";

function buildRequest(opts: { body?: string; signature?: string }): Request {
  const headers = new Headers({ "content-type": "application/json" });
  if (opts.signature) headers.set("stripe-signature", opts.signature);
  return new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers,
    body: opts.body ?? "{}",
  });
}

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rechaza webhook sin cabecera stripe-signature", async () => {
    const res = await POST(buildRequest({ body: "{}" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Falta firma");
  });

  it("rechaza webhook con firma inválida", async () => {
    const res = await POST(
      buildRequest({ body: "{}", signature: "t=0,v1=bad" }),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Firma inválida");
  });
});
