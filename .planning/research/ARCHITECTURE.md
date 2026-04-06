# Architecture Research: KitOS Monorepo

> Investigación basada en documentación del proyecto (`docs/`, `.planning/PROJECT.md`, `CLAUDE.md`)
> y conocimiento del ecosistema Turborepo/Next.js 15/Supabase a Abril 2026.

---

## Component Boundaries

### Mapa de responsabilidades: qué habla con qué

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER / CLIENTE                           │
│   Next.js RSC (Server Components) → hidrata Client Components       │
│   Zustand (estado UI local) · React Query (caché server state)      │
└──────────────────┬──────────────────────────────────────────────────┘
                   │ HTTP / fetch
┌──────────────────▼──────────────────────────────────────────────────┐
│              VERCEL EDGE MIDDLEWARE (común a todas las apps)         │
│   • Verificación JWT Supabase (auth check)                          │
│   • Redirect non-auth → /login                                      │
│   • Kit-routing: si el dominio es stagekit.app → aplicar tema Kit   │
│   • NO lógica de negocio — solo guardianes de ruta                  │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
         ┌─────────┴──────────┬─────────────────┐
         ▼                    ▼                  ▼
┌────────────────┐  ┌──────────────────┐  ┌────────────────┐
│ alexendros.me  │  │  alexendros.pro  │  │   stagekit.app │
│ output: export │  │  App Router full │  │ App Router full│
│ Sin backend    │  │  Hub KitOS       │  │ Kit artistas   │
│ Solo brand/ui  │  │  Auth+DB+Stripe  │  │ EPK + booking  │
└────────────────┘  └────────┬─────────┘  └───────┬────────┘
                             │                     │
                    ┌────────▼─────────────────────▼────────┐
                    │          SHARED PACKAGES (@repo/*)     │
                    │  brand · ui · db · stripe · email      │
                    │  config (tsconfig, eslint, tailwind)   │
                    └────────┬──────────────────────────────┘
                             │
              ┌──────────────┼────────────────┐
              ▼              ▼                ▼
      ┌──────────────┐ ┌──────────┐ ┌─────────────────┐
      │  Supabase    │ │  Stripe  │ │     Resend      │
      │  PostgreSQL  │ │  API     │ │  (email)        │
      │  Auth · RLS  │ │  Connect │ │                 │
      │  Storage     │ │  Webhooks│ └─────────────────┘
      └──────────────┘ └──────────┘
```

### Reglas de separación claras

| Package / App | Puede importar | No puede importar |
|---|---|---|
| `packages/brand` | nada externo | nada (source of truth) |
| `packages/config` | nada externo | nada |
| `packages/ui` | `brand`, `config` | `db`, `stripe`, `email` |
| `packages/db` | `config` | `ui`, `stripe`, `email` |
| `packages/stripe` | `config`, `db` | `ui`, `email` |
| `packages/email` | `brand`, `config` | `db`, `stripe`, `ui` |
| `apps/alexendros-me` | `brand`, `ui`, `config` | `db`, `stripe`, `email` |
| `apps/alexendros-pro` | todos | — |
| `apps/stagekit` | todos | — |

---

## Data Flow

### Flujo principal: usuario autenticado haciendo una acción

```
1. Browser → Next.js Route Handler / RSC
   - RSC hace fetch directo a DB via Prisma (no pasar por API si es Server Component)
   - Client Components usan tRPC para mutaciones y queries interactivas

2. tRPC router (apps/alexendros-pro/server/trpc/)
   - context() → extrae sesión Supabase del request (createServerClient)
   - middleware authed() → verifica user existe en DB via Prisma
   - procedure → lógica de negocio → Prisma → Supabase PG

3. Supabase PG
   - RLS filtra automáticamente por auth.uid()
   - Mutations via Prisma (service_role bypass RLS para writes del sistema)
   - Reads de RSC: usar service_role o anon_key según tabla

4. Respuesta → RSC re-render o tRPC response → React Query cache update
```

### Flujo Stripe webhook

```
Stripe → POST /api/webhooks/stripe (Node.js Runtime, no Edge)
  ↓
stripe.webhooks.constructEvent() — firma HMAC verificada
  ↓
switch(event.type):
  checkout.session.completed    → Prisma: crear/actualizar Subscription
  customer.subscription.updated → Prisma: actualizar status/plan
  customer.subscription.deleted → Prisma: status=CANCELED
  invoice.payment_failed        → Prisma: status=PAST_DUE
  transfer.created              → Prisma: AffiliatePayout status=PAID
  ↓
Resend: email transaccional al usuario
  ↓
n8n webhook: trigger secuencia de automatización (fire-and-forget)
```

### Flujo booking público (sin auth)

```
Visitante → stagekit.app/[slug] (RSC estático con ISR)
  ↓ KitProfile.isPublic = true → public RLS policy
  ↓
Form submit → POST /api/bookings (Route Handler)
  ↓
Prisma: INSERT inbound_requests (policy: public INSERT permitido)
  ↓
Resend: notificación al artista
  ↓
n8n: booking→CRM workflow (W-23)
```

### Flujo n8n (automatizaciones)

```
Trigger: Stripe webhook → /api/webhooks/stripe
  → al final del handler: fetch a n8n webhook (fire-and-forget, no await bloqueante)
  → n8n lee Supabase DB directamente via API para contexto adicional
  → n8n llama a Resend para secuencias de email
  → n8n actualiza estado en Supabase (via service_role key)
```

---

## Multi-App Strategy

### Patrón: Supabase single project — RECOMENDADO para este proyecto

**Decisión: UN solo proyecto Supabase sirve a todas las apps.**

Justificación:
- El schema tiene `Kit.id` como discriminador (`'stagekit'` | `'lexkit'` | `'gestkit'`). Un usuario pertenece a UN kit, y la DB ya tiene esa separación lógica vía `User.kitId`.
- RLS funciona por usuario autenticado — `auth.uid()` es el mismo JWT independientemente del dominio de entrada.
- Stripe Connect unificado: un solo merchant account gestiona todos los kits.
- Coste: free tier Supabase es por proyecto. Múltiples proyectos = múltiples facturas innecesarias.
- Complejidad: cross-Kit reports (afiliados que refieren a múltiples kits) son imposibles con proyectos separados.

**Cuándo migrar a proyecto-por-kit:** Solo cuando un Kit supere los 50k usuarios activos o tenga requisitos legales de aislamiento de datos (ej: LexKit con datos de clientes jurídicos muy sensibles).

### Auth compartido entre apps

```typescript
// packages/db/src/supabase/server.ts — factory compartido
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

**Problema del cross-domain auth (alexendros.pro ↔ stagekit.app):**

Las cookies de sesión Supabase son por dominio. Un usuario que hace login en `alexendros.pro` NO tiene sesión automática en `stagekit.app`.

Solución aplicada a este proyecto:
- `alexendros.pro` = portal de gestión y billing (login principal).
- `stagekit.app` tiene su PROPIO login Supabase (misma DB, mismos usuarios, pero sesión de cookie independiente).
- Los artistas gestionan su cuenta desde `stagekit.app`. El billing/upgrade puede redirigir a `alexendros.pro/billing` con un token de sesión temporal (magic link generado server-side) o simplemente requerir nuevo login.
- Para MVP: no implementar SSO cross-domain. Cada app tiene login propio que apunta al mismo Supabase project.

### Turborepo: estructura del monorepo en 2025

El patrón estándar de 2025 para Turborepo con múltiples Next.js apps:

```
alexendros-monorepo/
├── turbo.json                    # pipelines: build, dev, lint, typecheck, test
├── pnpm-workspace.yaml           # apps/* packages/*
├── package.json                  # scripts raíz, devDeps globales
├── .env.example                  # template de variables
│
├── apps/
│   ├── alexendros-me/            # Next.js 15, output: 'export', solo brand+ui
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts    # extiende @repo/config/tailwind
│   │   └── app/
│   ├── alexendros-pro/           # Next.js 15 full-stack, hub KitOS
│   │   ├── next.config.ts
│   │   ├── server/
│   │   │   └── trpc/             # routers tRPC (per-app, no compartido)
│   │   └── app/
│   └── stagekit/                 # Next.js 15 full-stack, Kit artistas
│       ├── next.config.ts
│       ├── server/
│       │   └── trpc/             # routers tRPC separados
│       └── app/
│
└── packages/
    ├── config/                   # tsconfig.base.json, eslint.config.mjs, tailwind.preset.ts
    ├── brand/                    # tokens.ts (oklch), fonts.ts, globals.css, logos SVG
    ├── ui/                       # shadcn/ui compartido, Radix, exportado como @repo/ui
    ├── db/                       # prisma/schema.prisma, client factory Supabase SSR/browser
    ├── stripe/                   # kit-plans.ts, checkout.ts, webhook-types.ts, affiliate.ts
    └── email/                    # React Email templates, Resend client factory
```

### turbo.json — configuración de pipelines

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] }
  }
}
```

Clave: `"dependsOn": ["^build"]` garantiza que los packages se compilan antes que las apps que los consumen.

### Kit-based theming: CSS custom properties — DECISIÓN CONFIRMADA

El sistema del proyecto ya define correctamente el patrón vía `data-kit` attribute:

```css
/* packages/brand/globals.css */
:root { --brand-primary: oklch(0.72 0.22 142); } /* default Alexendros */

[data-kit="stagekit"]  { --brand-primary: oklch(0.72 0.22 142); } /* dark-acid */
[data-kit="lexkit"]    { --brand-primary: oklch(0.45 0.12 250); } /* legal-navy */
[data-kit="gestkit"]   { --brand-primary: oklch(0.55 0.14 160); } /* gestoria-slate */
```

```tsx
// apps/stagekit/app/layout.tsx
<html lang="es" data-kit="stagekit" className="dark">
```

**Por qué CSS custom properties sobre Tailwind theme switching:**
- Tailwind v4 usa CSS-first config: los tokens son variables CSS nativamente.
- Un cambio de `data-kit` en el HTML raíz propaga automáticamente sin re-render React.
- Funciona en RSC (no necesita JavaScript para aplicar el tema).
- Los componentes de `@repo/ui` usan `var(--brand-primary)` y funcionan en cualquier Kit sin modificación.
- Alternativa (Tailwind `darkMode: 'class'` con clases por Kit) obliga a duplicar utilities → bundle más grande.

---

## Suggested Build Order

El orden óptimo respeta el grafo de dependencias del monorepo:

```
FASE 0: Scaffolding del repo
  → turbo.json, pnpm-workspace.yaml, .gitignore, .env.example
  → Git strategy: main → dev → feature/*
  → CLAUDE.md jerárquico

FASE 1: packages/config + packages/brand
  → config: tsconfig.base.json, eslint.config.mjs, tailwind.preset.ts, ratelimit.ts, env.ts
  → brand: tokens.ts (oklch), fonts.ts, globals.css
  → Sin estas bases, nada más puede compilar

FASE 2: packages/ui
  → Depende de: config, brand
  → shadcn/ui init, 15+ componentes, export como @repo/ui
  → Bloquea: todas las apps con UI

FASE 3: apps/alexendros-me (estática)
  → Depende de: config, brand, ui (NO db, stripe, email)
  → output: 'export', deploy a Vercel
  → Objetivo: validar branding en producción antes de continuar
  → Bloquea: decisiones de UI aplicables a .pro y stagekit

FASE 4: packages/db
  → Depende de: config
  → Prisma schema completo, RLS en Supabase, client factory SSR/browser
  → seed data: Kit entries + planes
  → Bloquea: FASES 5, 6, 7

FASE 5: packages/stripe + packages/email
  → stripe depende de: config, db (tipos de Subscription/Plan)
  → email depende de: config, brand (templates usan tokens)
  → Webhook handler types/helpers (la implementación real va en cada app)
  → Bloquea: FASES 6, 7

FASE 6: apps/alexendros-pro (Hub KitOS)
  → Depende de: todas las packages
  → Auth, dashboard, billing, legal, tRPC, rate limiting
  → Bloquea: FASE 7 (StageKit referencia .pro para billing/upgrade)

FASE 7: apps/stagekit
  → Depende de: todas las packages + patrones establecidos en FASE 6
  → EPK builder, booking, Stripe Pro checkout

FASE 7.5: n8n workflows
  → No depende de código del monorepo, usa webhooks ya creados
  → Configurar en n8n UI (VPS Hostinger)

FASES 8-9: Hardening + Deploy prod
  → Depende de: todo lo anterior completo y testeado
```

**Regla de oro:** Nunca empezar una Fase sin que la anterior esté en estado `build: passing` + `typecheck: passing`.

---

## Architecture Decisions

### AD-01: tRPC per-app, no shared router en package

**Pregunta:** ¿Centralizar el router tRPC en `packages/` o mantener routers por app?

**Decisión: Routers tRPC por app (`apps/alexendros-pro/server/trpc/` y `apps/stagekit/server/trpc/`).**

Justificación:
- Los routers tRPC contienen lógica de negocio específica de cada app, no lógica compartible.
- Lo que SÍ se comparte son los tipos de Input/Output via Zod schemas (pueden vivir en `packages/db/src/types/`).
- Un shared router en package obligaría a cargar todos los procedimientos de todas las apps en cualquier app que lo importe — bundling innecesario.
- tRPC v11 soporta `createCallerFactory` para llamar procedimientos server-side sin HTTP — útil en RSC sin pasar por la red.

**Lo que sí va en packages/:**
```typescript
// packages/db/src/types/trpc-inputs.ts
export const CreateProfileSchema = z.object({ ... }) // compartido entre apps
export const BookingRequestSchema = z.object({ ... })
```

**Trade-off:** Duplicación mínima de boilerplate tRPC entre apps. Aceptable dado que son productos distintos.

---

### AD-02: Edge Runtime vs Node.js Runtime

**Decisión: Edge Runtime solo para middleware + auth checks. Node.js para todo lo demás.**

| Ruta | Runtime | Razón |
|---|---|---|
| `middleware.ts` (todas las apps) | Edge | Verificación JWT rápida, sin DB |
| `/api/trpc/[trpc]` | Node.js | Prisma no es compatible con Edge (Wasm experimental, no usar en prod) |
| `/api/webhooks/stripe` | Node.js | `crypto.timingSafeEqual` requiere Node.js; Prisma; body completo |
| `/api/auth/callback` | Node.js | Supabase SSR cookies require Node.js APIs |
| `/api/bookings` | Node.js | Prisma |
| OG Image route (`/opengraph-image`) | Edge | `@vercel/og` optimizado para Edge |
| `app/[slug]/page.tsx` (perfiles públicos) | Node.js con ISR | Prisma en build time, revalidación |

**Por qué NO usar Edge para Prisma:**
- Prisma Client requiere Node.js runtime por defecto.
- Prisma Edge con `@prisma/adapter-pg` (experimental) añade complejidad y latencia de conexión a cada request Edge (no hay connection pooling real).
- Supabase tiene Supavisor (pooler en puerto 6543) — suficiente para serverless Node.js Functions.

**Configuración explícita en route handlers con Prisma:**
```typescript
// app/api/trpc/[trpc]/route.ts
export const runtime = 'nodejs' // explícito, aunque sea el default
export const dynamic = 'force-dynamic'
```

---

### AD-03: Webhook architecture — endpoint único por app, no dispatcher central

**Decisión: `/api/webhooks/stripe` en `apps/alexendros-pro` únicamente. stagekit.app NO tiene endpoint propio de Stripe.**

Justificación:
- Stripe permite configurar UN endpoint de webhook por modo (test/live). Añadir un segundo endpoint duplica eventos y complica el manejo.
- alexendros.pro es el hub de negocio: toda la lógica de suscripción vive allí.
- stagekit.app NO necesita procesar webhooks Stripe directamente: las actualizaciones de plan se reflejan en DB vía alexendros.pro, y stagekit.app lee esos datos con Prisma (misma DB compartida).
- Stripe Connect (afiliados): los eventos `transfer.created` también van al endpoint de .pro.

**Arquitectura del handler (en alexendros.pro):**
```typescript
// Dispatcher interno — no múltiples endpoints, sí múltiples handlers
switch (event.type) {
  case 'checkout.session.completed':
    await handleCheckoutCompleted(event.data.object, prisma)
    break
  case 'customer.subscription.updated':
    await handleSubscriptionUpdated(event.data.object, prisma)
    break
  // ...
}
// Fire-and-forget a n8n (sin await)
void fetch(process.env.N8N_BASE_URL + '/webhook/stripe-events', {
  method: 'POST',
  body: JSON.stringify({ type: event.type, kitId }),
  headers: { 'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET! },
})
```

---

### AD-04: alexendros.me estática + full-stack apps en el mismo monorepo

**Patrón para app estática coexistiendo con apps dinámicas:**

```typescript
// apps/alexendros-me/next.config.ts
const config: NextConfig = {
  output: 'export',              // genera /out/ con HTML/CSS/JS estático
  trailingSlash: true,
  images: { unoptimized: true }, // next/image no funciona en output:export
  // NO: api routes, middleware, server actions, ISR
}
```

**Lo que alexendros.me puede usar de los packages:**
- `@repo/brand` — tokens CSS, fuentes, logos SVG
- `@repo/ui` — componentes React (se usan como RSC o client components, pero sin data fetching server-side de DB)
- `@repo/config` — tsconfig, eslint, tailwind preset

**Lo que NO puede usar alexendros.me:**
- `@repo/db` — no hay backend
- `@repo/stripe` — no hay pagos
- `@repo/email` — no hay server

**Vercel deploy config (vercel.json en alexendros-me):**
```json
{
  "buildCommand": "cd ../.. && pnpm turbo build --filter=alexendros-me",
  "outputDirectory": "apps/alexendros-me/out",
  "framework": null
}
```

**Implicación en Turborepo:** La pipeline `build` de alexendros-me produce `/out/` (estático), no `.next/` (server). El cache de Turbo funciona igual.

---

### AD-05: Supabase SSR Auth — patrón correcto para Next.js 15 App Router

El patrón actualizado con `@supabase/ssr` (no el deprecated `@supabase/auth-helpers-nextjs`):

```typescript
// packages/db/src/supabase/middleware.ts
// Exportado y usado en cada app que necesita auth
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANTE: no usar getUser() en middleware — usar getUser() para refresh silencioso
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}
```

**Regla crítica:** El middleware DEBE devolver `supabaseResponse` (no `NextResponse.next()` nuevo) para que las cookies de sesión actualizadas se propaguen correctamente al cliente.

---

### AD-06: Rate limiting — implementación en middleware vs route handlers

**Decisión: Rate limiting en los route handlers, no en middleware Edge.**

Justificación:
- Upstash Redis (`@upstash/ratelimit`) funciona en Edge Runtime, pero el middleware ya hace verificación de sesión — añadir rate limiting lo hace más pesado y difícil de mantener.
- Los route handlers son el punto correcto: tienen acceso al contexto completo (userId del JWT, tipo de operación).
- Excepción: para endpoints de auth (login/signup), el rate limiting por IP sí puede ir en middleware ya que no hay userId todavía.

```typescript
// packages/config/src/ratelimit.ts — ya definido en docs/01
// Importar desde @repo/config/ratelimit en cada route handler

// Uso en route handler:
const { success } = await rateLimiters.api.limit(userId ?? ip)
if (!success) return Response.json({ error: 'Too many requests' }, { status: 429 })
```

---

### AD-07: Multi-tenant Kit theming — alcance de la separación

**El modelo de datos ya resuelve correctamente el multi-tenancy:**

```
Kit (catálogo) → User.kitId → Subscription.planId → Plan.kitId
                           → ClientProfile → KitProfile.kitId
```

**RLS + Kit isolation:** Las policies actuales aíslan por usuario, no por Kit. Esto es correcto para MVP: un usuario solo ve sus propios datos. No hay riesgo de que un artista de StageKit vea datos de un abogado de LexKit.

**Feature gating por Kit/Plan:**
```typescript
// packages/stripe/src/feature-gates.ts
export function canAccessFeature(
  feature: string,
  kitId: string,
  planSlug: string
): boolean {
  const kit = KIT_CONFIGS[kitId] // Kit.config JSON
  const plan = PLAN_LIMITS[planSlug]
  return plan.features.includes(feature)
}
```

El campo `Kit.config` (JSON) almacena qué features están habilitadas por Kit, complementando los límites del Plan.

---

### AD-08: pgvector — aplazar hasta post-MVP

El schema incluye pgvector para búsqueda semántica de artistas. Esta extensión está en `docs/01` pero no en el schema Prisma actual.

**Decisión: NO activar pgvector en FASE 4.** Añadir complejidad de embeddings sin carga de datos real no aporta valor MVP.

Activar solo cuando haya >100 artistas y el directorio de búsqueda sea una feature confirmada por usuarios.

---

## Patrones adicionales relevantes

### Server Actions vs tRPC vs Route Handlers

| Caso de uso | Patrón recomendado |
|---|---|
| Formulario simple (crear perfil, actualizar bio) | Server Action (`"use server"`) |
| Query de datos en RSC | Prisma directo en RSC (sin API) |
| Mutation compleja con validación (checkout, upgrade plan) | tRPC procedure |
| Webhook externo (Stripe, n8n) | Route Handler (`/api/webhooks/`) |
| Upload de archivos (fotos artista) | Route Handler → Supabase Storage |
| Operación ARCO (exportar datos usuario) | Route Handler con rate limiting estricto |

### ISR para perfiles públicos

Los Kit Profiles públicos (`stagekit.app/[slug]`) son páginas high-traffic que no cambian frecuentemente:

```typescript
// apps/stagekit/app/[slug]/page.tsx
export const revalidate = 3600 // ISR: revalidar cada hora

export async function generateStaticParams() {
  const profiles = await prisma.kitProfile.findMany({
    where: { isPublic: true, kitId: 'stagekit' },
    select: { slug: true }
  })
  return profiles.map(p => ({ slug: p.slug }))
}
```

Ventaja: primera carga desde CDN (LCP < 1.5s), sin hit a DB en cada visita.

### Env variables — validación en packages/config

```typescript
// packages/config/src/env.ts — único punto de verdad
// Cada app importa desde @repo/config/env, NUNCA process.env directo
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    DATABASE_URL: z.string().url(),
    STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
    // ... 22 variables
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',
})
```

---

*Investigación completada: 2026-04-06*
*Próximos archivos de investigación sugeridos: DATABASE.md, PAYMENTS.md, AUTH.md*
