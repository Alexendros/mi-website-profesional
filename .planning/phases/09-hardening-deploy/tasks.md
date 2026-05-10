# Fase 9 — Tareas detalladas

## T9.1 — Audit de seguridad completo
- `pnpm audit --audit-level=high` — resolver todas las vulnerabilidades
- Bundle analyzer: verificar que ninguna clave aparece en bundle cliente
  ```bash
  pnpm --filter=alexendros-pro build && npx @next/bundle-analyzer
  ```
- Revisar `vercel.json` headers con securityheaders.com

## T9.2 — Tests RLS completos
- Ejecutar suite de tests RLS para todas las tablas del schema
- Verificar multi-tenant: usuario A no puede ver datos de usuario B

## T9.3 — Lighthouse CI final
- Ejecutar contra URL de produccion (o preview URL de Vercel)
- Targets: landing, dashboard (autenticado), perfil StageKit publico
- Si algun score < 90: identificar y resolver regresion

## T9.4 — Compliance checklist
- Revisar `docs/07-compliance-legal.md` linea por linea
- Verificar que textos legales (privacidad, aviso legal, cookies) estan publicados
- E2E test cookie banner: PostHog no carga antes de "Aceptar"

## T9.5 — DNS y Vercel
- Verificar DNS en Hostinger: A record para alexendros.pro y stagekit.app
- `vercel domains add alexendros.pro` si no esta ya configurado
- HTTPS: verificar certificado TLS activo con `curl -I https://alexendros.pro`

## T9.6 — Smoke test post-deploy
- Login en alexendros.pro con cuenta real
- Checkout de prueba en Stripe Test Mode (con card 4242 4242 4242 4242)
- Verificar webhook procesado en logs Vercel
- Verificar email de bienvenida recibido

## T9.7 — Release 1.0.0
- Actualizar `CHANGELOG.md`: mover [Sin publicar] a [1.0.0] — fecha real
- `git tag -s v1.0.0 -m "v1.0.0"`
- `git push --follow-tags`
- Release en GitHub con notas del CHANGELOG
