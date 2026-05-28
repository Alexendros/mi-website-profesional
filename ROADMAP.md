# Roadmap de alexendros-pro (monorepo)

Plan a alto nivel. No son compromisos firmes; las prioridades pueden
cambiar según el contexto. El detalle por fases vive en `.planning/ROADMAP.md`
(historial) y en `docs/06-fases-implementacion.md`.

## En curso · Q2 2026

- [ ] **alexendros.pro — activar la landing de servicios (MVP).** La landing ya
      está construida (servicios + CTA a la tienda, contacto por formulario/Resend,
      Calendly y WhatsApp, legales, SEO) e integrada sobre la tienda de productos
      digitales ya en `main`. Pendiente: configurar variables de contacto en
      Vercel, verificar dominio en Resend y desplegar.
- [ ] **Fase 4 — Base de datos.** Prisma + Supabase (RLS). Bloqueada por
      credenciales Supabase EU en `.env.local`.

## Próximos trimestres

### Q+1

- [ ] **Fase 5 — Pagos y email.** Stripe Subscriptions + React Email/Resend.
- [ ] **Fase 6 — Hub alexendros.pro completo.** Auth (Supabase SSR), dashboard,
      tRPC v11 y pagos, construidos sobre la landing actual.

### Q+2

- [ ] **Fase 7 — StageKit MVP** (`apps/kitos/stagekit`). Onboarding artista, EPK
      builder, booking, billing y landing del producto.

## Backlog

- [ ] **Fase 8 — Automatización n8n** (CRM, secuencias de dunning).
- [ ] **Fase 9 — Hardening** (Sentry, cobertura de tests, compliance final).
- [ ] **LexKit** (lexkit.pro) — roadmap Q3 2026.
- [ ] **GestKit** (gestkit.pro) — roadmap Q4 2026.

## Completado

- [x] 2026-04 · Fase 1 (scaffold Turborepo) y Fase 2 (design system, tokens oklch).
- [x] 2026-04-11 · Fase 3 (alexendros.me) completada y extraída a repo standalone.
- [x] 2026-05 · alexendros.pro pivota a landing de captación de servicios (MVP).
- [x] 2026-05 · Limpieza de directorios/código muerto y refresco de documentación.
