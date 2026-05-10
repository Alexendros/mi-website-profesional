# Fase 9 — Criterios de go-live

## Seguridad (bloquea go-live si falla cualquiera)
- [ ] 0 vulnerabilidades high/critical en `pnpm audit`
- [ ] RLS tests verdes para todas las tablas
- [ ] Secretos ausentes en client bundle
- [ ] HTTPS activo con TLS 1.2+ en ambos dominios
- [ ] securityheaders.com: nota A o superior

## Rendimiento (bloquea go-live si falla)
- [ ] LCP < 2.0s desktop en landing alexendros.pro
- [ ] LCP < 2.5s mobile en perfil stagekit.app
- [ ] Lighthouse Performance >= 90 en landing

## Compliance (bloquea go-live si falla)
- [ ] Politica de privacidad publicada y accesible desde footer
- [ ] Cookie banner bloqueante — E2E test verde
- [ ] ConsentLog activo en DB

## Operaciones
- [ ] Sentry recibe errores de prueba sin PII
- [ ] n8n healthz verde
- [ ] Uptime monitor configurado para alexendros.pro y stagekit.app

## Release
- [ ] Tag v1.0.0 firmado en git
- [ ] CHANGELOG.md con version y fecha real
- [ ] GitHub Release creada
