# Fase 5 — Pagos y Email

- Estado: PENDIENTE
- Prerrequisito: Fase 4 (Base de Datos) completada con credenciales Supabase reales
- Duración estimada: 2 semanas
- ADRs: docs/adr/0003-stripe-connect-express.md

## Objetivo

Integrar Stripe Subscriptions + Connect Express para suscripciones de clientes y programa de afiliados. Integrar Resend + React Email para comunicaciones transaccionales.

## Componentes a implementar

### Stripe
- [ ] `packages/stripe/src/client.ts` — Stripe SDK singleton server-only
- [ ] `packages/stripe/src/webhooks.ts` — `constructEvent` + tipado de 6 eventos críticos
- [ ] `packages/stripe/src/subscriptions.ts` — helpers crear/cancelar/actualizar suscripción
- [ ] `apps/alexendros-pro/app/api/webhooks/stripe/route.ts` — webhook handler
- [ ] `apps/alexendros-pro/app/api/checkout/route.ts` — crear Checkout Session
- [ ] Variables env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*`

### Stripe Connect Express (afiliados)
- [ ] `packages/stripe/src/connect.ts` — onboarding afiliados Express
- [ ] Modelo `Affiliate` en Prisma (si no existe)
- [ ] Webhook `transfer.created` para registrar comisión

### React Email + Resend
- [ ] `packages/email/emails/welcome.tsx` — email bienvenida tras suscripción
- [ ] `packages/email/emails/subscription-confirmed.tsx`
- [ ] `packages/email/emails/payment-failed.tsx`
- [ ] `packages/email/emails/subscription-cancelled.tsx`
- [ ] `packages/email/src/send.ts` — función `sendEmail()` con Resend
- [ ] Preview local: `email dev` script

## Tests obligatorios

- [ ] Test firma webhook (válida + inválida + replay)
- [ ] Test checkout session con price_id de env var
- [ ] Test email template renders sin errores
- [ ] E2E: flujo completo checkout → webhook → DB actualizada
