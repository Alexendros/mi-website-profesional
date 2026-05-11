# Fase 8 — Criterios de verificacion

- [ ] n8n healthz responde 200 en VPS
- [ ] W-01: email bienvenida llega en < 2min tras checkout de prueba
- [ ] W-02: email "problema con pago" llega tras simular `invoice.payment_failed` con Stripe CLI
- [ ] W-05: cron identifica suscripciones con trial expirando en 3 dias
- [ ] W-07: reporte semanal llega el lunes a las 09:00 CET
- [ ] Webhook n8n: request sin `N8N_WEBHOOK_SECRET` correcto → 401
- [ ] n8n no almacena credenciales de tarjeta (nunca recibe datos PCI)
- [ ] Memory usage VPS < 80% con todos los workflows activos
