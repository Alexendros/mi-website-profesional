# ADR-0001 · Stack Next.js 16 + Node 24 + Turborepo

- Fecha: 2026-05-10
- Estado: Aceptado
- Decisor: Alexendros

## Contexto

El monorepo necesita un framework web moderno para múltiples apps (alexendros.pro, StageKit, LexKit, GestKit) con un pipeline de CI/CD unificado y cache de builds compartida.

## Decisión

**Next.js 16** como framework para todas las apps del monorepo. **Node 24 LTS** como runtime. **Turborepo 2.x** como orquestador de builds.

## Justificación

| Criterio | Next.js 16 + Turbopack | Remix | SvelteKit |
|---------|:---:|:---:|:---:|
| React Server Components | ✅ nativo | parcial | ✗ |
| App Router + file-based routing | ✅ maduro | ✅ | ✅ |
| Turbopack (bundler default) | ✅ | ✗ | ✗ |
| Soporte Vercel mad1 | ✅ native | ✅ | ✅ |
| Comunidad + docs ES | ✅ mayor | buena | buena |
| shadcn/ui + Radix UI | ✅ primera clase | parcial | diferente |
| Supabase Auth SSR | ✅ `@supabase/ssr` | ✅ | ✅ |

Turborepo sobre Nx: menor configuración, Remote Cache en Vercel gratis, curva baja para 1 dev.

## Consecuencias

- `proxy.ts` en lugar de `middleware.ts` desde el inicio (Next.js 16 lo depreca).
- `params` y `cookies()` async obligatorio — escribir código async desde el primer commit.
- `revalidateTag(tag, 'max')` requiere segundo argumento.
- `NEXT_TELEMETRY_DISABLED=1` en CI para builds reproducibles.

## Alternativas descartadas

- **Remix**: ecosistema más pequeño, shadcn menos integrado.
- **SvelteKit**: no React, reaprendizaje alto para el stack actual.
- **Next.js 15.x**: descartado por el operador — arrancar en 16 evita deuda de migración inmediata.
