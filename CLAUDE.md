# CLAUDE.md — alexendros-monorepo

> Punto de entrada obligatorio para Claude Code. Leelo integro antes de ejecutar cualquier tarea.
> Este archivo se carga automaticamente en cada sesion.

---

## 1. PROYECTO

```yaml
name: alexendros-monorepo
type: personal-brand + multi-kit SaaS platform
owner: Alejandro Domingo Agusti
package_manager: pnpm@10+
repo: Turborepo monorepo

apps:
  alexendros-me:
    domain: alexendros.me
    status: PREFASE_ACTIVE
  alexendros-pro:
    domain: alexendros.pro
    status: PLANNED
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
  stripe:  logica de pagos compartida
  email:   React Email templates compartidas
  config:  tsconfig, eslint, tailwind base
```

---

## 2. STACK GLOBAL

| Capa | Tecnologia |
| --- | --- |
| Framework | Next.js 15 App Router · TypeScript strict |
| UI | Tailwind CSS v4 · shadcn/ui · Radix UI |
| DB / Auth | Supabase + Prisma 5 (RLS obligatorio) |
| Pagos | Stripe Subscriptions + Connect Express |
| Email | Resend + React Email |
| Deploy | Vercel (region mad1 por app) |
| Automatizacion | n8n en Hostinger VPS |
| Monitoreo | PostHog · Sentry · Vercel Speed Insights |
| Testing | Vitest (unit) · Playwright (E2E) |

---

## 3. REGLAS ABSOLUTAS

### Codigo

- TypeScript `strict: true`. **Prohibido `any`.**
- Server Components por defecto. `"use client"` solo para interactividad browser.
- Rutas API en `/app/api/`. Edge Runtime si no requiere Node.js-only APIs.
- **Nunca secretos en codigo.** `.env.local` + validacion Zod en `env.ts`.
- Commits: nunca a `main` directo. Feature branch + PR siempre.

### Base de datos

- **RLS habilitado en TODAS las tablas Supabase.** Sin excepcion.
- Mutaciones de DB exclusivamente via Prisma.
- Migraciones: `prisma migrate dev`. No editar schema en Supabase Studio sin migration.

### Pagos

- Stripe gestiona 100% de la logica de tarjetas. No almacenar datos de tarjeta.
- Webhooks verificados con `stripe.webhooks.constructEvent()` antes de procesar.
- 3DS2/SCA obligatorio para transacciones UE (Directiva PSD2 2015/2366/UE).

### Privacidad y legal

- Datos personales solo con base legal explicita (Art. 6 RGPD EU 2016/679).
- Logs: anonimizar emails e IDs de usuario antes de enviar a Sentry.
- Analytics: no activar PostHog hasta consentimiento explicito.
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
2. Leer CLAUDE.md del subdirectorio correspondiente
3. Si hay agente relevante → cargar desde .claude/agents/
4. Si hay skill relevante → cargar desde .claude/skills/
5. Implementar siguiendo reglas seccion 3
6. Verificar con comandos seccion 5
7. Actualizar Notion via MCP si hay cambios de arquitectura
```

**Cuando usar cada agente:**

| Agente | Activar cuando... |
| --- | --- |
| brand-auditor | Auditar o mejorar alexendros.me / marca |
| db-architect | Cambios en schema, migraciones, RLS |
| stripe-engineer | Pagos, planes, webhooks, afiliados |
| seo-geo-specialist | Metadata, JSON-LD, CWV, citabilidad AI |
| gdpr-compliance | Features con datos personales, cookies, legal |

**Cuando usar cada skill:**

| Skill | Activar cuando... |
| --- | --- |
| create-kit | Anadir un nuevo Kit al monorepo |
| new-db-migration | Cualquier cambio en schema Prisma |
| add-stripe-plan | Nuevo plan o precio en cualquier Kit |
| deploy-vercel | Configurar deploy o dominio nuevo |
| gdpr-audit | Pre-deploy de feature con datos personales |

---

## 5. COMANDOS FRECUENTES

```bash
# Desarrollo
pnpm dev --filter=alexendros-me
pnpm dev --filter=stagekit

# Build
pnpm turbo build
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
```

---

## 7. LO QUE NO DEBES HACER

```
- Crear tablas Supabase sin migration Prisma
- Usar useEffect para fetching (usar Server Components)
- Instalar librerias UI alternativas a shadcn sin consultar
- Activar PostHog/analytics hasta consentimiento del usuario
- Commits directos a main
- Ignorar errores TypeScript con @ts-ignore o as any
- Hardcodear IDs de Stripe
- Hardcodear colores fuera de packages/brand/tokens.ts
- Crear componentes en apps/ que deberian estar en packages/ui/
- Procesar webhooks Stripe sin verificar firma
```

---

## 8. FASE ACTUAL: FASE 0 (Abril 2026)

Scaffolding del monorepo completado. Siguiente: FASE 1 (brand/config tokens).

---

## 9. SUB-CLAUDE.md POR DIRECTORIO

| Archivo | Contexto especifico que anade |
| --- | --- |
| apps/alexendros-me/CLAUDE.md | Reglas web personal, estatico, branding test |
| apps/alexendros-pro/CLAUDE.md | Reglas SaaS KitOS, arquitectura multi-kit |
| apps/stagekit/CLAUDE.md | MVP StageKit, artistas musica electronica |
| packages/brand/CLAUDE.md | Tokens, logos, paletas, reglas visuales |
| packages/ui/CLAUDE.md | Componentes shadcn, CVA, accesibilidad |
| packages/db/CLAUDE.md | Schema, RLS, convenciones Prisma/Supabase |
| packages/config/CLAUDE.md | TypeScript, ESLint, configs compartidas |
