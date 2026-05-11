# ADR-0002 · Supabase + Prisma 5 como capa de datos

- Fecha: 2026-05-10
- Estado: Aceptado
- Decisor: Alexendros

## Contexto

El monorepo necesita autenticación SSR, base de datos PostgreSQL con RLS, y un ORM que funcione bien en un contexto de 1 desarrollador con 11 modelos interconectados.

## Decisión

**Supabase** para auth SSR + PostgreSQL hosteado (región eu-west-1 Frankfurt). **Prisma 5** como ORM con `DATABASE_URL` (pooler port 6543) + `DIRECT_URL` (port 5432 migraciones).

## Justificación

| Criterio | Supabase + Prisma | Neon + Drizzle | PlanetScale + Drizzle |
|---------|:---:|:---:|:---:|
| Auth SSR out-of-box | ✅ `@supabase/ssr` | ✗ (separado) | ✗ |
| RLS nativo en Postgres | ✅ | ✅ | ✗ |
| EU data residency | ✅ Frankfurt | ✅ | parcial |
| Schema declarativo | Prisma ✅ | Drizzle TS | Drizzle TS |
| Migraciones maduras | `prisma migrate` ✅ | `drizzle-kit` | `drizzle-kit` |
| Free tier útil para MVP | ✅ 500MB+2 proyectos | ✅ | ✗ |
| Coste cognitivo 1 dev | bajo | medio | medio |

## Consecuencias

- `getUser()` sobre `getSession()` — crítico para seguridad SSR (no confiar en cookie local).
- Layouts con datos de usuario: `export const dynamic = 'force-dynamic'`.
- Prisma no respeta RLS: toda query server-side usa `supabaseAdmin` con service role solo para operaciones privilegiadas; queries de usuario usan `createServerClient` con session.
- Migraciones solo via `prisma migrate dev` — nunca editar schema en Supabase Studio sin migration.

## Alternativas descartadas

- **Neon + Drizzle**: Drizzle es buena opción técnica pero menor madurez en migrations para 11 modelos complejos. Evaluar en post-MVP.
- **PlanetScale**: no RGPD-friendly para datos EU sin configuración explícita. Sin RLS nativo.
- **Clerk**: reemplazaría Supabase Auth pero añade vendor lock-in en auth. Supabase Auth cubre todos los casos del MVP.
