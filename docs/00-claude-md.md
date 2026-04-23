# 00 — CLAUDE.md

# [CLAUDE.md](http://CLAUDE.md) — alexendros-monorepo

> Punto de entrada obligatorio para Claude Code. Léelo íntegro antes de ejecutar cualquier tarea.
> 

> Este archivo se carga automáticamente en cada sesión.
> 

---

## Cómo instalar en el monorepo

```bash
# Copiar todos los archivos de esta página al repositorio
# Estructura completa a crear:

alexendros-monorepo/
├── CLAUDE.md                         ← este archivo (raíz)
├── .claude/
│   ├── mcp.json                      ← configuración MCPs
│   ├── agents/
│   │   ├── brand-auditor.md
│   │   ├── db-architect.md
│   │   ├── stripe-engineer.md
│   │   ├── seo-geo-specialist.md
│   │   └── gdpr-compliance.md
│   └── skills/
│       ├── create-kit.md
│       ├── new-db-migration.md
│       ├── add-stripe-plan.md
│       ├── deploy-vercel.md
│       └── gdpr-audit.md
├── apps/
│   ├── alexendros-me/CLAUDE.md
│   ├── alexendros-pro/CLAUDE.md
│   ├── stagekit/CLAUDE.md
│   ├── lexkit/CLAUDE.md
│   └── gestkit/CLAUDE.md
└── packages/
    ├── brand/CLAUDE.md
    ├── ui/CLAUDE.md
    └── db/CLAUDE.md
```

## Carga jerárquica automática

Claude Code carga en orden:

1. [CLAUDE.md](http://CLAUDE.md) de la raíz del monorepo
2. [CLAUDE.md](http://CLAUDE.md) del subdirectorio donde se lanza la sesión
3. Todos los [CLAUDE.md](http://CLAUDE.md) en directorios intermedios

Ejemplo: si lanzas `claude` desde `apps/alexendros-me/`:

→ Carga raíz/[CLAUDE.md](http://CLAUDE.md) + apps/alexendros-me/[CLAUDE.md](http://CLAUDE.md) automáticamente.

---

## 1. PROYECTO

```yaml
name: alexendros-monorepo
type: personal-brand + multi-app SaaS platform
owner: Alejandro Domingo Agustí
package_manager: pnpm@9+
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
  stripe:  lógica de pagos compartida
  email:   React Email templates compartidas
  config:  tsconfig, eslint, tailwind base
```

---

## 2. STACK GLOBAL

| Capa | Tecnología |
| --- | --- |
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
- **Nunca secretos en código.** `.env.local` + validación Zod en `env.ts`.
- Commits: nunca a `main` directo. Feature branch + PR siempre.

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
2. Leer CLAUDE.md del subdirectorio correspondiente
3. Si hay agente relevante → cargar desde .claude/agents/
4. Si hay skill relevante → cargar desde .claude/skills/
5. Implementar siguiendo reglas sección 3
6. Verificar con comandos sección 5
7. Actualizar Notion via MCP si hay cambios de arquitectura
```

**Cuándo usar cada agente:**

| Agente | Activar cuando... |
| --- | --- |
| brand-auditor | Auditar o mejorar [alexendros.me](http://alexendros.me) / marca |
| db-architect | Cambios en schema, migraciones, RLS |
| stripe-engineer | Pagos, planes, webhooks, afiliados |
| seo-geo-specialist | Metadata, JSON-LD, CWV, citabilidad AI |
| gdpr-compliance | Features con datos personales, cookies, legal |

**Cuándo usar cada skill:**

| Skill | Activar cuando... |
| --- | --- |
| create-kit | Añadir una nueva app vertical al monorepo |
| new-db-migration | Cualquier cambio en schema Prisma |
| add-stripe-plan | Nuevo plan o precio en cualquier app |
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

## 6.5. VALIDACIÓN ENV — `lib/env.ts`

Todas las variables de entorno se validan al arrancar con Zod. Si falta alguna, el build falla con error descriptivo.

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Prisma
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  STRIPE_CONNECT_CLIENT_ID: z.string().min(1),

  // Precios Stripe (por Kit — StageKit MVP)
  STRIPE_PRICE_STAGEKIT_PRO_MONTHLY: z.string().startsWith('price_'),
  STRIPE_PRICE_STAGEKIT_AGENCY_MONTHLY: z.string().startsWith('price_'),

  // Email
  RESEND_API_KEY: z.string().startsWith('re_'),

  // Monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().url(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default('https://eu.posthog.com'),

  // Notion MCP
  NOTION_TOKEN: z.string().startsWith('secret_'),

  // n8n
  N8N_WEBHOOK_SECRET: z.string().min(1),
  N8N_BASE_URL: z.string().url(),

  // Rate Limiting (Upstash)
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

// Validar al importar — falla en build si hay error
export const env = envSchema.parse(process.env);

// Tipo inferido para autocompletado
export type Env = z.infer<typeof envSchema>;
```

**Reglas de uso:**
- Importar siempre desde `@repo/config/env` (nunca `process.env` directo)
- Variables `NEXT_PUBLIC_*` son las únicas expuestas al cliente
- `SUPABASE_SERVICE_ROLE_KEY` NUNCA debe tener prefijo `NEXT_PUBLIC_`
- En tests, usar `.env.test` con valores mock (nunca credenciales reales)

---

## 7. LO QUE NO DEBES HACER

```json
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
```

---

## 8. FASE ACTUAL: PRE-FASE (Abril 2026)

Antes de cualquier trabajo en [alexendros.pro](http://alexendros.pro), completar:

- PF-0: Brand Audit de [alexendros.me](http://alexendros.me)
- PF-1: Brand Positioning Statement
- PF-2: Design Token System en packages/brand
- PF-3: Rebuild [alexendros.me](http://alexendros.me) production-ready
- PF-4: CWV < 2.0s LCP + JSON-LD Person validado
- PF-5: Monorepo Turborepo + Vercel multi-proyecto activo

Ver checklist: Notion → PRE-FASE — Brand Audit & Reposicionamiento [Alexendros.me](http://Alexendros.me)

---

## 9. [SUB-CLAUDE.md](http://SUB-CLAUDE.md) POR DIRECTORIO

| Archivo | Contexto específico que añade |
| --- | --- |
| apps/alexendros-me/[CLAUDE.md](http://CLAUDE.md) | Reglas web personal, copywriting, waitlist, GDPR |
| apps/alexendros-pro/[CLAUDE.md](http://CLAUDE.md) | Reglas SaaS hub Alexendros, arquitectura multi-app |
| packages/brand/[CLAUDE.md](http://CLAUDE.md) | Tokens, logos, paletas, reglas visuales |
| packages/db/[CLAUDE.md](http://CLAUDE.md) | Schema, RLS, convenciones Prisma/Supabase |
| packages/ui/[CLAUDE.md](http://CLAUDE.md) | Componentes shadcn, CVA, accesibilidad |

---

## 10. AGENTES (.claude/agents/)

### [brand-auditor.md](http://brand-auditor.md)

Evaluará la marca con el Brand Audit Score (BAS) de 6 dimensiones ponderadas,

hará checks técnicos automáticos (JSON-LD, CWV, OG) y publicará resultados en Notion.

### [db-architect.md](http://db-architect.md)

Gestiona cambios en schema Prisma, genera migraciones, implementa políticas RLS

y crea índices. Sigue el patrón de migration + RLS obligatorio por tabla.

### [stripe-engineer.md](http://stripe-engineer.md)

Gestiona planes, webhooks, setup fees, Stripe Connect para afiliados y compliance PCI DSS v4.0.

### [seo-geo-specialist.md](http://seo-geo-specialist.md)

Implementa Metadata API Next.js 15, JSON-LD [schema.org](http://schema.org), técnicas GEO para citabilidad

en motores AI y optimización de Core Web Vitals.

### [gdpr-compliance.md](http://gdpr-compliance.md)

Audita features nuevas contra RGPD/LOPDGDD, genera checklists de compliance

y verifica textos legales (aviso legal, privacidad, cookies).

---

## 11. SKILLS (.claude/skills/)

### [create-kit.md](http://create-kit.md)

Pasos numerados para añadir una nueva app vertical al monorepo: scaffold app, tokens,

planes Stripe, registro en DB, proyecto Vercel y [CLAUDE.md](http://CLAUDE.md) propio.

### [new-db-migration.md](http://new-db-migration.md)

Flujo completo: editar schema → validar → migrar → RLS → generar tipos → verificar.

### [add-stripe-plan.md](http://add-stripe-plan.md)

Crear producto en Stripe Dashboard → env vars → plans.ts → setup fee → pricing page → test.

### [deploy-vercel.md](http://deploy-vercel.md)

Configurar vercel.json, dominios, env vars, deploy automático con turbo-ignore y verif. post-deploy.

### [gdpr-audit.md](http://gdpr-audit.md)

Checklist pre-deploy: datos, base legal, consentimiento, derechos, seguridad técnica, textos legales.

### [brand-manual.md](http://brand-manual.md)

Genera manuales de identidad de marca profesionales siguiendo estándares del sector (ISO 10668/20671, PMS, WCAG AA, PDF/X-4). Incluye logotipo con variantes, sistema de color multi-formato, tipografía, aplicaciones y entregables listos para producción.