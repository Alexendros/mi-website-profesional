# Requirements: ALEXENDROS × KitOS

**Defined:** 2026-04-06
**Core Value:** Profesionales reciben presencia digital inmediata (Kit Profile < 5 min) que genera oportunidades de negocio medibles — sin conocimientos técnicos, con soporte y cumplimiento legal incluidos.

## v1 Requirements

### Infrastructure

- [ ] **INFRA-01**: Turborepo monorepo funcional con `pnpm turbo build` exitoso (apps/ + packages/)
- [ ] **INFRA-02**: packages/ creados: config, brand, ui, db, stripe, email
- [ ] **INFRA-03**: TypeScript strict en todo el monorepo, 0 `any`, ESLint flat config
- [ ] **INFRA-04**: env.ts con validación Zod de todas las variables de entorno
- [ ] **INFRA-05**: Git strategy: main → dev → feature/* con branch protection
- [ ] **INFRA-06**: turbo.json con `globalEnv` declarando todas las `NEXT_PUBLIC_*` vars
- [ ] **INFRA-07**: `.nvmrc` con Node 22.x LTS

### Brand & Design System

- [ ] **BRAND-01**: Tokens oklch en packages/brand (dark-acid, legal-navy, gestoria-slate)
- [ ] **BRAND-02**: Geist + Geist Mono via next/font con display: swap
- [ ] **BRAND-03**: Tailwind v4 preset consumiendo tokens de packages/brand
- [ ] **BRAND-04**: CSS custom properties con `[data-kit="x"]` para theming por Kit
- [ ] **UI-01**: shadcn/ui inicializado (new-york, zinc, CSS vars) con 15+ componentes
- [ ] **UI-02**: Exportable como @repo/ui, consumible por todas las apps
- [ ] **UI-03**: Dark mode verificado con contraste WCAG AA

### Landing alexendros.me

- [ ] **ME-01**: Next.js 16 con output: export (estático), conectado a packages/brand y packages/ui
- [ ] **ME-02**: Hero con posicionamiento claro (quién, qué, para quién) visible sin scroll
- [ ] **ME-03**: Páginas: About, Projects, Uses, Contact
- [ ] **ME-04**: Legal: /legal/aviso-legal (LSSI-CE), /legal/privacidad (RGPD), /legal/cookies (AEPD)
- [ ] **ME-05**: SEO: JSON-LD Person + WebSite, sitemap, robots, OG images, canonical
- [ ] **ME-06**: CWV: LCP < 2.0s desktop / < 2.5s mobile, Lighthouse > 90
- [ ] **ME-07**: Deploy Vercel con alexendros.me + SSL — en producción antes del día 30

### Database

- [ ] **DB-01**: Prisma schema con 11 modelos completos y relaciones
- [ ] **DB-02**: RLS policies en 11 tablas Supabase con @@map() correctos
- [ ] **DB-03**: Supabase client factory SSR usando `@supabase/ssr` (no auth-helpers)
- [ ] **DB-04**: Seed data: Kit entries + planes + usuario test
- [ ] **DB-05**: Unique constraint en AuditLog para `stripeEventId` (idempotency)
- [ ] **DB-06**: DATABASE_URL con pooler port 6543 + connection_limit=1 para Vercel

### Payments

- [ ] **PAY-01**: Stripe plans Free / Pro (29€) / Agency (199€) con checkout session
- [ ] **PAY-02**: Webhook handler para 6 eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed, transfer.created, account.updated
- [ ] **PAY-03**: Idempotency check por event.id en AuditLog antes de procesar
- [ ] **PAY-04**: Stripe Connect Express para afiliados (15% mensual, 12 meses)
- [ ] **PAY-05**: Trial 14 días sin tarjeta, auto-downgrade a Free
- [ ] **PAY-06**: Feature gates en middleware: Free vs Pro limits (epks, bookings/month)

### Email

- [ ] **EMAIL-01**: 6 templates React Email MVP: welcome, booking-received, upgrade, trial-ending, payment-failed, invoice
- [ ] **EMAIL-02**: Resend client factory en packages/email
- [ ] **EMAIL-03**: SPF + DKIM + DMARC configurados en DNS antes del primer email producción

### Authentication

- [ ] **AUTH-01**: Supabase Auth SSR con email + Google OAuth
- [ ] **AUTH-02**: proxy.ts (Next.js 16) con `getUser()` (no getSession), devolviendo supabaseResponse
- [ ] **AUTH-03**: Callback handler + reset password
- [ ] **AUTH-04**: Rutas /(dashboard)/* protegidas por middleware

### Hub alexendros.pro

- [ ] **PRO-01**: Landing pública: KitOS UVP, catálogo Kits, pricing, waitlist segmentada
- [ ] **PRO-02**: Onboarding post-auth: selección de Kit → perfil básico
- [ ] **PRO-03**: Dashboard: Kit contratado, estado suscripción, billing portal Stripe
- [ ] **PRO-04**: ARCO endpoints: /api/account/export + /api/account/delete con cascade completo
- [ ] **PRO-05**: Legal: aviso-legal, privacidad, cookies, términos — con SLA 99.5%
- [ ] **PRO-06**: Cookie banner con bloqueo real de PostHog hasta consentimiento (no decorativo)
- [ ] **PRO-07**: tRPC v11 router type-safe
- [ ] **PRO-08**: Rate limiting Upstash Redis en /api/auth/*, /api/trpc/*, booking form

### StageKit MVP

- [ ] **SK-01**: Onboarding artista 3 pasos: info (stage name, bio, foto) → géneros → primer Kit Profile
- [ ] **SK-02**: Kit Profile builder: info básica, media embeds (SoundCloud/Spotify/Mixcloud), social links, press photos
- [ ] **SK-03**: Preview en tiempo real + borrador vs publicar
- [ ] **SK-04**: URL pública stagekit.app/[slug] con ISR (revalidate: 3600)
- [ ] **SK-05**: Booking inquiry form en perfil público (con honeypot anti-spam, sin CAPTCHA)
- [ ] **SK-06**: Booking dashboard con estados: New → Reviewing → Confirmed → Declined
- [ ] **SK-07**: Analytics básico: profile views (30d Free / 12m Pro) + booking requests (North Star)
- [ ] **SK-08**: Landing StageKit: UVP, demo interactivo, pricing 3 planes
- [ ] **SK-09**: Stripe: billing page, checkout Pro, webhook, feature gates
- [ ] **SK-10**: layouts con datos de usuario: `force-dynamic` para evitar cache stale post-upgrade

### Automation (n8n)

- [ ] **N8N-01**: n8n con PostgreSQL (no SQLite) + EXECUTIONS_DATA_PRUNE=true
- [ ] **N8N-02**: Onboarding: W-01 welcome sequence (4 emails) + W-02 tracker + W-03 setup fee
- [ ] **N8N-03**: Engagement: W-04 weekly digest + W-05 booking notification
- [ ] **N8N-04**: Conversión: W-08 trial progress (3 emails) + W-09 trial expired + W-10 upgrade
- [ ] **N8N-05**: Dunning: W-11..W-17 (3 reintentos + suspensión + retención 90d + eliminación RGPD)
- [ ] **N8N-06**: Churn: W-18 cancelación + encuesta + W-19 último día + W-20 post-baja
- [ ] **N8N-07**: Operativos: W-23 booking→CRM, W-27 factura, W-28 affiliate payout

### Hardening

- [ ] **HARD-01**: Sentry configurado ANTES del primer deploy producción
- [ ] **HARD-02**: Better Uptime: 3 dominios + n8n.alexendros.me/healthz
- [ ] **HARD-03**: Security: headers HTTP, CSRF, secrets scan (gitleaks), npm audit clean
- [ ] **HARD-04**: Tests: Vitest unit + Playwright E2E, coverage 60%+ en lib/ y api/
- [ ] **HARD-05**: Lighthouse Performance ≥ 90, Accessibility ≥ 90

### Deploy

- [ ] **DEPLOY-01**: 3 dominios activos: alexendros.me, alexendros.pro, stagekit.app — SSL
- [ ] **DEPLOY-02**: GitHub Actions: lint + typecheck + test en cada PR
- [ ] **DEPLOY-03**: Vercel: proyecto por app, región mad1, turbo-ignore para deploys selectivos
- [ ] **DEPLOY-04**: Stripe en modo Live, webhooks registrados
- [ ] **DEPLOY-05**: Monitoring activo: Sentry + PostHog EU + Better Uptime + Vercel Speed Insights

## v2 Requirements

### Engagement Post-MVP

- **ENG-01**: Milestone celebrations (W-06): badges por hitos (10 bookings, 100 views, 1 año)
- **ENG-02**: Inactivity re-engagement (W-07): emails día 14, 30, 60
- **ENG-03**: Win-back sequences (W-21, W-22): 30d y 90d post-baja con ofertas
- **ENG-04**: SEO check automático en publicación de Kit Profile (W-24)

### StageKit Enhanced

- **SKE-01**: Rider técnico PDF generator (Pro)
- **SKE-02**: Custom domain para Kit Profile (Pro)
- **SKE-03**: Múltiples templates EPK
- **SKE-04**: Advanced analytics con PostHog funnels (Pro)

### Servicios Transversales

- **SVC-01**: Tokenización digital (SafeCreative/blockchain) — servicio bajo demanda
- **SVC-02**: Contratos automatizados via Afiladocs (n8n W-25, W-26)
- **SVC-03**: Brand Manual profesional (skill brand-manual)
- **SVC-04**: Dossier de presencia digital profesional

### Expansion

- **EXP-01**: LexKit (Q3 2026) — kit para abogados
- **EXP-02**: GestKit (Q4 2026) — kit para gestores/asesorías
- **EXP-03**: Plan Agency multi-artista (hasta 20)
- **EXP-04**: API pública

## Out of Scope

| Feature | Reason |
|---------|--------|
| Calendario de disponibilidad público | Complejidad alta (timezones, double-booking). Validar booking form primero |
| Cobro de anticipos via Stripe | Legal exposure, Stripe Connect complexity. Solo si usuarios Pro lo piden |
| Cuentas de promotores/venues | Marketplace doble-lado = 2x adquisición. Focus en supply (artistas) |
| Chat/mensajería in-app | Transforma en plataforma de comunicación. Email notificaciones suficiente |
| Distribución musical | Vertical diferente (Distrokid/TuneCore). Diluye el valor de bookings |
| Auto-posting redes sociales | Buffer/Later ya lo hacen. Distracción del foco booking |
| Mobile app nativa | Web-first + PWA. App nativa = segundo proyecto completo |
| White-label EPKs (Free/Pro) | Solo Agency — si Pro lo tiene, Agency pierde diferenciación |
| AI bio generator | OpenAI cost + latency + hallucination risk. Fase 3 enhancement |
| SSO cross-domain MVP | Cada app login independiente al mismo Supabase project |
| pgvector (búsqueda semántica) | Aplazar hasta >100 artistas. Complejidad sin valor early |
| Resident Advisor API | API no oficial, inestable. Solo cuando RA formalice acceso |
| Bulk email a promotores | CAN-SPAM/RGPD risk. Puede blacklistear dominio de envío |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01..07 | Phase 1 | Pending |
| BRAND-01..04, UI-01..03 | Phase 2 | Pending |
| ME-01..07 | Phase 3 | Pending |
| DB-01..06 | Phase 4 | Pending |
| PAY-01..06, EMAIL-01..03 | Phase 5 | Pending |
| AUTH-01..04, PRO-01..08 | Phase 6 | Pending |
| SK-01..10 | Phase 7 | Pending |
| N8N-01..07 | Phase 8 | Pending |
| HARD-01..05 | Phase 9 | Pending |
| DEPLOY-01..05 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 72 total
- Mapped to phases: 72
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-06*
*Last updated: 2026-04-06 after research synthesis*
