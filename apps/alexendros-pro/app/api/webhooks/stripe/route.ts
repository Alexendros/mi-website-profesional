// POST /api/webhooks/stripe — verifica firma, idempotencia vía StripeEvent,
// y al completar el pago crea el Order con token de descarga.
// Runtime Node + force-dynamic (raw body íntegro para verificar la firma).

import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { verifyWebhook, type Stripe } from "@repo/stripe";
import { serverEnv } from "../../../../lib/env";
import { fulfillOrder } from "../../../../lib/fulfillment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOWNLOAD_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function POST(req: Request): Promise<Response> {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta firma" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = await verifyWebhook(
      rawBody,
      signature,
      serverEnv().STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  // Idempotencia: si el evento ya se procesó, ack sin reprocesar.
  const already = await prisma.stripeEvent.findUnique({
    where: { id: event.id },
  });
  if (already) {
    return NextResponse.json({ received: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sku = session.metadata?.["sku"];
    const email =
      session.customer_details?.email ?? session.customer_email ?? null;

    if (sku && email) {
      // El registro del evento va ATÓMICO con el Order y ANTES del email:
      // si algo falla tras el envío, el reintento de Stripe encuentra el
      // evento ya registrado (early-ack arriba) y no reenvía el correo.
      const [order] = await prisma.$transaction([
        prisma.order.upsert({
          where: { stripeSessionId: session.id },
          create: {
            customerEmail: email,
            productSku: sku,
            stripeSessionId: session.id,
            stripePaymentIntent:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            amountCents: session.amount_total ?? 0,
            currency: session.currency ?? "eur",
            status: "payment_completed",
            withdrawalWaivedAt:
              session.metadata?.["withdrawal_consent"] === "1"
                ? new Date()
                : null,
            downloadToken: crypto.randomUUID(),
            downloadExpiresAt: new Date(Date.now() + DOWNLOAD_TTL_MS),
          },
          update: { status: "payment_completed" },
        }),
        prisma.stripeEvent.create({
          data: { id: event.id, type: event.type },
        }),
      ]);

      try {
        await fulfillOrder(order.id, new URL(req.url).origin);
      } catch {
        // El fulfillment no debe tumbar el ack; el Order queda en
        // payment_completed para reintento fuera de banda.
      }
      return NextResponse.json({ received: true });
    }
  }

  // Otros eventos (o sesión sin sku/email): registrar para idempotencia.
  // upsert evita PK violation si dos entregas del mismo evento compiten.
  await prisma.stripeEvent.upsert({
    where: { id: event.id },
    create: { id: event.id, type: event.type },
    update: {},
  });

  return NextResponse.json({ received: true });
}
