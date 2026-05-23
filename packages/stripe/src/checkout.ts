// Creación de sesión de Stripe Checkout (Opción A: pago único de producto
// digital). Resuelve el precio desde el catálogo BD, nunca desde el cliente.

import { getStripe } from "./client";
import { getCatalogEntry } from "./catalog";

export type CreateCheckoutInput = {
  sku: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
  // art. 103.m TRLGDCU: consentimiento expreso a la ejecución inmediata
  // del contenido digital (pérdida del derecho de desistimiento).
  withdrawalConsent: boolean;
};

export type CreateCheckoutResult = {
  id: string;
  url: string;
};

export async function createCheckoutSession(
  input: CreateCheckoutInput,
): Promise<CreateCheckoutResult> {
  const entry = await getCatalogEntry(input.sku);
  if (!entry) {
    throw new Error(`SKU no disponible o sin precio Stripe: ${input.sku}`);
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: entry.stripePriceId, quantity: 1 }],
    customer_email: input.email,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      sku: entry.sku,
      withdrawal_consent: input.withdrawalConsent ? "1" : "0",
    },
    payment_intent_data: { metadata: { sku: entry.sku } },
  });

  if (!session.url) {
    throw new Error("Stripe no devolvió URL de checkout");
  }
  return { id: session.id, url: session.url };
}
