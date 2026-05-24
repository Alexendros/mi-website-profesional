// POST /api/checkout — crea sesión de Stripe Checkout para un SKU del catálogo.
// Runtime Node (Prisma/@repo/stripe no corren en edge).

import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession, getStripe } from "@repo/stripe";
import { serverEnv } from "../../../lib/env";
import { checkRateLimit } from "../../../lib/ratelimit";

export const runtime = "nodejs";

const BodySchema = z.object({
  sku: z.string().min(1),
  email: z.string().email(),
  // Checkbox obligatorio art. 103.m TRLGDCU antes del pago.
  withdrawalConsent: z.literal(true),
});

export async function POST(req: Request): Promise<Response> {
  let env: ReturnType<typeof serverEnv>;
  try {
    env = serverEnv();
  } catch {
    return NextResponse.json(
      { error: "Servicio no configurado" },
      { status: 503 },
    );
  }

  getStripe(env.STRIPE_SECRET_KEY);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!(await checkRateLimit(ip))) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes, inténtalo más tarde" },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos o falta el consentimiento" },
      { status: 422 },
    );
  }

  const origin = new URL(req.url).origin;
  try {
    const { url } = await createCheckoutSession({
      sku: parsed.data.sku,
      email: parsed.data.email,
      withdrawalConsent: parsed.data.withdrawalConsent,
      successUrl: `${origin}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/tienda`,
    });
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Error de checkout" },
      { status: 400 },
    );
  }
}
