# 06 — Fases de Implementación (Vista Semanal)

> Derivado del plan maestro (`plan-maestro-implementacion.md`). Este documento es la vista operativa semana a semana.

---

## Calendario de implementación (~14 semanas)

| Semanas | Fase maestro | Entregable clave | Verificación |
|---------|-------------|------------------|--------------|
| **S0** | FASE 0 — Scaffolding | Turborepo funcional, CLAUDE.md, agents/skills, tooling | `pnpm turbo build` exitoso |
| **S1** | FASE 1 — Brand + Config | Tokens oklch, paleta por app, Tailwind preset, fuentes | Tokens cargando en `packages/brand` |
| **S2** | FASE 2 — UI Components | shadcn/ui inicializado, 15+ componentes, dark-first | `@repo/ui` exportable |
| **S3-S4** | FASE 3 — alexendros.me | Landing estática desplegada, SEO, legal, CWV | Lighthouse > 90, JSON-LD validado |
| **S5** | FASE 4 — DB | Prisma schema completo (11 modelos), RLS, seed | `prisma migrate dev` + RLS test |
| **S6** | FASE 5 — Stripe + Email | Planes, checkout, webhooks (5 eventos), React Email | Checkout test 4242 + webhook OK |
| **S7-S9** | FASE 6 — alexendros.pro | Hub: auth, dashboard, waitlist, billing, legal | Auth + checkout funcionales |
| **S10-S12** | FASE 7 — StageKit MVP | Onboarding, EPK builder, booking, Stripe, landing | E2E: registro → perfil → booking |
| **S12-S13** | FASE 7.5 — n8n Workflows | 28 automatizaciones: onboarding, dunning, churn, ops | W-01 welcome + W-11 dunning OK |
| **S13** | FASE 8 — Hardening | Checklist pre-producción completo (Bloques B-I) | GREEN LIGHT en todos los bloques |
| **S14** | FASE 9 — Deploy prod | 3 dominios activos, CI/CD, Stripe live, monitoring | CWV verde, npm audit limpio |

---

## Detalle por fase

### S0 — Scaffolding (FASE 0)
- Inicializar Turborepo con `pnpm-workspace.yaml`
- Crear estructura `packages/` (config, brand, ui, db, stripe, email)
- Instalar `/CLAUDE.md`, `.claude/agents/` (5), `.claude/skills/` (6), `.claude/mcp.json`
- TypeScript strict + ESLint flat config + Prettier
- Git strategy: `main` → `dev` → `feature/*`
- `.gitignore`, `.env.example`

### S1 — Brand + Config (FASE 1)
- `packages/brand/tokens.ts`: paleta oklch (dark-acid y temas futuros)
- `packages/brand/fonts.ts`: Geist + Geist Mono (next/font)
- `packages/brand/globals.css`: CSS variables
- `packages/config/tailwind.preset.ts`: preset Tailwind v4

### S2 — UI Components (FASE 2)
- shadcn/ui init (style: new-york, baseColor: zinc, CSS vars: true)
- 15+ componentes obligatorios instalados
- Exportar como `@repo/ui`
- Ejecutar `/ui-ux-pro-max` antes de diseñar

### S3-S4 — alexendros.me (FASE 3)
- Next.js 15 con `output: 'export'` (estático)
- Hero + About + Projects + Uses + Contact
- Legal: aviso-legal, privacidad, cookies
- SEO: JSON-LD Person, sitemap, robots, OG images
- CWV: LCP < 2.0s, Lighthouse > 90
- Deploy a Vercel con dominio alexendros.me
- **Resultado:** Branding validado en producción

### S5 — DB (FASE 4)
- Prisma schema: 11 modelos (App, User, Plan, Subscription, ClientProfile, AppProfile, InboundRequest, Affiliate, AffiliatePayout, AuditLog, DigitalRegistration)
- RLS completo en 11 tablas
- Supabase client factory (SSR)
- Seed data + env.ts validación Zod

### S6 — Stripe + Email (FASE 5)
- `packages/stripe/`: app-plans, checkout, affiliate, webhook-handler
- 5 eventos Stripe obligatorios
- Comisión afiliado: 15% mensual durante 12 meses (no setup fee)
- Trial: 14 días sin tarjeta, auto-Free si no convierte
- `packages/email/`: 6 templates React Email + Resend client

### S7-S9 — alexendros.pro (FASE 6)
- Next.js 15 con server-side, conectado a todos los packages
- Landing pública: UVP del hub, catálogo, pricing, waitlist
- Auth: Supabase SSR (email + Google OAuth)
- Dashboard: app activa, suscripción, billing portal, ARCO
- Legal completo + cookie banner granular
- API tRPC v11 + webhooks + rate limiting

### S10-S12 — StageKit MVP (FASE 7)
- Onboarding artista: 3 pasos
- EPK builder con preview en tiempo real
- Booking form embebido + dashboard
- Stripe: checkout Pro, feature gates
- Landing: UVP, demo, pricing 3 planes

### S12-S13 — Automatizaciones n8n (FASE 7.5)
- **Onboarding:** Welcome sequence (W-01), checklist tracker (W-02), setup fee (W-03)
- **Engagement:** Weekly digest (W-04), booking notify (W-05), milestones (W-06), re-engagement (W-07)
- **Trial:** Progress (W-08), expired (W-09), upgrade (W-10)
- **Dunning:** 3 intentos (W-11/12/13), suspensión (W-14), recordatorio (W-15), pre-eliminación (W-16), eliminación RGPD (W-17)
- **Churn:** Cancelación + encuesta (W-18), último día (W-19), post-baja (W-20), win-back 30d/90d (W-21/22)
- **Operativo:** Booking→CRM (W-23), SEO check (W-24), contratos (W-25), tokenización (W-26), facturas (W-27), affiliates (W-28)

### S13 — Hardening (FASE 8)
- Bloques B-I del checklist pre-producción
- Security: npm audit, secrets scan, RLS verification
- Tests: Vitest unit (60%+), Playwright E2E (4 flujos)

### S14 — Deploy producción (FASE 9)
- GitHub Actions: lint + typecheck + test
- Vercel: 3 proyectos (alexendros-me, alexendros-pro, stagekit)
- Stripe live + webhooks registrados
- Monitoring: Sentry, PostHog EU, Better Uptime

---

## KPIs de lanzamiento (target mes 1)

| Métrica | Target |
|---------|--------|
| Artistas registrados | 50 |
| EPKs publicados | 30 |
| Trials iniciados | 20 |
| Conversión trial→Pro | ≥ 25% |
| Booking requests generados | 15 |
| MRR | ≥ 145 € |
