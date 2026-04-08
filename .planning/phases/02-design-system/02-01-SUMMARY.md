---
phase: 02-design-system
plan: "01"
subsystem: brand
tags: [design-system, tokens, oklch, tailwind-v4, typography, geist, postcss]
dependency_graph:
  requires: []
  provides:
    - packages/brand/styles/globals.css
    - packages/brand/fonts/GeistVF.woff2
    - packages/brand/fonts/GeistMonoVF.woff2
    - packages/brand/src/tokens.ts (semanticTokens)
    - apps/alexendros-me PostCSS + globals.css + layout
    - apps/alexendros-pro PostCSS + globals.css + layout
  affects:
    - apps/alexendros-me
    - apps/alexendros-pro
    - packages/brand
tech_stack:
  added:
    - "@tailwindcss/postcss"
    - "geist (devDependency en @repo/brand)"
  patterns:
    - "Tailwind v4 CSS-first via @theme inline — sin tailwind.config.ts"
    - "oklch color system con dark-first theming"
    - "data-kit attribute para per-Kit token overrides"
    - "next/font/local con variable fonts .woff2 en cada app"
key_files:
  created:
    - packages/brand/styles/globals.css
    - packages/brand/fonts/GeistVF.woff2
    - packages/brand/fonts/GeistMonoVF.woff2
    - apps/alexendros-me/app/globals.css
    - apps/alexendros-me/postcss.config.mjs
    - apps/alexendros-pro/app/globals.css
    - apps/alexendros-pro/postcss.config.mjs
  modified:
    - packages/brand/src/tokens.ts
    - packages/brand/src/index.ts
    - packages/brand/package.json
    - apps/alexendros-me/app/layout.tsx
    - apps/alexendros-pro/app/layout.tsx
    - apps/alexendros-me/package.json
    - apps/alexendros-pro/package.json
decisions:
  - "Geist variable fonts copiados de geist npm package a packages/brand/fonts/ — geist queda como devDependency para actualizaciones futuras"
  - "globals.css de cada app son 2 lineas exactas (@import brand + @source ui) — todo el theming vive en packages/brand"
  - "data-kit=stagekit en ambas apps como default — StageKit es el tema principal de alexendros"
metrics:
  duration: "3 minutes"
  completed_date: "2026-04-08T04:28:18Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 7
  files_modified: 7
requirements_fulfilled:
  - BRAND-01
  - BRAND-02
  - BRAND-03
  - BRAND-04
---

# Phase 02 Plan 01: Design System Base — Tokens oklch, Tipografia Geist y Tailwind v4 Summary

**One-liner:** Tokens oklch en CSS custom properties y TypeScript con Geist variable fonts, @theme inline Tailwind v4 CSS-first, y PostCSS configurado en ambas apps Next.js.

## What Was Built

### Task 1 — globals.css con tokens oklch y tokens.ts reconciliado (commit: 53f6a26)

Se creo `packages/brand/styles/globals.css` como fuente de verdad CSS del sistema de diseno:

- `@import "tailwindcss"` + `@import "tw-animate-css"` + `@import "shadcn/tailwind.css"`
- `@custom-variant dark (&:where(.dark, .dark *))` para dark-first theming class-based
- `@theme inline { ... }` con 31 mappings `--color-*` que resuelven las CSS custom properties en runtime (sin tailwind.config.ts)
- `:root { ... }` con 31 tokens oklch del tema dark-acid/StageKit default
- `[data-kit="lexkit"]` y `[data-kit="gestkit"]` con overrides de color (primary, accent, ring, chart-1/2, sidebar-primary/ring)
- `@layer base` con `border-border` y `bg-background` en body

`packages/brand/src/tokens.ts` fue reconciliado para que los valores oklch de TypeScript sean identicos a los de globals.css. Se añadio el export `semanticTokens` con las tres variantes (stagekit, lexkit, gestkit).

`packages/brand/package.json` actualizado con export `"./styles/globals.css": "./styles/globals.css"`.

### Task 2 — Tipografia Geist y PostCSS en apps (commit: b6249db)

- `packages/brand/fonts/GeistVF.woff2` (68K) y `GeistMonoVF.woff2` (70K) extraidos del paquete npm `geist@1.7.0`
- `apps/alexendros-me/postcss.config.mjs` y `apps/alexendros-pro/postcss.config.mjs` con `@tailwindcss/postcss` (Tailwind v4 PostCSS plugin)
- `apps/alexendros-me/app/globals.css` y `apps/alexendros-pro/app/globals.css`: 2 lineas (`@import brand/styles/globals.css` + `@source packages/ui/src`)
- `apps/alexendros-me/app/layout.tsx` y `apps/alexendros-pro/app/layout.tsx`: `next/font/local` con `GeistVF.woff2` y `GeistMonoVF.woff2`, `className="dark ${geistSans.variable} ${geistMono.variable}"`, `data-kit="stagekit"`

## Key Decisions

| Decision | Razon |
|----------|-------|
| Geist como devDep en @repo/brand | Permite actualizaciones futuras con `pnpm update geist`; .woff2 commiteados para que las apps no dependan de node_modules en build |
| globals.css de app = 2 lineas | Toda la complejidad CSS vive en packages/brand — las apps son thin consumers |
| data-kit="stagekit" como default | StageKit es el producto principal; el sistema soporta lexkit/gestkit via CSS override sin JS |
| next/font/local en cada layout | Per D-12 y bug Next.js #51476: fuentes NO se exportan desde package compartido |
| @source directive apunta a packages/ui/src | Tailwind v4 necesita escanear el source de componentes compartidos para incluir sus clases en el build |

## Verification Results

| Check | Result |
|-------|--------|
| `grep -c "@theme inline" globals.css` | 1 |
| `grep -c "data-kit" globals.css` | 2 (lexkit + gestkit) |
| `grep -c "oklch" globals.css` | 50 (>= 50 requerido) |
| `test -f GeistVF.woff2` | PASS |
| `test -f GeistMonoVF.woff2` | PASS |
| `grep "localFont" me/layout.tsx` | PASS |
| `grep @source me/globals.css` | PASS |
| `find -name tailwind.config.ts` | 0 encontrados |

## Commits

| Task | Commit | Descripcion |
|------|--------|-------------|
| Task 1 | 53f6a26 | feat(02-01): crear globals.css con tokens oklch y reconciliar tokens.ts |
| Task 2 | b6249db | feat(02-01): configurar tipografia Geist y PostCSS en apps |

## Deviations from Plan

None — plan ejecutado exactamente como estaba escrito.

Los valores exactos de globals.css y tokens.ts coinciden con la especificacion del plan al 100%.

## Known Stubs

None — no hay stubs. `packages/brand/styles/globals.css` define todos los tokens con valores oklch reales. Las apps estan completamente cableadas.

## Threat Flags

None — los archivos modificados son tokens CSS publicos y fuentes estaticas. No se introdujeron nuevos endpoints de red, rutas de auth ni acceso a filesystem de produccion.

## Self-Check: PASSED

All created files found on disk. Both commits (53f6a26, b6249db) verified in git log.
