# Changelog

Todos los cambios destacables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog 1.1.0](https://keepachangelog.com/es/1.1.0/),
y este proyecto se adhiere a [SemVer 2.0.0](https://semver.org/lang/es/).

## [Sin publicar]

### Añadido

- **Stripe digital products backbone (F0–F3)**: checkout invitado, pago único, entrega por enlace tokenizado
- `@repo/stripe`: cliente lazy, catálogo-como-BD (`manifest.json`), `createCheckoutSession`, `verifyWebhook`
- `@repo/email`: Resend lazy + template `DownloadReady` + `safeSendEmail` (never-throw)
- `@repo/config/env`: `createServerEnvValidator` + `serverFields` para validación composable
- `@repo/config/ratelimit`: `createRatelimit` factory con fallback graceful (sin Upstash → allow-all)
- `apps/alexendros-pro/app/api/checkout/route.ts`: endpoint checkout con rate-limit + Zod + art.103.m TRLGDCU
- `apps/alexendros-pro/app/api/webhooks/stripe/route.ts`: webhook con firma verificada, idempotencia atómica (`StripeEvent` + `Order` en `$transaction`), fulfillment con guarda TOCTOU
- `apps/alexendros-pro/app/descarga/[token]/route.ts`: descarga tokenizada con rate-limit, validación URL, caducidad
- `apps/alexendros-pro/lib/fulfillment.ts`: fulfillment atómico (`updateMany` claim → `fulfilling` → email → `delivered`)
- `apps/alexendros-pro/lib/env.ts`: validación de `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, `RESEND_API_KEY`
- `apps/alexendros-pro/lib/ratelimit.ts`: rate limiter con fallback graceful vía `@repo/config/ratelimit`
- `apps/alexendros-pro/lib/format.ts`: `formatPrice` DRY extraído de tienda/producto
- `packages/db/prisma/schema.prisma`: modelos `Product`, `Order`, `StripeEvent` + enums `DeliveryMode`, `OrderStatus` (con `fulfilling`)
- Tests obligatorios: `webhook-stripe.test.ts` (firma) + `checkout-ratelimit.test.ts` (429)
- CSS vars `--color-feedback-error`/`--color-feedback-success` (OKLCH)
- `packages/config/vitest.base.ts`: configuración Vitest compartida (`@repo/config/vitest.base`)
- Vitest smoke en `alexendros-pro` y `stagekit`; Playwright E2E smoke en StageKit (puerto 3001)
- `packages/seo`: nuevo paquete `@repo/seo` con factories Schema.org (JSON-LD)
- `docs/adr/`: 6 ADRs reales (0001–0006) — stack, DB, pagos, tRPC, design system, cookie consent
- `docs/threat-model.md`: modelo de amenazas STRIDE + LINDDUN con adversarios A1-A8
- `docs/runbooks/`: 7 runbooks operacionales (incident-response, postmortem-template, rotate-stripe-keys, rotate-supabase-keys, db-restore, secret-revoke, deploy-rollback)
- `docs/research/benchmark-2026-05-portales.md`: análisis de Vercel, Stripe, Linear y next-forge
- `.github/workflows/ci.yml`: jobs E2E (Playwright) y Lighthouse CI, Node.js 24, `pnpm audit`
- `apps/alexendros-pro/playwright.config.ts`: E2E con Chromium + mobile-chrome
- `apps/alexendros-pro/tests/`: specs a11y (axe-core WCAG 2.1 AA), responsive y landing

### Cambiado

- `package.json` `engines.node`: `>=22` → `>=24`
- `turbo.json`: tarea `test:e2e` añadida con env `PLAYWRIGHT_BASE_URL`
- `packages/config/eslint.config.mjs`: añadidos `eslint-config-prettier` + `@next/eslint-plugin-next` core-web-vitals
- `apps/alexendros-pro/vercel.json`: headers COOP/COEP/CORP/Origin-Agent-Cluster añadidos
- `ARCHITECTURE.md`: reescrito para reflejar estructura real del monorepo Turborepo
- `CONTRIBUTING.md`: gates obligatorios — RLS, webhook signature, rate-limit tests
- `.github/workflows/ci.yml`: jobs divididos (`lint`, `typecheck`, `build`, `Playwright`, `E2E`) para coincidir con branch protection
- `apps/alexendros-pro/components/buy-button.tsx`: respuesta checkout type-safe con Zod schemas (elimina cast `as`)
- Documentos canon: actualizado nombre `mi-website-profesional` → `alexendros-pro`, dominio `.me` → `.pro`

## [0.1.0] — 2026-05-10

### Añadido

- Scaffold inicial del monorepo Turborepo con pnpm workspaces
- Design system Vergina Imperial v0.2.2 (`packages/brand/`) — dark-first, tokens OKLCH
- 15 componentes shadcn/ui en `packages/ui/`
- Validación de variables de entorno con Zod (`lib/env.ts`)
- Canon de documentación: README, ARCHITECTURE, SECURITY, CONTRIBUTING, STYLEGUIDE, CHANGELOG, RELEASE, SUPPORT
- Protocolo canon de gestión interna (cuaderno, skills, agents, hooks)

[Sin publicar]: https://github.com/Alexendros/alexendros-pro/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Alexendros/alexendros-pro/releases/tag/v0.1.0
