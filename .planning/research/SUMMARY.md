# Research Summary: KitOS Platform

> Generado: 2026-04-06
> Síntesis de: STACK.md · FEATURES.md · ARCHITECTURE.md · PITFALLS.md

---

## Key Findings

### Stack

- **Actualizar a Next.js 16** (no 15): el proyecto empieza desde cero, usar `next@16.2` directamente. Cambios obligatorios: `proxy.ts` en lugar de `middleware.ts`, `await cookies()`/`await params()` y `revalidateTag(tag, 'max')` con segundo argumento.
- **`@supabase/ssr` es el único paquete correcto** para auth SSR. `@supabase/auth-helpers-nextjs` está deprecado. El factory `createServerClient` debe estar en `packages/db` y ser reutilizado por todas las apps.
- **Prisma 5 sobre Drizzle** para este MVP: schema declarativo más legible para 11 modelos complejos, migraciones más robustas, menor overhead cognitivo para un solo desarrollador. `DATABASE_URL` → pooler port 6543; `DIRECT_URL` → port 5432 solo para migraciones.
- **Framer Motion se importa desde `'motion/react'`** (renombrado en v12, no `'framer-motion'`). Zustand 5.x requiere verificación de compatibilidad con React 19 antes de instalar.
- **n8n requiere PostgreSQL desde el primer día** — no SQLite. Configurar `DB_TYPE=postgresdb` + `EXECUTIONS_DATA_PRUNE=true` antes de crear cualquier workflow de producción.

### Features

- **P0 crítico (sin esto no existe el producto):** Auth → Onboarding 3 pasos → EPK builder + public slug → Booking inquiry form (con anti-spam por honeypot + Upstash, sin CAPTCHA) → Booking inbox dashboard → Stripe Free/Pro con trial 14d sin tarjeta → 3 emails transaccionales (welcome, booking received, trial ending).
- **Diferenciadores reales sobre competencia:** Booking pipeline con estados (New→Confirmed→Declined) — ningún competidor lo tiene. North Star centrado en "booking requests recibidos", no vanity metrics. RGPD nativo con datos en EU (Frankfurt + mad1) — competidores US no cumplen.
- **Feature gate correcto:** Limitar por output (10 booking requests/mes en Free), no por input. Mostrar features Pro bloqueadas en la UI en lugar de ocultarlas — el upgrade debe ocurrir en el momento del éxito (cuando llegan las primeras peticiones de booking).
- **Anti-features para MVP:** No construir calendario de disponibilidad, pagos de depósito por booking, múltiples templates EPK, mensajería in-app, cuentas de promotores ni distribución musical. Cada uno de estos es una trampa de scope que duplica complejidad sin validar el valor core.
- **Ruta crítica MVP:** Auth → Artist Profile → EPK Builder → Public Page → Booking Form → Booking Dashboard → Stripe Free/Pro → Trial flow. Nada fuera de esta secuencia hasta tener usuarios activos.

### Architecture

- **Un único proyecto Supabase para todas las apps**: discriminador por `Kit.id` en el schema. Múltiples proyectos = complejidad innecesaria + imposibilidad de cross-Kit reports para afiliados. Migrar a proyecto-por-kit solo si un Kit supera 50k usuarios activos.
- **Stripe webhook único en `apps/alexendros-pro`**: `stagekit.app` NO tiene endpoint propio. Las actualizaciones de suscripción se reflejan en la DB compartida y stagekit las lee via Prisma. El handler debe responder `200` inmediatamente y procesar en background, con idempotency check por `event.id`.
- **tRPC per-app, no shared router en package**: los routers contienen lógica de negocio específica. Lo que sí va en `packages/db/src/types/` son los Zod schemas de input/output compartidos.
- **Edge Runtime solo para middleware + OG images**: Prisma no es compatible con Edge (experimental). Todos los Route Handlers con DB usan Node.js runtime explícito (`export const runtime = 'nodejs'`).
- **ISR para perfiles públicos** (`stagekit.app/[slug]`): `revalidate = 3600` + `generateStaticParams`. Primera carga desde CDN garantiza LCP < 1.5s. Layouts con datos de usuario deben tener `export const dynamic = 'force-dynamic'`.

### Pitfalls

- **CP-01 (rompe producción):** Supabase middleware usando `getSession()` en lugar de `getUser()` provoca sesiones inconsistentes cada hora. Usar `supabase.auth.getUser()` siempre en servidor. El middleware DEBE devolver `supabaseResponse` (no `NextResponse.next()` nuevo) para propagar cookies correctamente.
- **CP-02 (rompe revenue):** Webhooks Stripe sin idempotency check causan dobles suscripciones y dobles emails. Registrar `event.id` en `AuditLog` con unique constraint. Los eventos `checkout.session.completed` y `customer.subscription.updated` pueden llegar fuera de orden — handlers deben ser idempotentes.
- **CP-04 (invisible en dev):** Next.js 15/16 Full Route Cache puede servir el plan "Free" horas después de un upgrade Pro. Layouts con datos de usuario requieren `force-dynamic`. El webhook handler de Stripe debe llamar `revalidatePath('/dashboard')` tras actualizar suscripción.
- **COMP-01 (riesgo legal real):** PostHog no puede cargarse antes del consentimiento. La AEPD sanciona banners "decorativos" con multas de 3k-50k€. Inicializar PostHog solo dentro del callback `onAccept`. Botón "Rechazar todas" visualmente equivalente al de "Aceptar todo" (AEPD 2023).
- **SDR-01/SDR-03 (riesgo solo developer):** Scope creep silencioso + burnout por infraestructura antes de producto. Timeboxing estricto: `alexendros.me` en producción antes del día 30. Un usuario beta en StageKit en semana 8 vale más que un Design System perfecto en semana 10.

---

## Critical Changes from Original Plan

| Área | Plan original (CLAUDE.md / docs/) | Hallazgo de investigación |
|------|----------------------------------|--------------------------|
| **Framework** | Next.js 15 | Usar Next.js 16.2 desde el inicio — ya es stable, el proyecto empieza desde cero |
| **Middleware** | `middleware.ts` | Renombrar a `proxy.ts` en Next.js 16 — `middleware.ts` está deprecado |
| **Auth helper** | `@supabase/auth-helpers-nextjs` mencionado en docs antiguas | Deprecado — usar `@supabase/ssr` exclusivamente |
| **cookies()** | Sync en ejemplos de docs | Async obligatorio en Next.js 16: `await cookies()` |
| **Framer Motion** | `import { motion } from 'framer-motion'` | Renombrado en v12: `import { motion } from 'motion/react'` |
| **n8n storage** | No especificado | SQLite por defecto rompe en producción — PostgreSQL obligatorio desde el primer día |
| **Webhook events** | 5 eventos Stripe listados en docs | Añadir `account.updated` para KYC de afiliados Stripe Connect |
| **pgvector** | Incluido en schema inicial | Aplazar hasta post-MVP (>100 artistas). Añade complejidad sin valor en fase early |
| **Cross-domain SSO** | No contemplado | No implementar SSO entre `alexendros.pro` ↔ `stagekit.app` en MVP — cada app tiene login independiente al mismo Supabase project |
| **turbo.json env** | No detallado | Declarar todas las `NEXT_PUBLIC_*` vars en campo `env` de la tarea `build` — sin esto el cache de Turborepo es inválido entre entornos |

---

## Recommendations for Roadmap

**Fase 0 (Scaffolding) — añadir:**
- Crear `.nvmrc` con Node 20.9+ (requerimiento Next.js 16)
- Usar `proxy.ts` (no `middleware.ts`) desde el primer commit
- Configurar `turbo.json` con `globalEnv` y `env` por tarea para todas las `NEXT_PUBLIC_*` vars
- Validar que n8n VPS está configurado con PostgreSQL antes de FASE 7.5

**Fase 1/2 (packages) — añadir:**
- `packages/config/src/env.ts` con `@t3-oss/env-nextjs` + Zod — único punto de acceso a variables de entorno
- `packages/config/src/ratelimit.ts` con Upstash — listo para usar en booking form desde FASE 7
- Testear sistema de tokens en dark mode antes de construir componentes (evitar CM-07 con shadcn/ui + Tailwind v4)

**Fase 3 (alexendros.me) — restricción:**
- Hardcap: en producción antes del día 30. No perfeccionar — validar branding real.

**Fase 4 (DB) — añadir:**
- Documentar explícitamente qué operaciones usan `service_role` (Prisma) vs `anon_key` (cliente de usuario)
- Unique constraint en `AuditLog.stripeEventId` desde la migración inicial
- NO añadir pgvector al schema inicial — campo `@ignore` o comentario de fase futura

**Fase 5 (Stripe + Email) — añadir:**
- Añadir `account.updated` a los 5 webhook events del handler (KYC afiliados)
- Configurar SPF + DKIM + DMARC en DNS de `alexendros.me` antes del primer email de producción
- Verificar con `mail-tester.com` antes de activar secuencias de dunning

**Fase 6/7 (Apps) — añadir:**
- Sentry configurado ANTES del primer deploy de producción (no post-lanzamiento)
- Better Uptime monitoreando los 3 dominios + `n8n.example.com/healthz` desde semana 1
- Cookie banner con bloqueo real de PostHog (no decorativo) — prerequisito legal pre-deploy
- Ejecutar `pnpm turbo lint typecheck` al final de cada sesión de Claude Code

**Anti-features a defender activamente:**
- No calendario de disponibilidad hasta validar booking form con usuarios reales
- No cuentas de promotores hasta 500+ artistas activos
- No SSO cross-domain en MVP

---

## Risk Matrix

| Risk | Probability | Impact | Mitigation | Phase |
|------|------------|--------|------------|-------|
| Sesiones inconsistentes Supabase (CP-01) | High | High | `getUser()` en middleware, devolver `supabaseResponse`, `@supabase/ssr` | FASE 4 |
| Webhooks Stripe duplicados (CP-02) | Med | High | Idempotency por `event.id` en AuditLog, handlers idempotentes | FASE 5 |
| Service role key expuesta al cliente (CP-03) | Low | Critical | Zod validation en `env.ts`, audit grep en CI, nunca `NEXT_PUBLIC_` prefix | FASE 4 |
| Next.js cache stale post-upgrade (CP-04) | High | Med | `force-dynamic` en layouts de usuario, `revalidatePath` en webhook handler | FASE 6 |
| n8n OOM por SQLite (CP-05) | High | Med | PostgreSQL para n8n desde configuración inicial del VPS | FASE 7.5 |
| KYC afiliados bloqueado (CP-06) | Med | Med | Verificar `payouts_enabled` antes de payout, escuchar `account.updated` | FASE 5 |
| Prisma connection pool agotado en Vercel (CM-02) | High | High | `DATABASE_URL` con pooler port 6543 + `connection_limit=1` | FASE 4 |
| Turborepo cache inválido entre entornos (CM-03) | Med | Med | Declarar todas `NEXT_PUBLIC_*` en `turbo.json env` | FASE 0 |
| Emails en spam, dunning falla silenciosamente (CM-06) | Med | High | SPF + DKIM + DMARC antes del primer email de producción | FASE 5 |
| shadcn/ui incompatible con Tailwind v4 (CM-07) | Med | Med | Verificar en inicio de FASE 2, testear dark mode antes de construir componentes | FASE 2 |
| Sanción AEPD por cookies (COMP-01) | Med | High | PostHog carga solo en callback `onAccept`, botón rechazar equivalente | FASE 6 pre-deploy |
| Datos incompletos en borrado RGPD (COMP-02) | Low | High | Script `deleteUserAccount` con cascade explícito a Stripe + Storage + n8n | FASE 6 |
| Scope creep silencioso (SDR-01) | High | Med | North Star metric, regla de las 2 semanas, backlog explícito en PROJECT.md | Continuo |
| Burnout infraestructura sin feedback (SDR-03) | Med | High | alexendros.me en producción antes de día 30, usuario beta StageKit en semana 8 | FASE 3 |
| Free tier limits en producción (SDR-04) | High | Low | Presupuestar $100-150/mes desde el primer usuario de pago | Post-lanzamiento |
