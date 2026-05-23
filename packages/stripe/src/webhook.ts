// Verificación de firma de webhook Stripe. `constructEventAsync` es
// serverless-safe (no usa crypto síncrono); requiere el raw body sin parsear.

import { getStripe } from "./client";
import type { Stripe } from "stripe";

export async function verifyWebhook(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<Stripe.Event> {
  const stripe = getStripe();
  return stripe.webhooks.constructEventAsync(rawBody, signature, secret);
}
