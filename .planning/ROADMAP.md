# Roadmap: ALEXENDROS × KitOS

**Created:** 2026-04-06
**Phases:** 9
**Requirements:** 72
**Granularity:** Standard

---

## Phase Overview

| # | Phase | Goal | Requirements | Plans |
|---|-------|------|--------------|-------|
| 1 | Monorepo Scaffold | Turborepo funcional con todos los packages base y tooling configurado | INFRA-01..07 | 1-3 |
| 2 | Design System | Tokens de marca, tipografía y componentes UI compartidos listos para todas las apps | BRAND-01..04, UI-01..03 | 3 plans |
| 3 | alexendros.me | Landing personal estática en producción antes del día 30 para validar branding | ME-01..07 | 3 plans |
| 4 | Base de Datos | Schema Prisma completo con RLS, Supabase client factory y seed data | DB-01..06 | 1-3 |
| 5 | Pagos y Email | Stripe plans, webhook handler idempotente, Connect Express y templates email | PAY-01..06, EMAIL-01..03 | 1-3 |
| 6 | Hub alexendros.pro | Auth SSR, dashboard de usuario, legal completo y rate limiting | AUTH-01..04, PRO-01..08 | 1-4 |
| 7 | StageKit MVP | Producto vertical completo: onboarding → EPK builder → booking pipeline → Stripe | SK-01..10 | 1-4 |
| 8 | Automatizaciones n8n | Workflows CRM/email completos: onboarding, dunning, churn y operativos | N8N-01..07 | 1-3 |
| 9 | Hardening y Deploy | Tests, seguridad, monitoring y 3 dominios en producción | HARD-01..05, DEPLOY-01..05 | 1-3 |

---

## Phase 1: Monorepo Scaffold

**Goal:** Turborepo monorepo completamente funcional con `pnpm turbo build` exitoso, todos los packages base creados y tooling (TypeScript, ESLint, env validation, Git strategy) configurado.
**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07
**UI hint:** no

### Success Criteria
1. `pnpm turbo build` completa sin errores en CI con los 6 packages (config, brand, ui, db, stripe, email) y al menos un app stub.
2. `pnpm turbo lint typecheck` pasa en 0 errores en todo el monorepo con TypeScript strict y ESLint flat config.
3. `env.ts` con Zod valida las 22+ variables de entorno y lanza error descriptivo si falta alguna; `turbo.json` declara todas las `NEXT_PUBLIC_*` vars en `globalEnv`.
4. `.nvmrc` con Node 22.x presente; rama `main` y `dev` con branch protection activa en GitHub.

### Notes
- Usar `proxy.ts` desde el primer commit (no `middleware.ts`, deprecado en Next.js 16).
- `turbo.json` debe incluir `globalEnv` con todas las `NEXT_PUBLIC_*` vars — sin esto el cache de Turborepo es inválido entre entornos (riesgo CM-03).
- Inicializar apps como stubs mínimos (un `page.tsx` que renderice el nombre del kit) — la lógica real viene en fases posteriores.
- CLAUDE.md jerárquico: raíz + subdirectorios relevantes para agents y skills.

---

## Phase 2: Design System

**Goal:** Sistema de diseño completo con tokens oklch por Kit, tipografía Geist, Tailwind v4 preset y 15+ componentes shadcn/ui exportables como `@repo/ui`, testados en dark mode.
**Requirements:** BRAND-01, BRAND-02, BRAND-03, BRAND-04, UI-01, UI-02, UI-03
**UI hint:** no (outputs son packages, no páginas)

**Plans:** 3 plans

Plans:
- [x] 02-01-PLAN.md — Tokens oklch, globals.css, tipografia Geist, PostCSS por app
- [x] 02-02-PLAN.md — shadcn/ui init, 15 componentes, barrel exports, ratelimit skeleton
- [x] 02-03-PLAN.md — Build verification, dark mode WCAG AA, checkpoint visual

### Success Criteria
1. `packages/brand/tokens.ts` exporta paletas oklch para `dark-acid`, `legal-navy` y `gestoria-slate`; selector `[data-kit="x"]` cambia tema visualmente en un playground.
2. Geist + Geist Mono cargadas via `next/font` con `display: swap` verificado en Lighthouse (no FOUT).
3. 15+ componentes shadcn/ui (Button, Card, Input, Badge, Dialog, Sheet, Tabs, Table, Avatar, Dropdown, Toast, Form, Label, Separator, Skeleton) importan correctamente desde `@repo/ui` en una app de test.
4. Dark mode pasa contraste WCAG AA en todos los componentes base (verificado con axe o Storybook a11y).

### Notes
- Verificar compatibilidad shadcn/ui con Tailwind v4 al inicio de esta fase antes de construir componentes (riesgo CM-07).
- `packages/config/src/ratelimit.ts` con Upstash preparado aquí — se usará en Phase 6/7.
- No hardcodear colores fuera de `packages/brand/tokens.ts` (regla absoluta del monorepo).

---

## Phase 3: Landing alexendros.me

**Goal:** Landing personal estática de Alejandro en producción en alexendros.me antes del día 30 — valida el branding real y desbloquea DNS + SSL para fases posteriores.
**Requirements:** ME-01, ME-02, ME-03, ME-04, ME-05, ME-06, ME-07
**UI hint:** yes

**Plans:** 3 plans

Plans:
- [x] 03-01-PLAN.md — Layout refactor (eliminar data-kit), nav, footer, hero con posicionamiento real
- [x] 03-02-PLAN.md — Paginas de contenido (About, Projects, Uses, Contact) y legales (aviso-legal, privacidad, cookies)
- [ ] 03-03-PLAN.md — SEO (JSON-LD, sitemap, robots, OG image), security headers, build verification y deploy

### Success Criteria
1. `apps/alexendros-me` buildea con `output: 'export'` (Next.js 16.2 static) y despliega en Vercel con dominio `alexendros.me` activo con SSL — **antes del día 30**.
2. JSON-LD `Person` + `WebSite` válidos en Google Rich Results Test; sitemap.xml y robots.txt accesibles públicamente; OG image renderiza correctamente en Twitter y LinkedIn.
3. Páginas legales /legal/aviso-legal (LSSI-CE), /legal/privacidad (RGPD) y /legal/cookies (AEPD) con contenido real (no placeholder).
4. Lighthouse Performance ≥ 90, LCP < 2.0s desktop en 3G simulado; CLS < 0.1; Accessibility ≥ 90.

### Notes
- **Hardcap: producción antes del día 30.** No perfeccionar — validar branding real con URL pública.
- Riesgo SDR-03: burnout infraestructura sin feedback. Este deploy es el primer hito de momentum.
- Sentry se configura en Phase 9 para esta app (solo estática), pero Better Uptime monitorea desde aquí.
- Migración DNS Hostinger → Vercel debe hacerse en esta fase.

---

## Phase 4: Base de Datos

**Goal:** Schema Prisma completo con 11 modelos, RLS habilitado en todas las tablas Supabase, Supabase client factory SSR y seed data con Kits y planes.
**Requirements:** DB-01, DB-02, DB-03, DB-04, DB-05, DB-06
**UI hint:** no

### Success Criteria
1. `pnpm --filter=@repo/db prisma migrate dev` aplica la migración inicial sin errores; los 11 modelos (Kit, User, Plan, Subscription, ClientProfile, KitProfile, InboundRequest, Affiliate, AffiliatePayout, AuditLog, DigitalRegistration) existen en Supabase.
2. RLS habilitado en las 11 tablas con policies correctas verificadas en Supabase Studio; `service_role` puede escribir, `anon` solo lee datos públicos.
3. `AuditLog` tiene unique constraint en `stripeEventId` — verificado con `prisma validate` y test de inserción duplicada.
4. `DATABASE_URL` usa pooler port 6543 con `connection_limit=1`; `DIRECT_URL` usa port 5432 solo para migraciones — documentado en `packages/db/README`.
5. Seed ejecuta sin errores y crea: 2 Kit entries (stagekit, lexkit), 3 planes por Kit (Free/Pro/Agency) y 1 usuario test.

### Notes
- `createServerClient` de `@supabase/ssr` (no `auth-helpers-nextjs`, deprecado) es el único factory permitido.
- Documentar explícitamente qué operaciones usan `service_role` (Prisma/mutaciones) vs `anon_key` (cliente usuario).
- NO añadir pgvector al schema inicial — aplazar post-MVP (>100 artistas).
- Riesgo CP-03: `SUPABASE_SERVICE_ROLE_KEY` nunca con prefijo `NEXT_PUBLIC_` — auditado por grep en CI.
- Riesgo CM-02: pool agotado en Vercel — `connection_limit=1` obligatorio.

---

## Phase 5: Pagos y Email

**Goal:** Stripe con 3 planes, webhook handler idempotente para 6 eventos, Connect Express para afiliados, trial 14 días y 6 templates React Email con DNS de email configurado.
**Requirements:** PAY-01, PAY-02, PAY-03, PAY-04, PAY-05, PAY-06, EMAIL-01, EMAIL-02, EMAIL-03
**UI hint:** no

### Success Criteria
1. Checkout session crea suscripción Free/Pro(29€)/Agency(199€) en Stripe test mode y actualiza `Subscription` en DB con idempotency por `event.id` en `AuditLog`.
2. Webhook handler procesa los 6 eventos (checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed, transfer.created, account.updated) sin errores; test con `stripe trigger` confirma idempotency (segundo envío del mismo evento es no-op).
3. Stripe Connect Express: artista puede conectar cuenta; `payouts_enabled` se verifica antes de cualquier payout; `account.updated` actualiza estado KYC en DB.
4. Trial 14 días sin tarjeta: usuario creado en Stripe con `trial_end`; al expirar, downgrade a Free automático via webhook.
5. SPF + DKIM + DMARC configurados en DNS y verificados con `mail-tester.com` antes de enviar el primer email de producción; 6 templates React Email renderizan correctamente en Gmail, Outlook y Apple Mail.

### Notes
- Riesgo CP-02: webhooks duplicados — idempotency por `event.id` es no negociable.
- Riesgo CP-06: KYC afiliados — escuchar `account.updated` (6º evento añadido en research).
- Riesgo CM-06: emails en spam — SPF/DKIM/DMARC antes del primer email de producción.
- Feature gate PAY-06: limitar por output (10 booking requests/mes en Free), no por input. Mostrar features Pro bloqueadas — el upgrade ocurre en el momento del éxito.
- `STRIPE_WEBHOOK_SECRET` validado con `stripe.webhooks.constructEvent()` — sin excepción.
- 3DS2/SCA obligatorio para transacciones UE (Directiva PSD2 2015/2366/UE).

---

## Phase 6: Hub alexendros.pro

**Goal:** App alexendros.pro con auth SSR completa, dashboard de usuario, legal RGPD completo con cookie banner real, tRPC y rate limiting operativos.
**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, PRO-01, PRO-02, PRO-03, PRO-04, PRO-05, PRO-06, PRO-07, PRO-08
**UI hint:** yes

### Success Criteria
1. Login con email y Google OAuth funciona; `proxy.ts` usa `getUser()` (no `getSession()`) y devuelve `supabaseResponse`; rutas `/(dashboard)/*` redirigen a /login si no autenticado.
2. Cookie banner bloquea PostHog hasta `onAccept`; botón "Rechazar todas" visualmente equivalente al de "Aceptar todo" (requisito AEPD 2023); PostHog no carga si se rechaza.
3. ARCO endpoints `/api/account/export` y `/api/account/delete` funcionan: export devuelve JSON con todos los datos del usuario; delete hace cascade completo (Supabase Auth + Prisma + Stripe customer + Storage).
4. Rate limiting Upstash Redis activo en `/api/auth/*`, `/api/trpc/*` y booking form — 429 retorna correctamente con `Retry-After` header.
5. tRPC v11 router type-safe responde en <200ms en p95 (sin DB fría).

### Notes
- Riesgo CP-01: usar `getUser()` en `proxy.ts` — `getSession()` provoca sesiones inconsistentes.
- Riesgo CP-04: layouts con datos de usuario deben tener `export const dynamic = 'force-dynamic'`.
- Riesgo COMP-01: sanción AEPD por cookies decorativas (3k-50k€) — banner no decorativo.
- Riesgo COMP-02: borrado RGPD incompleto — script con cascade explícito a Stripe + Storage + n8n.
- **Sentry debe estar configurado ANTES del primer deploy de producción de esta app.**
- Legal: SLA 99.5% mencionado en términos — asegurar que está alineado con uptime real.

---

## Phase 7: StageKit MVP

**Goal:** Producto StageKit completo: onboarding artista → EPK builder → perfil público → booking pipeline → analytics básico → landing → Stripe integrado.
**Requirements:** SK-01, SK-02, SK-03, SK-04, SK-05, SK-06, SK-07, SK-08, SK-09, SK-10
**UI hint:** yes

### Success Criteria
1. Artista completa onboarding 3 pasos (info → géneros → primer Kit Profile) en < 5 minutos y su perfil público `stagekit.app/[slug]` es accesible con ISR (revalidate: 3600).
2. Formulario de booking en perfil público recibe y registra una inquiry con estado "New"; honeypot anti-spam activo (sin CAPTCHA); notificación email llega al artista en < 60 segundos.
3. Dashboard de artista muestra booking requests con estados (New → Reviewing → Confirmed → Declined) y analytics de profile views (30d Free / 12m Pro).
4. Stripe checkout Pro completa y actualiza `Subscription`; feature gates bloquean correctamente en Free (límite booking requests); layouts de usuario tienen `force-dynamic`.
5. Landing `stagekit.app` carga con LCP < 2.0s y convierte visitas a registros (campo de waitlist/signup visible sin scroll).

### Notes
- North Star Metric: booking requests recibidos/semana — este es el KPI primario de todo el proyecto.
- Riesgo CP-04: `force-dynamic` en SK-10 es crítico para evitar plan "Free" servido post-upgrade.
- ISR en perfiles públicos garantiza LCP < 1.5s desde CDN — primera carga.
- Diferenciador competitivo: booking pipeline con estados (New→Confirmed→Declined) — ningún competidor lo tiene.
- Un usuario beta en StageKit en semana 8 vale más que un Design System perfecto en semana 10.

---

## Phase 8: Automatizaciones n8n

**Goal:** n8n en VPS con PostgreSQL operativo y todos los workflows CRM/email del ciclo de vida del artista funcionando: onboarding, engagement, conversión, dunning y churn.
**Requirements:** N8N-01, N8N-02, N8N-03, N8N-04, N8N-05, N8N-06, N8N-07
**UI hint:** no

### Success Criteria
1. n8n configurado con `DB_TYPE=postgresdb` y `EXECUTIONS_DATA_PRUNE=true`; `n8n.alexendros.me/healthz` responde 200 (monitoreado por Better Uptime).
2. Welcome sequence W-01 (4 emails) se dispara al crear cuenta; W-02 tracker actualiza estado en DB; W-03 setup fee se cobra correctamente via Stripe.
3. Dunning completo W-11..W-17: 3 reintentos de cobro con delay correcto → suspensión → retención 90 días → eliminación RGPD con cascade — verificado en staging con Stripe test mode.
4. Churn flow W-18..W-20 se dispara al cancelar suscripción; encuesta de salida registra respuesta en DB; email post-baja no se envía si usuario reactiva dentro de 24h.

### Notes
- Riesgo CP-05 (alto): n8n con SQLite en producción causa OOM — PostgreSQL obligatorio desde el primer commit de VPS.
- Validar conexión n8n → Supabase Postgres antes de crear workflows (credenciales de DB separadas de la app).
- Dunning W-11..W-17 debe alinearse con tiempos de retry de Stripe (1d, 3d, 7d por defecto).
- W-23 booking→CRM, W-27 factura y W-28 affiliate payout son operativos críticos de revenue.

---

## Phase 9: Hardening y Deploy

**Goal:** Tests con 60%+ coverage, seguridad hardening completo, Sentry/PostHog/Better Uptime activos y los 3 dominios en producción con Stripe en modo Live.
**Requirements:** HARD-01, HARD-02, HARD-03, HARD-04, HARD-05, DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04, DEPLOY-05
**UI hint:** no

### Success Criteria
1. `pnpm turbo test` pasa con coverage ≥ 60% en `lib/` y `api/`; al menos 1 test Playwright E2E por flujo crítico (signup, booking submission, checkout Pro).
2. `gitleaks` scan limpio (0 secrets detectados); `npm audit` sin vulnerabilidades High/Critical; headers HTTP (CSP, HSTS, X-Frame-Options) validados con `securityheaders.com`.
3. Sentry captura errores en las 3 apps con emails/IDs anonimizados; Better Uptime monitorea alexendros.me, alexendros.pro, stagekit.app y n8n.alexendros.me/healthz con alertas configuradas.
4. GitHub Actions ejecuta lint + typecheck + test en cada PR y bloquea merge si falla; Vercel despliega solo las apps afectadas por cambio (turbo-ignore activo).
5. Stripe en modo Live con webhooks registrados; 3 dominios con SSL activo; PostHog EU activo solo tras consentimiento en producción.

### Notes
- **Sentry debe configurarse ANTES del primer deploy de producción** (no post-lanzamiento) — riesgo HARD-01.
- Lighthouse Performance ≥ 90 y Accessibility ≥ 90 son targets de compliance, no opcionales.
- Verificar `STRIPE_LIVE_MODE` vs test mode antes de activar webhooks en producción.
- Región Vercel: `mad1` para todas las apps; Supabase: `eu-west-1` (Frankfurt) — datos en Europa (RGPD).
- PostHog: `https://eu.posthog.com` — no el endpoint US.

---

## Dependency Graph

```
Phase 1 (Scaffold) → Phase 2 (Design System) → Phase 3 (alexendros.me)
Phase 1 → Phase 4 (DB) → Phase 5 (Pagos/Email) → Phase 6 (Hub .pro) → Phase 7 (StageKit)
Phase 7 → Phase 8 (n8n) → Phase 9 (Hardening/Deploy)
```

**Paralelización posible** (parallelization: true):
- Phase 2 y Phase 4 pueden avanzar en paralelo tras Phase 1.
- Phase 8 (n8n) puede iniciarse antes de que Phase 7 esté 100% completa (workflows de onboarding pueden testarse con datos de Phase 6).
- HARD-01 (Sentry) debe completarse antes del primer deploy de producción de Phase 6.

---

*Roadmap created: 2026-04-06*
*Based on: 72 v1 requirements, research synthesis (SUMMARY.md), Next.js 16.2*
