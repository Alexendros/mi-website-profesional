# Fase 8 — Tareas detalladas

## T8.1 — Verificar n8n operativo
- SSH a VPS Hostinger, verificar Docker Compose con n8n activo
- Confirmar `/healthz` responde 200
- Crear credencial Resend en n8n (HTTP Header Auth)
- Crear credencial Stripe (restricted key read-only) en n8n

## T8.2 — Webhook endpoint en la app
- `app/api/webhooks/n8n/route.ts`: recibe eventos internos de n8n
- Verificar `N8N_WEBHOOK_SECRET` en header `X-Webhook-Secret`
- Rate limiting: 20 req/min

## T8.3 — Implementar W-01 (Onboarding)
- n8n: Webhook node → HTTP Request (Resend) → Wait → Email D+1 → Wait → Email D+3
- Probar con cuenta de prueba completa

## T8.4 — Implementar W-02, W-03, W-04 (Dunning)
- Stripe Trigger node para `invoice.payment_failed`
- Condicional: `attempt_count` para bifurcar W-02 vs W-03
- `customer.subscription.deleted` para W-04

## T8.5 — Implementar W-05 (Trial expirando)
- Cron node: diario 08:00 UTC
- HTTP Request a `/api/trpc/subscription.expiringSoon` para obtener lista
- Loop: enviar email personalizado por cada suscripcion

## T8.6 — Implementar W-07 (Reporte semanal)
- Cron node: lunes 09:00 CET
- HTTP Requests a: Stripe (MRR) + Sentry (errores) + DB (nuevos clientes)
- Compilar y enviar email markdown

## Verificacion de fase completada
Ver `verification.md`
