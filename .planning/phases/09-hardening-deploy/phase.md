# Fase 9 — Hardening y Deploy a Produccion

- Estado: PENDIENTE
- Prerrequisito: Fases 5-8 completadas con checklist verde
- Duracion estimada: 1 semana
- Checklist: docs/10-checklist-pre-produccion.md

## Objetivo

Verificacion completa de seguridad, rendimiento, compliance y operaciones antes del go-live de alexendros.pro y stagekit.app.

## Bloques de verificacion

### A — Seguridad
- [ ] `pnpm audit --audit-level=high` sin vulnerabilidades
- [ ] Todas las variables de entorno validadas con Zod al arrancar
- [ ] RLS habilitado y probado en TODAS las tablas
- [ ] Headers de seguridad activos (CSP, HSTS, X-Frame-Options, COOP/COEP)
- [ ] Rate limiting activo en `/api/trpc/*` y `/api/auth/*`
- [ ] Webhooks Stripe: verificacion de firma obligatoria
- [ ] Secretos no aparecen en logs ni en client bundle
- [ ] Threat model revisado — controles transversales implementados

### B — Rendimiento (CWV obligatorios)
- [ ] LCP < 2.0s desktop, < 2.5s mobile en landing
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] Lighthouse Performance >= 90 en landing + dashboard + perfil kit

### C — Compliance legal
- [ ] Cookie banner bloqueante real (AEPD 2023) — test E2E de no-carga PostHog
- [ ] Politica de privacidad publicada (RGPD Art. 13)
- [ ] Aviso legal publicado (LSSI-CE Art. 10)
- [ ] `ConsentLog` activo con `ip_hash` (no IP literal)
- [ ] Politica de cookies publicada
- [ ] PCI DSS: no se almacenan datos de tarjeta en ninguna tabla

### D — Observabilidad
- [ ] Sentry activo con PII anonimizado (`beforeSend`)
- [ ] PostHog EU activo y solo tras consentimiento
- [ ] Vercel Speed Insights activo
- [ ] Alertas Uptime en /healthz cada 5 min

### E — Deploy produccion
- [ ] DNS Hostinger apuntando a Vercel (A record / CNAME)
- [ ] Dominio verificado en Vercel con HTTPS activo
- [ ] Variables de entorno de produccion configuradas en Vercel
- [ ] Deploy con `main` branch (no preview)
- [ ] Smoke test post-deploy: login, checkout, webhook

### F — Documentacion final
- [ ] `CHANGELOG.md` actualizado con version 1.0.0
- [ ] `docs/10-checklist-pre-produccion.md` completado
- [ ] ADR de cualquier decision tomada en esta fase
- [ ] Runbooks revisados y actualizados

## Go-live criteria

Todos los checks A-F deben estar verdes antes del anuncio publico.
