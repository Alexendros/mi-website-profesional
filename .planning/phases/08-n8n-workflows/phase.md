# Fase 8 — n8n Workflows (automatizacion)

- Estado: PENDIENTE
- Prerrequisito: Fase 7 (StageKit MVP) con usuarios reales
- Duracion estimada: 1 semana
- Infra: n8n self-hosted en Hostinger VPS (Docker Compose)

## Objetivo

Implementar los workflows de automatizacion criticos: dunning de pagos fallidos, onboarding de nuevos clientes, y notificaciones operacionales.

## Workflows prioritarios (W-01 a W-07)

### W-01: Onboarding nuevo cliente
- Trigger: webhook `checkout.session.completed`
- Acciones: enviar email bienvenida via Resend, crear registro en CRM interno, slack/notify operador
- Condicional: si trial → enviar secuencia de onboarding (D+1, D+3, D+7)

### W-02: Dunning — primer intento fallido
- Trigger: webhook `invoice.payment_failed` (primer fallo)
- Accion: email "Problema con tu pago" con link a actualizar tarjeta
- Delay: inmediato

### W-03: Dunning — segundo intento
- Trigger: `invoice.payment_failed` con `attempt_count = 2`
- Accion: email urgente + notificacion al operador
- Delay: 3 dias tras W-02

### W-04: Dunning — cancelacion
- Trigger: `customer.subscription.deleted` por impago
- Accion: email de cancelacion + oferta de reactivacion
- DB: marcar `Subscription.status = 'cancelled'`

### W-05: Trial expirando
- Trigger: cron diario — buscar suscripciones con `trial_end` en 3 dias
- Accion: email "Tu prueba gratuita termina en 3 dias"

### W-06: Booking request recibido
- Trigger: webhook custom desde `/api/webhooks/n8n`
- Accion: notificacion email al artista + mensaje Slack/Telegram al operador

### W-07: Reporte semanal operador
- Trigger: cron lunes 9:00 CET
- Accion: email resumen (MRR, nuevos clientes, cancelaciones, errores Sentry)

## Infra n8n

- Docker Compose en Hostinger VPS (ya existente)
- Endpoint healthz: `/healthz` monitoreado por Better Uptime cada 5 min
- Credenciales: Resend API key, Stripe restricted key (read-only para n8n)
- Webhook secret: `N8N_WEBHOOK_SECRET` validado en cada webhook entrante
