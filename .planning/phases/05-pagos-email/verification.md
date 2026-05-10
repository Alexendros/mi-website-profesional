# Fase 5 — Criterios de verificación

## Funcional
- [ ] Checkout de prueba en Stripe Test Mode completa sin errores
- [ ] Webhook recibe y procesa `checkout.session.completed`
- [ ] DB actualiza `Subscription.status = 'active'` tras checkout exitoso
- [ ] Email de bienvenida llega a la bandeja de entrada de prueba (Resend test)
- [ ] Email de pago fallido se envía cuando `invoice.payment_failed` llega

## Seguridad
- [ ] Request sin `stripe-signature` → 400
- [ ] Request con firma inválida → 400
- [ ] Request con timestamp >5min fuera de rango → 400
- [ ] `STRIPE_SECRET_KEY` no aparece en logs ni en client bundle

## Compliance
- [ ] PCI DSS: no se almacenan datos de tarjeta en ninguna tabla
- [ ] PSD2/3DS2: checkout usa `payment_method_options.card.request_three_d_secure: 'automatic'`
- [ ] Trial 14 días en subscriptions: `trial_period_days: 14`

## Tests CI
- [ ] `pnpm turbo test` verde con tests de webhook signature
- [ ] `pnpm turbo test:e2e` verde con flujo checkout E2E
