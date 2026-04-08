# Phase 4: Base de Datos - Context

**Gathered:** 2026-04-07 (assumptions mode, auto)
**Status:** Ready for planning

<domain>
## Phase Boundary

Schema Prisma completo con 11 modelos, RLS habilitado en todas las tablas Supabase, Supabase client factory SSR y seed data con Kits y planes.

</domain>

<decisions>
## Implementation Decisions

### Schema Design
- **D-01:** Seguir docs/03-schema-db.md exactamente para los 11 modelos. Añadir `stripeEventId String? @unique` a AuditLog (requerido por DB-05/PAY-03 pero falta en el spec).
- **D-02:** No aplicar soft delete (`deletedAt`) en esta fase — el spec no lo incluye y ARCO (Phase 6) usa cascade delete completo.
- **D-03:** Kit model usa string IDs como slugs (`id String @id` con valores 'stagekit', 'lexkit').

### RLS Policies
- **D-04:** RLS via SQL raw en migracion Prisma (no via Supabase Studio). El SQL completo de docs/03-schema-db.md se incluye como migration SQL escape.
- **D-05:** Prisma mutations via `service_role` bypasean RLS intencionalmente. RLS protege contra acceso directo via Supabase client (anon/authenticated). Documentar claramente en README.
- **D-06:** El SQL de RLS vive en version control como parte de la migracion Prisma, no como script suelto.

### Supabase Client Factory
- **D-07:** Client factory en `packages/db/src/supabase/` con 3 variantes: server (RSC/Route Handlers), browser (Client Components), middleware (proxy.ts). Usando `@supabase/ssr` exclusivamente.
- **D-08:** Exports separados en package.json: Prisma client y Supabase factory como paths distintos para que consumidores no-Next.js (n8n, CLI) puedan importar solo Prisma.
- **D-09:** Pattern async cookies de Next.js 16: `const cookieStore = await cookies()` en server client.

### Seed Data
- **D-10:** Seed crea exactamente: 2 Kits (stagekit, lexkit), 3 Plans por Kit (Free/Pro 29EUR/Agency 199EUR), 1 usuario test. GestKit no se seedea (Q4 2026).
- **D-11:** Seed via `prisma db seed` con archivo TypeScript en `packages/db/prisma/seed.ts`.

### Connection Strategy
- **D-12:** DATABASE_URL usa pooler port 6543 con `?pgbouncer=true&connection_limit=1`. DIRECT_URL usa port 5432 solo para migraciones. Ambos en datasource Prisma.

### Claude's Discretion
- Nombres exactos de las RLS policies
- Estructura de carpetas dentro de packages/db/src/
- Formato del usuario test en seed
- Orden de creacion de modelos en schema.prisma

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Schema Spec
- `docs/03-schema-db.md` — Prisma schema completo: 11 modelos, relaciones, enums, RLS SQL
- `docs/04-pagos-suscripciones.md` — Stripe plans/pricing (Free/Pro/Agency) para seed data

### Architecture
- `.planning/research/ARCHITECTURE.md` — Supabase client factory patterns, service_role bypass
- `.planning/research/STACK.md` — Prisma 5 decision, connection pooling, @supabase/ssr patterns
- `.planning/research/PITFALLS.md` — CP-01 (getSession), CP-02 (webhook idempotency), CM-02 (pool exhaustion)

### Package Rules
- `packages/db/CLAUDE.md` — RLS mandatory, Prisma only, migration rules
- `packages/config/src/env.ts` — DATABASE_URL/DIRECT_URL already validated with Zod

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `packages/config/src/env.ts` — DATABASE_URL y DIRECT_URL ya validados con Zod
- `packages/db/CLAUDE.md` — Reglas claras de RLS, Prisma, migraciones

### Established Patterns
- Package exports via package.json "exports" field
- TypeScript strict + noUncheckedIndexedAccess
- pnpm workspace con workspace:* references

### Integration Points
- `packages/db/package.json` — necesita Prisma, @supabase/ssr, @supabase/supabase-js como deps
- `apps/alexendros-pro/` y `apps/kitos/stagekit/` — consumiran el client factory en fases futuras

</code_context>

<specifics>
## Specific Ideas

- stripeEventId @unique en AuditLog para idempotency de webhooks Stripe
- pgbouncer=true obligatorio en DATABASE_URL para Vercel serverless
- next/headers dependency aislada en el export de Supabase factory, no contamina Prisma client

</specifics>

<deferred>
## Deferred Ideas

- Soft delete (deletedAt) — evaluar cuando se implemente ARCO en Phase 6
- pgvector para embeddings — post-MVP (>100 artistas)
- Read replicas — no necesarias para MVP volume
- Prisma 6 upgrade — evaluar post-MVP

</deferred>

---

*Phase: 04-base-de-datos*
*Context gathered: 2026-04-07*
