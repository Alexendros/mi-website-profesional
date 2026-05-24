import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @repo/stripe.
vi.mock("@repo/stripe", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue({
    id: "cs_test_123",
    url: "https://checkout.stripe.com/pay/test",
  }),
}));

// Mock env — valid config.
vi.mock("../../lib/env", () => ({
  serverEnv: vi.fn(() => ({
    STRIPE_SECRET_KEY: "sk_test_fake",
    STRIPE_WEBHOOK_SECRET: "whsec_test_fake",
    DATABASE_URL: "postgresql://test",
  })),
}));

// Mutable reference so tests can flip the return value.
const checkRateLimitMock = vi.fn(
  (_key: string): Promise<boolean> => Promise.resolve(true),
);
vi.mock("../../lib/ratelimit", () => ({
  checkRateLimit: (key: string) => checkRateLimitMock(key),
}));

import { POST } from "../api/checkout/route";

function buildRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/checkout", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "1.2.3.4",
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  sku: "test-sku",
  email: "user@example.com",
  withdrawalConsent: true,
};

describe("POST /api/checkout — rate limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 429 cuando se supera el rate limit", async () => {
    checkRateLimitMock.mockResolvedValue(false);
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toMatch(/solicitudes/i);
  });

  it("permite la petición cuando el rate limit no se supera", async () => {
    checkRateLimitMock.mockResolvedValue(true);
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toBeDefined();
  });
});
