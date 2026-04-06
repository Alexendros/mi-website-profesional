# Stack Research: KitOS Platform

> Investigación realizada: 2026-04-06
> Fuentes: nextjs.org/blog, tailwindcss.com/blog, official changelogs y conocimiento técnico verificado.
> Alcance: validación del stack decidido + recomendaciones de versión específicas.

---

## Recommended Stack (2025/2026)

### Framework — Next.js 16.x

**Versión recomendada:** `next@16.2` (latest stable, publicado 18 marzo 2026)

El stack App Router + Server Components es la apuesta correcta. Next.js 16 introduce cambios importantes que afectan al proyecto:

- **Turbopack es ahora el bundler por defecto** — reemplaza Webpack. 2–5x builds más rápidos, hasta 10x Fast Refresh. Sin configuración requerida.
- **`proxy.ts` reemplaza `middleware.ts`** — renombrar el archivo y la función exportada. La lógica es idéntica. `middleware.ts` sigue funcionando para Edge runtime pero está deprecado.
- **Params y cookies async son obligatorios** — `await params`, `await cookies()`, `await headers()`. En v15 eran warnings; en v16 son errores en build.
- **Node.js 20.9+ requerido** — Node 18 ya no está soportado. Actualizar VPS y Vercel runtime.
- **`cacheComponents: true`** — nuevo modelo de caché explícito con directiva `"use cache"`. PPR evoluciona hacia este modelo. No activo por defecto, opt-in.
- **React 19.2** incluido — View Transitions, `useEffectEvent`, `Activity` component.
- **`revalidateTag()` requiere segundo argumento** — `revalidateTag('tag', 'max')`. El form de un argumento está deprecado.
- **`after()` estable** — útil para logs y analytics post-respuesta sin bloquear al usuario.

**Confianza: ALTA.** Stack central del proyecto, sin alternativa viable con el mismo nivel de integración Vercel + React.

---

### Auth — Supabase Auth SSR via `@supabase/ssr`

**Versión recomendada:** `@supabase/ssr@latest` + `@supabase/supabase-js@latest`

Patrón correcto y recomendado. `@supabase/auth-helpers-nextjs` está deprecado — migrar a `@supabase/ssr` que es el paquete oficial actual. Implementación:

- `createServerClient()` → Server Components, Route Handlers, Server Actions
- `createBrowserClient()` → Client Components
- Cookie-based session management compatible con SSR/Edge

**Gotchas conocidos en Next.js 16:**
1. Con `proxy.ts` (antes `middleware.ts`), el refresh de sesión debe ocurrir en `proxy.ts` usando `createServerClient` con el `request`/`response` pattern.
2. El patrón de `cookies()` ahora es async — `const cookieStore = await cookies()` en todos los Server Components.
3. Con el nuevo modelo de caché (`"use cache"`), las llamadas a Supabase en componentes cacheados necesitan excluirse del caché o se servirán datos stale. Usar `noStore()` o no marcar con `"use cache"` componentes que lean sesión.

**Alternativa considerada — NextAuth v5 (Auth.js):** Más flexible para múltiples providers, pero requiere gestión manual de RLS y no integra con el cliente Supabase. Para este proyecto con RLS nativo como requisito de seguridad, Supabase Auth es la decisión correcta. **Rechazado.**

**Confianza: ALTA.**

---

### ORM — Prisma 5.x (mantener)

**Versión recomendada:** `prisma@5.x` (Prisma 6 existe pero con breaking changes; evaluar migración en Q2 2026)

Prisma 5 es estable y la elección correcta para este proyecto. El debate Prisma vs Drizzle es real pero la decisión depende del caso de uso:

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

**Veredicto para KitOS:** Prisma 5 es la elección correcta. Las razones:
- El schema declarativo es más legible para 11 modelos complejos con relaciones.
- `prisma migrate` es más robusto para producción que las herramientas equivalentes de Drizzle.
- La integración con Supabase usando `DATABASE_URL` (pooler) + `DIRECT_URL` (directo) está bien documentada y funcional.
- El equipo (una persona) tiene menor overhead cognitivo con Prisma.

**Gotcha crítico:** Prisma no propaga automáticamente el JWT de Supabase para RLS en las queries del servidor. Las políticas RLS deben configurarse para `service_role` en el contexto del servidor, o usar `set_config('request.jwt.claims', ...)` por conexión. Para KitOS, la arquitectura con RLS por `tenant_id` requiere este cuidado.

**Drizzle:** Rechazado por esta fase. Puede reconsiderarse para fases futuras si Edge runtime se vuelve crítico.

**Confianza: ALTA.**

---

### API Layer — tRPC v11

**Versión recomendada:** `@trpc/server@11.x` + `@trpc/client@11.x` + `@trpc/next@11.x`

tRPC v11 es estable. Los cambios principales respecto a v10:

- **`initTRPC` API refactorizada** — nueva forma de crear routers con mejor inferencia de tipos.
- **Server-side callers** — `createCallerFactory` para llamar procedures desde Server Components sin HTTP.
- **React Query v5 integración** — `@tanstack/react-query@5` como peer dependency (breaking desde v5 de React Query).
- **Streaming support** — soporte para Server-Sent Events y streaming de responses.
- **Eliminado:** `createNextApiHandler` (Pages Router) reemplazado por `fetchRequestHandler` para App Router.

**Integración con Next.js 16 App Router:**
```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export const GET = (req: Request) => fetchRequestHandler({ ... });
export const POST = (req: Request) => fetchRequestHandler({ ... });
```

**Gotcha:** Con `proxy.ts` (nuevo nombre de middleware), las llamadas tRPC desde Server Components siguen funcionando vía `createCallerFactory`. Esto es preferible a HTTP para reducir latencia en mutaciones server-side.

**Confianza: ALTA.**

---

### Styling — Tailwind CSS v4.1

**Versión recomendada:** `tailwindcss@4.1` (publicado 3 abril 2025)

v4 es production-ready. v4.1 (3 abril 2025) añade text-shadow utilities y mask utilities que son relevantes para KitOS.

**Cambios críticos para el proyecto:**

1. **CSS-first config** — `tailwind.config.js` reemplazado por `@theme {}` en CSS. El sistema de tokens `packages/brand/tokens.ts` debe adaptarse:
   ```css
   /* packages/brand/tailwind.css */
   @import "tailwindcss";
   
   @theme {
     --color-acid-green: oklch(0.85 0.2 150);
     --color-legal-navy: oklch(0.25 0.1 240);
     /* tokens por Kit */
   }
   ```

2. **oklch nativo** — Tailwind v4 usa oklch por defecto en su paleta. Compatible con el sistema de tokens decidido (oklch en `packages/brand`). Ventaja: coherencia total.

3. **Vite plugin** — `@tailwindcss/vite`. Para Next.js, usar `@tailwindcss/postcss` (PostCSS plugin oficial para v4).

4. **Automatic content detection** — no hay que configurar el array `content`. Respeta `.gitignore` automáticamente.

5. **Container queries built-in** — sin plugin adicional. Útil para componentes de dashboard.

6. **3D transforms** — `rotate-x-*`, `rotate-y-*` sin configuración. Relevante para animaciones de Framer Motion.

**Migración desde v3 (si hubiera código existente):**
```bash
npx @tailwindcss/upgrade@next
```
El tool automatiza la mayoría de la migración. El proyecto empieza desde cero, por lo que no hay deuda de migración.

**Confianza: ALTA.**

---

### UI Components — shadcn/ui

**Versión recomendada:** shadcn/ui CLI latest + Radix UI latest

shadcn/ui no tiene versiones semánticas propias — es un sistema de "copy-paste" de componentes. El CLI instala la última versión de cada componente.

**Configuración recomendada para KitOS:**
```json
{
  "style": "new-york",
  "baseColor": "zinc",
  "cssVariables": true,
  "tailwind": { "prefix": "" }
}
```

**Componentes nuevos relevantes para SaaS dashboards (2025):**
- `Chart` — wrapper de Recharts con theming automático via CSS vars. Ideal para dashboard de analytics (EPK views, booking requests).
- `Sidebar` — componente completo de sidebar con estado persistente, colapsable, keyboard navigation.
- `Breadcrumb` — navegación de migas de pan.
- `Collapsible`, `Resizable` — paneles redimensionables para layouts de dashboard.
- `Drawer` — sheet/drawer para mobile.

**Pattern para multi-Kit theming:** Con Tailwind v4 y CSS vars, el theming por Kit se implementa cambiando CSS custom properties en el root del layout de cada Kit:
```tsx
// apps/stagekit/app/layout.tsx
<html data-theme="dark-acid">
  {/* tokens de packages/brand aplicados via CSS vars */}
```

**Gotcha:** shadcn/ui actualmente usa Tailwind v3 como base en su documentación. Para Tailwind v4, los componentes generados requieren ajustes menores en las clases de color (el formato `bg-background` sigue igual, pero los defaults cambian). Verificar compatibilidad al inicializar.

**Confianza: ALTA.**

---

### Pagos — Stripe Connect Express

**Versión recomendada:** `stripe@latest` (Node.js SDK)

Stripe Connect Express sigue siendo la opción correcta para pagos a afiliados. Los tipos de cuenta Connect son:

| Tipo | Onboarding | Control | Caso de uso |
|------|-----------|---------|-------------|
| Standard | Gestionado por Stripe | Bajo | Marketplaces donde el vendedor gestiona su cuenta |
| Express | Stripe-hosted flow simplificado | Medio | **Afiliados/partners** — caso KitOS |
| Custom | Fully custom | Alto | Plataformas con UX totalmente custom |

**Express es la elección correcta para KitOS:** el afiliado completa un onboarding simplificado en Stripe (15 min), y los payouts son automáticos via transfers. Sin necesidad de gestionar KYC propio.

**Notas de compliance PSD2/SCA:** Los pagos de suscripción requieren SCA en el primer cobro. Stripe Billing gestiona esto automáticamente con `payment_behavior: 'default_incomplete'` + `expand: ['latest_invoice.payment_intent']` en la creación de suscripción.

**Webhook events a escuchar (confirmados para MVP):**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`
- `transfer.created` (afiliados)

**Confianza: ALTA.**

---

### Email — React Email + Resend

**Versión recomendada:** `react-email@latest` + `resend@latest`

La combinación sigue siendo la mejor opción para el stack Next.js. React Email permite desarrollar templates en JSX con preview en navegador. Resend tiene la mejor DX de su categoría y deliverability competitiva.

**Alternativas evaluadas:**
- **Postmark:** Excelente deliverability transaccional, sin templates React nativas. Migración posible si Resend falla en deliverability.
- **Loops:** Orientado a secuencias de marketing/SaaS onboarding. Puede complementar (no reemplazar) Resend para las secuencias n8n.
- **Brevo (ex-Sendinblue):** Alternativa EU-compliant más barata en escala, pero DX inferior.

**Veredicto:** Resend + React Email es la elección correcta para MVP. El presupuesto free tier de Resend (3.000 emails/mes) cubre la fase inicial. Si las secuencias de automatización (n8n) escalan, evaluar Loops como capa de marketing sobre Resend transaccional.

**Confianza: ALTA.**

---

### Automatización — n8n self-hosted

**Versión recomendada:** n8n latest (auto-update via Docker)

n8n self-hosted es viable para el caso de uso de KitOS. Consideraciones para Hostinger VPS:

**Requisitos mínimos recomendados:**
- RAM: 1GB mínimo, 2GB recomendado (n8n Node.js process + workflows en ejecución)
- CPU: 1 vCPU suficiente para workflows low-volume (<100 ejecuciones/día)
- Storage: 10GB+ para logs y datos de ejecución
- Docker + Docker Compose (instalación recomendada)

**Arquitectura recomendada en VPS:**
```
Docker Compose:
  - n8n (puerto 5678, detrás de Nginx proxy)
  - PostgreSQL (persistencia de workflows — SQLite no recomendado en producción)
  - Nginx (SSL termination + proxy)
```

**Scaling concerns para KitOS MVP:**
- Los 20+ workflows de la Fase 7.5 ejecutarán principalmente en respuesta a webhooks Stripe. El volumen estimado (< 500 clientes en MVP) es completamente manejable.
- El riesgo principal es **memory leaks** en workflows complejos con loops. Monitorear con Better Uptime `/healthz` cada 5 minutos.
- **Colas de trabajo:** Para las secuencias de dunning (W-11..W-17) con reintentos, usar Queue mode con Redis si el volumen escala. Para MVP, el modo por defecto es suficiente.

**n8n Cloud vs self-hosted:**
- Self-hosted: coste fijo (~$12/mes VPS ya existente), control total, sin limitaciones de workflows.
- Cloud: $24/mes starter, límite de ejecuciones. No justificado para MVP.

**Confianza: ALTA para MVP. Reevaluar Queue mode al superar 200 clientes activos.**

---

### Monorepo — Turborepo

**Versión recomendada:** `turbo@latest` (Turborepo 2.x)

Turborepo sigue siendo la opción correcta para un solo desarrollador con stack Next.js + Vercel. La comparativa con Nx:

| Criterio | Turborepo | Nx |
|----------|-----------|-----|
| Setup inicial | Muy sencillo | Complejo, opinionado |
| Integración Vercel | Nativa (Remote Cache) | Manual |
| Curva de aprendizaje | Baja | Alta |
| Generadores de código | Básicos | Muy avanzados |
| Build caching | Remote Cache en Vercel gratis | Nx Cloud (pago) |
| Para 1 dev | Excelente | Overhead innecesario |
| Para equipos | Adecuado | Superior |

**Nx rechazado:** Complejidad innecesaria para un solo desarrollador. El valor de Nx está en grandes equipos con múltiples apps y necesidades de generación de código avanzada.

**Configuración recomendada `turbo.json` para el proyecto:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "typecheck": { "dependsOn": ["^typecheck"] },
    "lint": {},
    "test": { "outputs": ["coverage/**"] },
    "dev": { "persistent": true, "cache": false }
  }
}
```

**Confianza: ALTA.**

---

## Validation of Current Choices

### Next.js 15 → Actualizar a Next.js 16

**Estado:** OBSOLETO — Next.js 16.2 es el latest stable (18 marzo 2026).

**Preocupaciones críticas:**
- El proyecto aún no tiene código, por lo que no hay deuda de migración. Iniciar directamente en Next.js 16.
- `middleware.ts` → renombrar a `proxy.ts` desde el inicio para evitar deprecation warnings.
- Node.js 20.9+ requerido — verificar que la configuración de Vercel y el VPS usen Node 20 LTS.
- `params` y `cookies()` async obligatorio — escribir código async desde el inicio.
- `revalidateTag()` con segundo argumento obligatorio.

**Acción:** Usar `next@16` al inicializar el proyecto. No empezar en v15.

---

### Supabase Auth SSR

**Estado:** VÁLIDO — `@supabase/ssr` es el paquete correcto.

**Preocupación:** El paquete `@supabase/auth-helpers-nextjs` (mencionado en docs antiguas) está deprecado. Asegurarse de usar `@supabase/ssr` exclusivamente.

**Gotcha con Next.js 16 async cookies:**
```typescript
// CORRECTO en Next.js 16
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function createClient() {
  const cookieStore = await cookies(); // await obligatorio en v16
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {} // ignorar en Server Components
        },
      },
    }
  );
}
```

---

### Prisma 5

**Estado:** VÁLIDO — mantener Prisma 5 para MVP.

**Nota:** Prisma 6 fue publicado a finales de 2024 con mejoras en performance y un nuevo ORM query engine. Evaluar migración post-MVP. La API es similar pero hay breaking changes menores en la configuración.

**Gotcha RLS:** El `service_role` key bypasea RLS. En el servidor siempre se usa `service_role` via Prisma (para operaciones administrativas) — las políticas RLS se aplican solo cuando el cliente usa la `anon_key` con el JWT del usuario. Documentar explícitamente qué operaciones son admin (Prisma/service_role) vs user (Supabase client/anon_key).

---

### tRPC v11

**Estado:** VÁLIDO — estable en producción.

**Breaking change principal desde v10:** El handler de Next.js App Router cambia de `createNextApiHandler` a `fetchRequestHandler`. Inicializar directamente con la API de App Router.

---

### Tailwind CSS v4

**Estado:** VÁLIDO — v4.1 stable (3 abril 2025).

**Acción:** Iniciar con `tailwindcss@4.1` + `@tailwindcss/postcss`. La configuración CSS-first encaja perfectamente con el sistema de tokens oklch planeado en `packages/brand`.

---

### shadcn/ui

**Estado:** VÁLIDO — usar CLI latest.

**Verificar compatibilidad con Tailwind v4** al inicializar. La comunidad shadcn tiene soporte oficial para v4 pero algunos componentes pueden requerir ajustes en clases.

---

### Stripe Connect Express

**Estado:** VÁLIDO — sigue siendo el tipo de cuenta correcto para afiliados.

---

### React Email + Resend

**Estado:** VÁLIDO — mejor combinación disponible para el stack.

---

### n8n self-hosted

**Estado:** VÁLIDO — apropiado para MVP con VPS existente.

**Acción:** Asegurar que n8n corre con PostgreSQL (no SQLite) para fiabilidad en producción. El Hostinger VPS debe tener PostgreSQL instalado para n8n.

---

### Turborepo

**Estado:** VÁLIDO — mantener.

---

## What NOT to Use

### Drizzle ORM (en lugar de Prisma)
**Razón:** La DX de schema declarativo de Prisma es superior para 11 modelos complejos. Drizzle brilla en proyectos Edge-first o donde bundle size en función serverless es crítico. Para este stack (Vercel Functions + Supabase pooler), Prisma es más adecuado. Reevaluar si se añaden funciones Edge que accedan a DB directamente.

### NextAuth v5 / Auth.js (en lugar de Supabase Auth)
**Razón:** Requiere gestión separada de la lógica RLS. Supabase Auth nativo integra mejor con la arquitectura de seguridad del proyecto. Auth.js añade complejidad sin beneficio claro cuando ya se usa Supabase como BaaS completo.

### Pages Router de Next.js
**Razón:** App Router es el estándar actual. Pages Router está en modo "maintenance" — no recibe nuevas funcionalidades. Todo nuevo código debe ir en App Router.

### GraphQL / Apollo (en lugar de tRPC)
**Razón:** Overhead innecesario de tipo y schema management para un solo desarrollador. tRPC ofrece type-safety end-to-end con mucho menos boilerplate.

### Nx (en lugar de Turborepo)
**Razón:** Complejidad y curva de aprendizaje no justificadas para un solo desarrollador. El valor de Nx es en organizaciones con equipos grandes.

### Webpack (desde Next.js 16)
**Razón:** Turbopack es el default en Next.js 16. Mantener Webpack solo si hay plugins incompatibles con Turbopack (poco probable en este stack).

### Neon Database (en lugar de Supabase)
**Razón:** Supabase ofrece Auth, Storage, RLS, y DB en un solo servicio. Neon es solo DB. Para el stack KitOS, la integración completa de Supabase justifica permanecer en él.

### PlanetScale (en lugar de Supabase)
**Razón:** PlanetScale abandonó su plan gratuito en 2024. Supabase free tier es más generoso y el stack ya está decidido.

### Clerk (en lugar de Supabase Auth)
**Razón:** Clerk tiene excelente DX pero es un servicio externo de pago que duplica funcionalidad ya disponible en Supabase. Para compliance RGPD, mantener los datos de autenticación en la misma infraestructura EU (Supabase eu-west-1) simplifica el modelo de datos.

### Tailwind CSS v3 (usar v4)
**Razón:** v4 es production-stable y el proyecto empieza desde cero. El sistema de tokens oklch + CSS-first config es más limpio en v4. No hay razón para empezar en v3.

### React Hook Form + Zod (mantener)
**Nota:** Esta combinación mencionada en el stack actual es correcta. No sustituir por soluciones como TanStack Form — React Hook Form sigue siendo el estándar con shadcn/ui.

---

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

---

## Critical Actions Before Starting FASE 0

1. **Usar `next@16`** al crear las apps — no `next@15`.
2. **Node.js 20.9+** en `.nvmrc` y en Vercel build settings.
3. **`proxy.ts`** en lugar de `middleware.ts` desde el primer commit.
4. **`@supabase/ssr`** — no instalar `@supabase/auth-helpers-nextjs`.
5. **`tailwindcss@4.1`** + `@tailwindcss/postcss` — no instalar `autoprefixer` (incluido en v4).
6. **`revalidateTag(tag, 'max')`** — usar siempre el segundo argumento.
7. **`await cookies()`** — todas las llamadas a `cookies()`, `headers()`, `params` son async.
8. **Framer Motion** — importar desde `'motion/react'` (renombrado en v12), no `'framer-motion'`.
9. **PostgreSQL para n8n** en el VPS — no SQLite.
10. **`turbo.json`** con `"$schema": "https://turbo.build/schema.json"` Turborepo 2.

---

*Última actualización: 2026-04-06*
*Fuentes verificadas: nextjs.org/blog (Next.js 15, 15.1, 16, 16.2), tailwindcss.com/blog (v4.0, v4.1), conocimiento técnico consolidado sobre Prisma/Drizzle, tRPC v11, Stripe Connect, Supabase SSR, n8n self-hosted, Turborepo.*
