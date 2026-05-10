# Fase 5 — Tareas detalladas

## T5.1 — Setup Stripe SDK
- Instalar `stripe` en `packages/stripe/`
- Crear singleton con lazy init (evitar imports en cliente)
- Validar `STRIPE_SECRET_KEY` con Zod en `@repo/config/env`

## T5.2 — Webhook handler
- `route.ts` con `fetchRequestHandler` en Edge Runtime
- Verificar firma con `stripe.webhooks.constructEvent()`
- Switch sobre 6 eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `transfer.created`, `payment_intent.succeeded`
- Rate limiting: exento (Stripe IP range) pero validar firma siempre

## T5.3 — Checkout flow
- Server Action `createCheckoutSession(priceId, userId)` 
- Redirect a Stripe hosted checkout
- Success URL con `session_id` param para confirmar en DB

## T5.4 — React Email templates (4 mínimas)
- Welcome, subscription confirmed, payment failed, cancelled
- Variables de marca desde `packages/brand/`
- Preview con `email dev` en localhost

## T5.5 — Tests
- Vitest: webhook signature, price_id validation
- Playwright E2E: checkout flow completo (Stripe Test Mode)

## T5.6 — Stripe Connect Express (afiliados) — puede diferirse a Fase 7
- Onboarding flow con `stripe.accounts.create({ type: 'express' })`
- Tabla `Affiliate` en DB
- Dashboard básico de comisiones

## Verificación de fase completada
Ver `verification.md`
