# 04 — Pagos & Suscripciones

## Planes (Stripe)

```tsx
// lib/stripe/plans.ts
export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    stripePriceId: null,
    features: [
      '1 EPK público',
      'Formulario de booking básico',
      'Perfil de artista',
      'Analytics básico (30 días)',
    ],
    limits: { epks: 1, bookingsPerMonth: 10 }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 29,
    stripePriceId: process.env.STRIPE_PRICE_STAGEKIT_PRO_MONTHLY!,
    features: [
      'EPKs ilimitados + multitemplate',
      'Booking manager completo (calendario, bloqueos)',
      'Analytics avanzado (12 meses)',
      'Custom domain para EPK',
      'Rider técnico PDF generator',
      'Email sequences automáticos',
    ],
    limits: { epks: -1, bookingsPerMonth: -1 }  // -1 = ilimitado
  },
  AGENCY: {
    id: 'agency',
    name: 'Agency',
    priceMonthly: 199,
    stripePriceId: process.env.STRIPE_PRICE_STAGEKIT_AGENCY_MONTHLY!,
    features: [
      'Todo Pro',
      'Gestión multi-artista (hasta 20)',
      'White-label EPKs',
      'API access',
      'Soporte prioritario 24h',
      'Onboarding asistido',
    ],
    limits: { epks: -1, bookingsPerMonth: -1, artists: 20 }
  }
} as const;

export type PlanId = keyof typeof PLANS;
```

## Webhook Handler

```tsx
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // 5 eventos obligatorios
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscriptionChange(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    case 'transfer.created':
      await handleAffiliateTransfer(event.data.object);
      break;
  }

  return Response.json({ received: true });
}
```

## Sistema de afiliación — Stripe Connect

```tsx
// lib/stripe/affiliate.ts
// Stripe Connect Express para pagar comisiones a afiliados

export async function createAffiliateAccount(email: string) {
  return stripe.accounts.create({
    type: 'express',
    email,
    capabilities: { transfers: { requested: true } },
    business_type: 'individual',
    settings: { payouts: { schedule: { interval: 'monthly', monthly_anchor: 1 } } }
  })
}

export async function payAffiliateCommission({
  affiliateStripeAccountId,
  amount,          // en cents EUR
  description
}: { affiliateStripeAccountId: string; amount: number; description: string }) {
  return stripe.transfers.create({
    amount,
    currency: 'eur',
    destination: affiliateStripeAccountId,
    description
  })
}

// Comisión afiliado: 15% de la suscripción mensual (NO del setup fee)
// Duración: 12 meses desde la activación del referido
// Cálculo: commission_monthly = priceMonthly * 0.15
// Pago: mensual vía Stripe Connect Transfer
// Total máximo por referido: priceMonthly * 12 * 0.15

// Trial: 14 días sin tarjeta
// Configuración Stripe: trial_period_days = 14
// Sin método de pago requerido al inicio
// Al expirar: auto-conversión a plan Free si no convierte
```

## Compliance PCI DSS + GDPR

```yaml
pci_dss_v4:
  nivel: SAQ-A (Stripe gestiona todo el entorno de datos de tarjeta)
  obligaciones_propias:
    - Nunca almacenar PANs, CVVs, datos de pista
    - HTTPS/TLS 1.2+ en todas las comunicaciones
    - Webhook endpoint verificado con firma HMAC-SHA256
    - Acceso a Stripe Dashboard con MFA

psd2_sca:
  requerimiento: 3DS2 para pagos > 30€ en UE
  implementacion: Stripe gestiona automáticamente con PaymentIntent
  directiva: 2015/2366/UE (PSD2), transpuesta ES via RD-ley 19/2018

gdpr_pagos:
  base_legal: Art. 6.1.b RGPD (ejecución de contrato)
  datos_procesados: email, nombre, historial de pagos
  retention: 5 años (obligación fiscal Art. 30 LGT)
  dpa_stripe: Standard Contractual Clauses (SCC) para transferencia EEUU→UE
```