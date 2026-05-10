# ALEXENDROS × KitOS

## What This Is

Plataforma SaaS multi-producto de kits digitales temáticos para profesionales, construida como Turborepo monorepo. Cada Kit es un producto verticalizado (artistas electrónicos, abogados, gestores) con presentación propia pero arquitectura compartida. El cliente contrata producto + mantenimiento + incidencias + actualizaciones bajo modelo de suscripción. Desarrollado por Alejandro Domingo Agustí (Alexendros) como marca personal enterprise.

## Core Value

Los profesionales reciben una presencia digital profesional inmediata (Kit Profile publicado en < 5 minutos) que genera oportunidades de negocio medibles (bookings, consultas, leads) — sin necesidad de conocimientos técnicos, con soporte y cumplimiento legal incluidos.

## Requirements

### Validated

(None yet — ship to validate)

### Active

#### Infraestructura monorepo (FASE 0)
- [ ] **INFRA-01**: Turborepo monorepo funcional con `pnpm turbo build` exitoso
- [ ] **INFRA-02**: Estructura packages/ (config, brand, ui, db, stripe, email)
- [ ] **INFRA-03**: CLAUDE.md jerárquico + agents (5) + skills (6) + mcp.json
- [ ] **INFRA-04**: TypeScript strict + ESLint flat config + Prettier
- [ ] **INFRA-05**: Git strategy main → dev → feature/* con branch protection
- [ ] **INFRA-06**: env.ts con validación Zod de 22 variables

#### Sistema de diseño (FASES 1-2)
- [ ] **BRAND-01**: Tokens oklch en packages/brand (paleta por Kit: dark-acid, legal-navy, gestoria-slate)
- [ ] **BRAND-02**: Geist + Geist Mono via next/font
- [ ] **BRAND-03**: Tailwind v4 preset consumiendo tokens brand
- [ ] **UI-01**: shadcn/ui inicializado (new-york, zinc, CSS vars) con 15+ componentes
- [ ] **UI-02**: Exportable como @repo/ui para todas las apps

#### alexendros.me — Landing marca personal (FASE 3)
- [ ] **ME-01**: Landing estática Next.js 15 (output: export) con Hero, About, Projects, Uses, Contact
- [ ] **ME-02**: SEO: JSON-LD Person + WebSite, sitemap, robots, OG images, canonical
- [ ] **ME-03**: Legal: aviso-legal (LSSI-CE), privacidad (RGPD), cookies (AEPD)
- [ ] **ME-04**: CWV: LCP < 2.0s desktop, Lighthouse > 90
- [ ] **ME-05**: Deploy Vercel con alexendros.me + SSL

#### Base de datos (FASE 4)
- [ ] **DB-01**: Prisma schema 11 modelos (Kit, User, Plan, Subscription, ClientProfile, KitProfile, InboundRequest, Affiliate, AffiliatePayout, AuditLog, DigitalRegistration)
- [ ] **DB-02**: RLS completo en 11 tablas Supabase con @@map() correctos
- [ ] **DB-03**: Supabase client factory SSR (createServerClient / createBrowserClient)
- [ ] **DB-04**: Seed data: Kit entries + planes

#### Pagos y email (FASE 5)
- [ ] **PAY-01**: Stripe plans Free/Pro(29€)/Agency(199€) con checkout + setup fee
- [ ] **PAY-02**: Webhook handler para 5 eventos Stripe (checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed, transfer.created)
- [ ] **PAY-03**: Stripe Connect Express para afiliados (15% mensual, 12 meses)
- [ ] **PAY-04**: Trial 14 días sin tarjeta, auto-conversión a Free
- [ ] **EMAIL-01**: 6 templates React Email MVP (welcome, booking, upgrade, trial-ending, payment-failed, invoice)
- [ ] **EMAIL-02**: Resend client factory

#### alexendros.pro — Hub KitOS (FASE 6)
- [ ] **PRO-01**: Landing pública: catálogo Kits, pricing, waitlist segmentada
- [ ] **PRO-02**: Auth Supabase SSR (email + Google OAuth + onboarding)
- [ ] **PRO-03**: Dashboard usuario: Kit contratado, suscripción, billing portal, ARCO
- [ ] **PRO-04**: Legal completo + banner cookies granular (PostHog EU condicionado)
- [ ] **PRO-05**: tRPC v11 + rate limiting Upstash Redis
- [ ] **PRO-06**: Webhooks Stripe verificados

#### StageKit MVP (FASE 7)
- [ ] **SK-01**: Onboarding artista 3 pasos (info → géneros → primer Kit Profile)
- [ ] **SK-02**: Kit Profile builder con preview en tiempo real + slug público
- [ ] **SK-03**: Formulario de booking embebido en perfil público
- [ ] **SK-04**: Dashboard: EPK views + booking requests
- [ ] **SK-05**: Landing StageKit con UVP, demo interactivo, pricing
- [ ] **SK-06**: Stripe integration: billing, checkout Pro, feature gates

#### Automatizaciones n8n (FASE 7.5)
- [ ] **N8N-01**: Welcome sequence (W-01) + onboarding tracker (W-02) + setup fee (W-03)
- [ ] **N8N-02**: Weekly digest (W-04) + booking notification (W-05)
- [ ] **N8N-03**: Trial progress (W-08) + trial expired (W-09) + upgrade (W-10)
- [ ] **N8N-04**: Dunning completo (W-11..W-17): 3 reintentos + suspensión + eliminación RGPD
- [ ] **N8N-05**: Churn prevention (W-18..W-20): cancelación + encuesta + oferta
- [ ] **N8N-06**: Operativos: booking→CRM (W-23), factura (W-27), affiliate payout (W-28)

#### Hardening y deploy (FASES 8-9)
- [ ] **HARD-01**: Checklist pre-producción completo (Bloques B-I del doc/10)
- [ ] **HARD-02**: Tests: Vitest unit + Playwright E2E, coverage 60%+ en lib/ y api/
- [ ] **HARD-03**: Security: middleware auth, CSRF, headers HTTP, secrets scan, npm audit
- [ ] **DEPLOY-01**: 3 dominios activos (alexendros.me, alexendros.pro, stagekit.app) con SSL
- [ ] **DEPLOY-02**: CI/CD: GitHub Actions (lint+typecheck+test) + Vercel (turbo-ignore)
- [ ] **DEPLOY-03**: Monitoring: Sentry + PostHog EU + Better Uptime

### Out of Scope

- **Calendario de disponibilidad público** — Fase posterior, no bloquea MVP
- **Cobro de anticipos via Stripe** — Complejidad alta, J3 no es priority MVP
- **Plan Agency multi-artista** — Post-MVP, requiere arquitectura multi-tenant
- **API pública** — Post-MVP, primero validar producto
- **White-label EPKs** — Post-MVP, solo Agency
- **Integración Resident Advisor** — API no estable, post-validación
- **Tokenización digital** — Servicio bajo demanda, excluido MVP (facturado aparte)
- **Contratos Afiladocs** — Integración post-MVP (n8n + API Afiladocs)
- **LexKit (Q3 2026)** — Roadmap, no scope actual
- **GestKit (Q4 2026)** — Roadmap, no scope actual
- **Mobile app** — Web-first
- **Win-back workflows (W-21, W-22)** — Post-MVP
- **SEO check automático (W-24)** — Post-MVP
- **Milestone celebrations (W-06)** — Post-MVP

## Context

- **Owner**: Alejandro Domingo Agustí — fullstack developer con background jurídico, Madrid
- **Dominios registrados**: alexendros.me + alexendros.pro en Hostinger (pendiente migración DNS a Vercel)
- **stagekit.app**: pendiente registro
- **Repo**: alexendros-monorepo en GitHub — commit inicial + documentación (20 docs en docs/), sin código
- **Estado actual**: PRE-FASE (Abril 2026) — documentación completa y validada, 0% código
- **Flujo de branding**: validar identidad visual en alexendros.me (estático) → replicar a .pro y kits
- **n8n**: self-hosted en Hostinger VPS (n8n.example.com)
- **Compliance**: RGPD EU 2016/679 + LOPDGDD LO 3/2018 + PCI DSS SAQ-A + PSD2/SCA + LSSI-CE
- **Stack decidido**: Next.js 15, TypeScript strict, Tailwind v4, shadcn/ui, Supabase, Prisma 5, Stripe, Resend, Turborepo, pnpm 9.x, Node 22.x, Vercel (mad1)
- **Documentación existente**: 20 docs técnicos/negocio en docs/ — schema DB, pagos, compliance, marketing, CRM, templates, agents/skills, plan maestro, checklist pre-producción
- **North Star Metric**: Booking requests recibidos / semana (StageKit)

## Constraints

- **Stack**: Next.js 15 + Supabase + Stripe + Vercel — ya decidido, no negociable
- **Legal**: RGPD/LOPDGDD compliance obligatorio antes de deploy público (Art. 6, 13, 30)
- **Pagos**: PCI DSS SAQ-A + PSD2/SCA — Stripe gestiona 100% tarjetas
- **Performance**: LCP < 2.0s desktop, < 2.5s mobile, Lighthouse > 90
- **Seguridad**: RLS en TODAS las tablas, TypeScript strict, 0 `any`, rate limiting en APIs
- **Presupuesto**: Solo developer (1 persona), minimizar costes de infraestructura (free tiers)
- **Timeline**: ~14 semanas desde FASE 0 hasta deploy producción
- **Región**: Vercel mad1, Supabase eu-west-1 (Frankfurt), PostHog EU — datos en Europa

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Turborepo monorepo (no apps separadas) | Compartir brand, UI, DB, stripe entre 3+ apps | — Pending |
| alexendros.me estático primero | Validar branding sin complejidad backend | — Pending |
| Supabase Auth SSR (no NextAuth) | RLS nativo + Row Level Security + menos código | — Pending |
| tRPC v11 (no REST API) | Type-safety end-to-end, menos boilerplate | — Pending |
| Stripe Connect Express (no Standard) | Onboarding simplificado para afiliados | — Pending |
| n8n self-hosted (no cloud) | Control total + coste fijo (VPS existente) | — Pending |
| oklch color system | Perceptualmente uniforme, compatible con tema por Kit | — Pending |
| Tailwind v4 (no v3) | CSS-first config, mejor rendimiento, futuro-proof | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-06 after initialization*
