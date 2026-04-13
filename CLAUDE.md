# CLAUDE.md — alexendros-pro (monorepo)

> Punto de entrada obligatorio para Claude Code. Léelo íntegro antes de ejecutar cualquier tarea.
>
> **Historia**: este repositorio se conocía como `alexendros-monorepo` y contenía `apps/alexendros-me`.
> El 11 de abril de 2026 se extrajo `alexendros-me` a un repo standalone (`~/Apps/alexendrosme-website/`)
> y el monorepo pasó a llamarse **`alexendrospro-website`** (directorio y remote GitHub).

---

## 0. REFERENCIA AL HUB CENTRAL (SIMBIOSIS)

> **Contexto global**: antes de operar, consulta `~/.claude/PROYECTOS.md` para
> conocer el estado, prioridad y urgencia del resto de apps de Alexendros.
> Este indice se actualiza via la cadena: `mem-sintetizar → dev-arquitectura →
> prod-actualizar-stakeholders → mem-actualizar` (nodo N13 de `omni-maestria`).
>
> **Alertas cruzadas**: `~/.claude/projects/-var-home-soyalexendros/memory/cross-app-alerts.md`
> — consulta obligatoria antes de deploys, rotaciones de secretos u operaciones destructivas.
>
> **Registro dinamico**: `~/.claude/projects/-var-home-soyalexendros/memory/apps-registry.md`
> — estado por app (commits, CI, PRs, alertas).
>
> **⚠️ HERENCIA GSD en este repo**: este monorepo tiene `.planning/` con estructura GSD
> completa (ROADMAP.md, phases/, STATE.md, PROJECT.md, research/) y directivas
> `<!-- GSD:* -->` en este mismo CLAUDE.md. **GSD esta descatalogado y fue desinstalado**.
> Para operar sobre el contenido de `.planning/` usa la cadena de skills aprobada:
>
> ```
> prod-brainstorming → prod-especificacion → app-maestria → dev-revision
> ```
>
> - **NO invocar** `gsd-quick`, `gsd-debug`, `gsd-execute-phase`, ni cualquier otro comando `gsd-*`.
> - **NO crear** nada nuevo bajo `.planning/` usando nomenclatura `gsd-*`.
> - **Se conserva** la estructura `.planning/` existente como historial.
> - Los bloques `<!-- GSD:project-start -->`, `<!-- GSD:stack-start -->`, `<!-- GSD:conventions-start -->`, `<!-- GSD:architecture-start -->`, `<!-- GSD:skills-start -->`, `<!-- GSD:profile-start -->` son contenido heredado; no regenerar.
> - **El bloque `<!-- GSD:workflow-start -->` mas abajo esta obsoleto y no debe seguirse** — usar la cadena de skills indicada arriba.
>
> Ver tabla completa de equivalencias en `~/.claude/Deportacion_GSD.md`.

---

## 1. PROYECTO

```yaml
name: alexendros-pro
type: multi-kit SaaS platform (monorepo)
owner: Alejandro Domingo Agustí
package_manager: pnpm@10+
repo: Turborepo monorepo (github.com/alexendros/alexendros-monorepo — pendiente rename a alexendros-pro)

apps:
  alexendros-pro:
    domain: alexendros.pro
    status: PLANNED
    notes: Hub central. Auth, dashboard, tRPC, pagos. Fase 6 del roadmap.
  stagekit:
    domain: stagekit.app
    status: MVP_ACTIVE
    theme_token: dark-acid
  lexkit:
    domain: lexkit.pro
    status: ROADMAP_Q3_2026
    theme_token: legal-navy
  gestkit:
    domain: gestkit.pro
    status: ROADMAP_Q4_2026
    theme_token: gestoria-slate

packages:
  brand:   design tokens + logos SVG (fuente de verdad visual)
  ui:      componentes React compartidos (shadcn/ui base)
  db:      Prisma schema + Supabase client factory
  stripe:  lógica de pagos compartida
  email:   React Email templates compartidas
  config:  tsconfig, eslint, tailwind base
```

---

## 2. STACK GLOBAL

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 App Router · TypeScript strict |
| UI | Tailwind CSS v4 · shadcn/ui · Radix UI |
| DB / Auth | Supabase + Prisma 5 (RLS obligatorio) |
| Pagos | Stripe Subscriptions + Connect Express |
| Email | Resend + React Email |
| Deploy | Vercel (región mad1 por app) |
| Automatización | n8n en Hostinger VPS |
| Monitoreo | PostHog · Sentry · Vercel Speed Insights |
| Testing | Vitest (unit) · Playwright (E2E) |

---

## 3. REGLAS ABSOLUTAS

### Código
- TypeScript `strict: true`. **Prohibido `any`.**
- Server Components por defecto. `"use client"` solo para interactividad browser.
- Rutas API en `/app/api/`. Edge Runtime si no requiere Node.js-only APIs.
- **Nunca secretos en código.** `.env.local` + validación Zod en `lib/env.ts`.
- Commits: nunca a `main` directo. Feature branch + PR siempre.
- Rate limiting obligatorio en `/api/auth/*` y `/api/trpc/*` (Upstash Redis). Ver `docs/01-stack-arquitectura.md`.

### Base de datos
- **RLS habilitado en TODAS las tablas Supabase.** Sin excepción.
- Mutaciones de DB exclusivamente via Prisma.
- Migraciones: `prisma migrate dev`. No editar schema en Supabase Studio sin migration.

### Pagos
- Stripe gestiona 100% de la lógica de tarjetas. No almacenar datos de tarjeta.
- Webhooks verificados con `stripe.webhooks.constructEvent()` antes de procesar.
- 3DS2/SCA obligatorio para transacciones UE (Directiva PSD2 2015/2366/UE).

### Privacidad y legal
- Datos personales solo con base legal explícita (Art. 6 RGPD EU 2016/679).
- Logs: anonimizar emails e IDs de usuario antes de enviar a Sentry.
- Analytics: no activar PostHog hasta consentimiento explícito.
- LOPDGDD LO 3/2018 (BOE 06/12/2018) aplicable a todos los productos.

### Rendimiento (targets CWV obligatorios)
- LCP < 2.0s desktop · < 2.5s mobile
- INP < 200ms
- CLS < 0.1
- Lighthouse Performance Score > 90

---

## 4. FLUJO DE TRABAJO CON CLAUDE CODE

```
1. Recibir tarea → identificar app o package afectado
2. Leer CLAUDE.md del subdirectorio correspondiente (si existe)
3. Si hay agente relevante → cargar desde .claude/agents/
4. Si hay skill relevante → cargar desde .claude/skills/
5. Implementar siguiendo reglas sección 3
6. Verificar con comandos sección 5
7. Actualizar Notion via MCP si hay cambios de arquitectura
```

**Cuándo usar cada agente:**

| Agente | Activar cuando... |
|--------|-------------------|
| brand-auditor | Auditar o mejorar alexendros.me / marca |
| db-architect | Cambios en schema, migraciones, RLS |
| stripe-engineer | Pagos, planes, webhooks, afiliados |
| seo-geo-specialist | Metadata, JSON-LD, CWV, citabilidad AI |
| gdpr-compliance | Features con datos personales, cookies, legal |

**Cuándo usar cada skill:**

| Skill | Activar cuando... |
|-------|-------------------|
| create-kit | Añadir un nuevo Kit al monorepo |
| new-db-migration | Cualquier cambio en schema Prisma |
| add-stripe-plan | Nuevo plan o precio en cualquier Kit |
| deploy-vercel | Configurar deploy o dominio nuevo |
| gdpr-audit | Pre-deploy de feature con datos personales |
| brand-manual | Crear manual de identidad de marca profesional (logo, paleta, tipografía, aplicaciones) |

---

## 5. COMANDOS FRECUENTES

```bash
# Desarrollo
pnpm dev --filter=alexendros-me
pnpm dev --filter=stagekit

# Build
pnpm turbo build --filter=alexendros-me

# DB
pnpm --filter=@repo/db prisma migrate dev --name <descripcion>
pnpm --filter=@repo/db prisma studio

# Tests
pnpm turbo test
pnpm --filter=alexendros-me playwright test

# CWV
npx @unlighthouse/cli https://alexendros.me

# Stripe webhooks local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Lint + typecheck
pnpm turbo lint typecheck
```

---

## 6. ENV VARIABLES — esquema global

```bash
# Supabase (por app)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only NUNCA al cliente

# Prisma
DATABASE_URL=                       # pooler Supabase port 6543
DIRECT_URL=                         # directo port 5432 (migraciones)

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONNECT_CLIENT_ID=
STRIPE_PRICE_STAGEKIT_PRO_MONTHLY=  # price_xxx (crear en Stripe Dashboard)
STRIPE_PRICE_STAGEKIT_AGENCY_MONTHLY= # price_xxx (crear en Stripe Dashboard)

# Email
RESEND_API_KEY=

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# Notion MCP
NOTION_TOKEN=secret_xxx

# n8n (Hostinger VPS)
N8N_WEBHOOK_SECRET=
N8N_BASE_URL=https://n8n.alexendros.me

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Todas las variables se validan al arrancar con Zod en `lib/env.ts` (ver spec completa en `docs/00-claude-md.md` §6.5). Importar siempre desde `@repo/config/env`, nunca `process.env` directo.

---

## 7. LO QUE NO DEBES HACER

```
❌ Crear tablas Supabase sin migration Prisma
❌ Usar useEffect para fetching (usar Server Components)
❌ Instalar librerías UI alternativas a shadcn sin consultar
❌ Activar PostHog/analytics hasta consentimiento del usuario
❌ Commits directos a main
❌ Ignorar errores TypeScript con @ts-ignore o as any
❌ Hardcodear IDs de Stripe
❌ Hardcodear colores fuera de packages/brand/tokens.ts
❌ Crear componentes en apps/ que deberían estar en packages/ui/
❌ Procesar webhooks Stripe sin verificar firma
❌ Usar process.env directo (importar desde @repo/config/env)
❌ Exponer rutas API sin rate limiting (excepto webhooks Stripe)
```

---

## 8. FASE ACTUAL (Abril 2026)

### Completadas (dentro de este monorepo)
- **Phase 1 — Monorepo Scaffold:** Turborepo, TypeScript strict, Zod env validation, globalEnv
- **Phase 2 — Design System:** 31 tokens oklch, Geist fonts, Tailwind v4 CSS-first, 15 shadcn/ui components
- **Phase 3 — alexendros.me:** Completada. **Extraida a repositorio standalone `~/Apps/alexendros-me/` el 2026-04-11** (commit origen `a180d73`). Pendiente deploy Vercel + DNS en ese repo.

### En curso
- **Phase 4 — Base de Datos:** Planificada (2 plans). Pendiente credenciales Supabase en `.env.local`

### Proximas
- Phase 5 — Pagos y Email (Stripe + React Email)
- Phase 6 — Hub alexendros.pro (Auth, dashboard, tRPC) — app `apps/alexendros-pro/`
- Phase 7 — StageKit MVP — app `apps/kitos/stagekit/`

---

## 9. DOCUMENTACIÓN DETALLADA

Toda la documentación técnica, de producto y de compliance está en `docs/`.
Consultar `docs/00-hub-index.md` como índice central.
Los agentes y skills están documentados en detalle en `docs/11-agents-skills.md`.

<!-- GSD:project-start source:PROJECT.md -->
## Project

**ALEXENDROS × KitOS**

Plataforma SaaS multi-producto de kits digitales temáticos para profesionales, construida como Turborepo monorepo. Cada Kit es un producto verticalizado (artistas electrónicos, abogados, gestores) con presentación propia pero arquitectura compartida. El cliente contrata producto + mantenimiento + incidencias + actualizaciones bajo modelo de suscripción. Desarrollado por Alejandro Domingo Agustí (Alexendros) como marca personal enterprise.

**Core Value:** Los profesionales reciben una presencia digital profesional inmediata (Kit Profile publicado en < 5 minutos) que genera oportunidades de negocio medibles (bookings, consultas, leads) — sin necesidad de conocimientos técnicos, con soporte y cumplimiento legal incluidos.

### Constraints

- **Stack**: Next.js 15 + Supabase + Stripe + Vercel — ya decidido, no negociable
- **Legal**: RGPD/LOPDGDD compliance obligatorio antes de deploy público (Art. 6, 13, 30)
- **Pagos**: PCI DSS SAQ-A + PSD2/SCA — Stripe gestiona 100% tarjetas
- **Performance**: LCP < 2.0s desktop, < 2.5s mobile, Lighthouse > 90
- **Seguridad**: RLS en TODAS las tablas, TypeScript strict, 0 `any`, rate limiting en APIs
- **Presupuesto**: Solo developer (1 persona), minimizar costes de infraestructura (free tiers)
- **Timeline**: ~14 semanas desde FASE 0 hasta deploy producción
- **Región**: Vercel mad1, Supabase eu-west-1 (Frankfurt), PostHog EU — datos en Europa
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack (2025/2026)
### Framework — Next.js 16.x
- **Turbopack es ahora el bundler por defecto** — reemplaza Webpack. 2–5x builds más rápidos, hasta 10x Fast Refresh. Sin configuración requerida.
- **`proxy.ts` reemplaza `middleware.ts`** — renombrar el archivo y la función exportada. La lógica es idéntica. `middleware.ts` sigue funcionando para Edge runtime pero está descatalogado.
- **Params y cookies async son obligatorios** — `await params`, `await cookies()`, `await headers()`. En v15 eran warnings; en v16 son errores en build.
- **Node.js 20.9+ requerido** — Node 18 ya no está soportado. Actualizar VPS y Vercel runtime.
- **`cacheComponents: true`** — nuevo modelo de caché explícito con directiva `"use cache"`. PPR evoluciona hacia este modelo. No activo por defecto, opt-in.
- **React 19.2** incluido — View Transitions, `useEffectEvent`, `Activity` component.
- **`revalidateTag()` requiere segundo argumento** — `revalidateTag('tag', 'max')`. El form de un argumento está descatalogado.
- **`after()` estable** — útil para logs y analytics post-respuesta sin bloquear al usuario.
### Auth — Supabase Auth SSR via `@supabase/ssr`
- `createServerClient()` → Server Components, Route Handlers, Server Actions
- `createBrowserClient()` → Client Components
- Cookie-based session management compatible con SSR/Edge
### ORM — Prisma 5.x (mantener)
| Criterio | Prisma 5 | Drizzle ORM |
|----------|----------|-------------|
| Type safety | Excelente (generado) | Excelente (manual) |
| Migrations | `prisma migrate` maduro | `drizzle-kit` funcional |
| Schema | Declarativo (`schema.prisma`) | TypeScript puro |
| Edge runtime | Limitado (driver adapters) | Nativo |
| Bundle size | ~15-20kb query engine | ~3kb |
| Supabase integration | Oficial + bien documentado | Soportado |
| RLS awareness | No (Prisma ignora RLS) | No (igual) |
| Curva de aprendizaje | Baja | Media |
| Comunidad/docs | Muy madura | Creciendo rápido |
- El schema declarativo es más legible para 11 modelos complejos con relaciones.
- `prisma migrate` es más robusto para producción que las herramientas equivalentes de Drizzle.
- La integración con Supabase usando `DATABASE_URL` (pooler) + `DIRECT_URL` (directo) está bien documentada y funcional.
- El equipo (una persona) tiene menor overhead cognitivo con Prisma.
### API Layer — tRPC v11
- **`initTRPC` API refactorizada** — nueva forma de crear routers con mejor inferencia de tipos.
- **Server-side callers** — `createCallerFactory` para llamar procedures desde Server Components sin HTTP.
- **React Query v5 integración** — `@tanstack/react-query@5` como peer dependency (breaking desde v5 de React Query).
- **Streaming support** — soporte para Server-Sent Events y streaming de responses.
- **Eliminado:** `createNextApiHandler` (Pages Router) reemplazado por `fetchRequestHandler` para App Router.
### Styling — Tailwind CSS v4.1
### UI Components — shadcn/ui
- `Chart` — wrapper de Recharts con theming automático via CSS vars. Ideal para dashboard de analytics (EPK views, booking requests).
- `Sidebar` — componente completo de sidebar con estado persistente, colapsable, keyboard navigation.
- `Breadcrumb` — navegación de migas de pan.
- `Collapsible`, `Resizable` — paneles redimensionables para layouts de dashboard.
- `Drawer` — sheet/drawer para mobile.
### Pagos — Stripe Connect Express
| Tipo | Onboarding | Control | Caso de uso |
|------|-----------|---------|-------------|
| Standard | Gestionado por Stripe | Bajo | Marketplaces donde el vendedor gestiona su cuenta |
| Express | Stripe-hosted flow simplificado | Medio | **Afiliados/partners** — caso KitOS |
| Custom | Fully custom | Alto | Plataformas con UX totalmente custom |
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`
- `transfer.created` (afiliados)
### Email — React Email + Resend
- **Postmark:** Excelente deliverability transaccional, sin templates React nativas. Migración posible si Resend falla en deliverability.
- **Loops:** Orientado a secuencias de marketing/SaaS onboarding. Puede complementar (no reemplazar) Resend para las secuencias n8n.
- **Brevo (ex-Sendinblue):** Alternativa EU-compliant más barata en escala, pero DX inferior.
### Automatización — n8n self-hosted
- RAM: 1GB mínimo, 2GB recomendado (n8n Node.js process + workflows en ejecución)
- CPU: 1 vCPU suficiente para workflows low-volume (<100 ejecuciones/día)
- Storage: 10GB+ para logs y datos de ejecución
- Docker + Docker Compose (instalación recomendada)
- Los 20+ workflows de la Fase 7.5 ejecutarán principalmente en respuesta a webhooks Stripe. El volumen estimado (< 500 clientes en MVP) es completamente manejable.
- El riesgo principal es **memory leaks** en workflows complejos con loops. Monitorear con Better Uptime `/healthz` cada 5 minutos.
- **Colas de trabajo:** Para las secuencias de dunning (W-11..W-17) con reintentos, usar Queue mode con Redis si el volumen escala. Para MVP, el modo por defecto es suficiente.
- Self-hosted: coste fijo (~$12/mes VPS ya existente), control total, sin limitaciones de workflows.
- Cloud: $24/mes starter, límite de ejecuciones. No justificado para MVP.
### Monorepo — Turborepo
| Criterio | Turborepo | Nx |
|----------|-----------|-----|
| Setup inicial | Muy sencillo | Complejo, opinionado |
| Integración Vercel | Nativa (Remote Cache) | Manual |
| Curva de aprendizaje | Baja | Alta |
| Generadores de código | Básicos | Muy avanzados |
| Build caching | Remote Cache en Vercel gratis | Nx Cloud (pago) |
| Para 1 dev | Excelente | Overhead innecesario |
| Para equipos | Adecuado | Superior |
## Validation of Current Choices
### Next.js 15 → Actualizar a Next.js 16
- El proyecto aún no tiene código, por lo que no hay deuda de migración. Iniciar directamente en Next.js 16.
- `middleware.ts` → renombrar a `proxy.ts` desde el inicio para evitar avisos de descatalogado.
- Node.js 20.9+ requerido — verificar que la configuración de Vercel y el VPS usen Node 20 LTS.
- `params` y `cookies()` async obligatorio — escribir código async desde el inicio.
- `revalidateTag()` con segundo argumento obligatorio.
### Supabase Auth SSR
### Prisma 5
### tRPC v11
### Tailwind CSS v4
### shadcn/ui
### Stripe Connect Express
### React Email + Resend
### n8n self-hosted
### Turborepo
## What NOT to Use
### Drizzle ORM (en lugar de Prisma)
### NextAuth v5 / Auth.js (en lugar de Supabase Auth)
### Pages Router de Next.js
### GraphQL / Apollo (en lugar de tRPC)
### Nx (en lugar de Turborepo)
### Webpack (desde Next.js 16)
### Neon Database (en lugar de Supabase)
### PlanetScale (en lugar de Supabase)
### Clerk (en lugar de Supabase Auth)
### Tailwind CSS v3 (usar v4)
### React Hook Form + Zod (mantener)
## Version Matrix
| Librería | Versión en CLAUDE.md | Latest Stable | Notas |
|---------|---------------------|---------------|-------|
| Next.js | 15.x | **16.2** (mar 2026) | ACTUALIZAR — usar 16 desde inicio |
| React | 19 | 19.2 | Incluido con Next.js 16 |
| TypeScript | 5.x | 5.x | Mínimo 5.1 requerido por Next.js 16 |
| Tailwind CSS | 4.x | **4.1** (abr 2025) | Usar 4.1 — tiene text-shadow y mask utils |
| shadcn/ui | latest | latest (CLI) | No tiene versión semántica propia |
| Radix UI | latest | latest | Instalado via shadcn CLI |
| Supabase SSR | latest | latest | Usar `@supabase/ssr`, NO `auth-helpers` |
| Supabase JS | latest | latest | `@supabase/supabase-js` |
| Prisma | 5.x | 5.x (6.x existe) | Mantener 5 para MVP; evaluar 6 post-MVP |
| tRPC server | v11 | v11 | Estable — usar `fetchRequestHandler` |
| tRPC client | v11 | v11 | + `@tanstack/react-query@5` |
| Stripe Node | latest | latest | `stripe@latest` |
| React Email | latest | latest | |
| Resend | latest | latest | |
| Turborepo | latest | 2.x | |
| pnpm | 9.x | 9.x | Compatible con Turborepo 2 |
| Node.js | 22.x | 22 LTS | OK — Next.js 16 requiere 20.9+ |
| Zustand | 4.x | 5.x | Verificar compatibilidad React 19 |
| Framer Motion | 12 | 12 | Renombrado a `motion` — `import { motion } from 'motion/react'` |
| React Hook Form | latest | 7.x | Compatible con React 19 |
| Zod | 3.x | 3.x | Compatible |
| Vitest | latest | 2.x | |
| Playwright | latest | 1.4x | |
| Upstash Ratelimit | latest | latest | |
| Sentry Next.js | latest | `@sentry/nextjs` | Usar `instrumentation.ts` hook estable de Next.js 16 |
| PostHog | latest | latest | Mantener EU endpoint |
## Critical Actions Before Starting FASE 0
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start DESCATALOGADO 2026-04-10 -->
## ~~GSD Workflow Enforcement~~ · DESCATALOGADO

> ⚠️ **Esta seccion esta obsoleta.** GSD fue desinstalado. Los comandos `/gsd-quick`,
> `/gsd-debug`, `/gsd-execute-phase` y cualquier otro `gsd-*` **ya no existen y no deben invocarse**.
>
> **Cadena de skills equivalente** (operar sobre `.planning/` de este repo):
>
> ```
> prod-brainstorming → prod-especificacion → app-maestria → dev-revision
> ```
>
> Ver `~/.claude/Deportacion_GSD.md` para la tabla completa de equivalencias
> (nuevo proyecto, scan, debug, review, deploy, etc.).
>
> El bloque original se ha conservado como comentario historico abajo.

<!--
CONTENIDO HISTORICO (NO SEGUIR):

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
-->
<!-- GSD:workflow-end -->

<!-- GSD:profile-start DESCATALOGADO 2026-04-10 -->
## ~~Developer Profile~~ · DESCATALOGADO

> Esta seccion referenciaba `generate-claude-profile` (comando GSD descatalogado).
> Para contexto del usuario, leer `~/.claude/projects/-var-home-soyalexendros/memory/user_profile.md`.
<!-- GSD:profile-end -->

---

## 10. INTEGRACIONES CON OTRAS APPS DE ALEXENDROS

> ⚠️ Hipotesis preliminar — refinar con Alejandro (ver `~/.claude/projects/-var-home-soyalexendros/memory/feedback_relaciones_proyectos.md`).

- **alexendros-me** 🟢 **HERMANA** — landing standalone en `~/Apps/alexendros-me/` (extraida de este monorepo el 2026-04-11). Redirige a alexendros.pro para productos. No comparte codigo; tiene su propio shadcn inline. Cualquier cambio de branding validado primero alli antes de aplicarse aqui.
- **ai-act-ready** 🟡 **inferida** — misma arquitectura Next.js 15 + Supabase. Candidato a reutilizar `@repo/ui` y `@repo/config` si se publican desde este monorepo.
- **afiladocs-website** 🟡 **inferida** — misma familia de stack (Next.js + Prisma + Stripe + Supabase). Potencial consumidor de los packages `@repo/stripe` y `@repo/email` en el futuro.
- **techno-website** ⚫ — independiente, no forma parte del monorepo aunque comparte patrones de Stripe.
- **n8n-automations** 🟠 **potencial** — podria orquestar los workflows de dunning (W-11..W-17) mencionados en `.planning/research/`.

## 11. SKILLS RECOMENDADAS

`app-maestria` · `app-monorepo` · `app-arquitectura` · `app-migracion-bd` · `app-seguridad` · `app-despliegue` · `infra-stripe` · `dev-revision` · `dev-arquitectura` · `ux-sistema` · `shadcn` · `legal-cumplimiento`

---
