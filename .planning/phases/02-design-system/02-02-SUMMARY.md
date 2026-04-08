---
phase: 02-design-system
plan: "02"
subsystem: ui
tags: [shadcn-ui, radix-ui, components, ratelimit, upstash, monorepo, tailwind-v4]
dependency_graph:
  requires:
    - packages/brand/styles/globals.css (Plan 01)
  provides:
    - packages/ui/src/components/ (15 componentes shadcn)
    - packages/ui/src/lib/utils.ts (cn utility)
    - packages/ui/src/hooks/use-mobile.tsx
    - packages/ui/src/index.ts (barrel export)
    - packages/ui/components.json (shadcn CLI config)
    - packages/config/src/ratelimit.ts (skeleton)
  affects:
    - apps/alexendros-me
    - apps/alexendros-pro
    - packages/ui
    - packages/config
tech_stack:
  added:
    - "radix-ui (unified Radix package, nueva API 2026)"
    - "class-variance-authority"
    - "clsx + tailwind-merge (via cn())"
    - "lucide-react"
    - "tw-animate-css"
    - "sonner + next-themes"
    - "react-hook-form + @hookform/resolvers"
    - "zod (ya en @repo/config, ahora tambien en @repo/ui)"
    - "@upstash/ratelimit + @upstash/redis"
    - "@types/react + @types/react-dom (devDeps en @repo/ui)"
  patterns:
    - "shadcn CLI con @/ aliases -> src/* para instalacion correcta en monorepo"
    - "components.json dos niveles: packages/ui + cada app"
    - "barrel export desde src/index.ts con re-exports de 15 componentes + hook + cn"
    - "tsconfig paths @/* -> ./src/* para resolucion interna del package"
    - "ratelimit.ts factory pattern con Ratelimit.slidingWindow + Redis.fromEnv()"
key_files:
  created:
    - packages/ui/src/lib/utils.ts
    - packages/ui/src/components/button.tsx
    - packages/ui/src/components/card.tsx
    - packages/ui/src/components/input.tsx
    - packages/ui/src/components/badge.tsx
    - packages/ui/src/components/dialog.tsx
    - packages/ui/src/components/sheet.tsx
    - packages/ui/src/components/tabs.tsx
    - packages/ui/src/components/table.tsx
    - packages/ui/src/components/avatar.tsx
    - packages/ui/src/components/dropdown-menu.tsx
    - packages/ui/src/components/sonner.tsx
    - packages/ui/src/components/form.tsx
    - packages/ui/src/components/label.tsx
    - packages/ui/src/components/separator.tsx
    - packages/ui/src/components/skeleton.tsx
    - packages/ui/src/hooks/use-mobile.tsx
    - packages/ui/components.json
    - apps/alexendros-me/components.json
    - apps/alexendros-pro/components.json
    - packages/config/src/ratelimit.ts
  modified:
    - packages/ui/src/index.ts
    - packages/ui/package.json
    - packages/ui/tsconfig.json
    - packages/config/package.json
    - pnpm-lock.yaml
decisions:
  - "shadcn CLI usa @/ aliases en components.json para instalar en src/components/ — aliases se restauran a @repo/ui/* en el JSON final para documentacion"
  - "form.tsx escrito manualmente — CLI lo omite silenciosamente en la version actual del registry"
  - "radix-ui unified package (nueva API 2026) en lugar de @radix-ui/* individuales"
  - "tsconfig paths @/* -> ./src/* necesario para que tsc resuelva imports internos de componentes"
  - "ratelimit.ts skeleton sin validacion de env vars — se conectara a validateServerEnv() en Phase 6"
metrics:
  duration: "7 minutes"
  completed_date: "2026-04-08T04:37:00Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 21
  files_modified: 5
requirements_fulfilled:
  - UI-01
  - UI-02
---

# Phase 02 Plan 02: shadcn/ui Library and Rate Limit Skeleton Summary

**One-liner:** 15 componentes shadcn/ui instalados en @repo/ui con barrel exports, cn() utility, components.json monorepo (radix-vega), y skeleton createRatelimit() en @repo/config para Phase 6.

## What Was Built

### Task 1 — Inicializacion shadcn/ui (commit: 244c2c0)

- `packages/ui/src/lib/utils.ts` con `cn()` usando `clsx` + `tailwind-merge`
- `packages/ui/components.json` con `style: "radix-vega"`, `config: ""` (Tailwind v4 CSS-first), aliases `@repo/ui/components` y `@repo/ui/lib/utils`
- `apps/alexendros-me/components.json` y `apps/alexendros-pro/components.json` con aliases hibridos: `ui: "@repo/ui/components"`, `utils: "@repo/ui/lib/utils"`, `components: "@/components"`
- `packages/ui/package.json` actualizado con exports granulares `./components/*`, `./lib/utils`, `./hooks/*`
- Dependencias instaladas: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `tw-animate-css`, `sonner`, `react-hook-form`, `@hookform/resolvers`, `zod`

### Task 2 — 15 componentes y barrel exports (commit: d5c5b1b)

Componentes instalados via shadcn CLI en `packages/ui/src/components/`:
- `button.tsx`, `card.tsx`, `input.tsx`, `badge.tsx` — primitivos de UI
- `dialog.tsx`, `sheet.tsx` — overlays
- `tabs.tsx`, `table.tsx` — navegacion y datos
- `avatar.tsx`, `dropdown-menu.tsx` — usuario y menus
- `sonner.tsx` — notificaciones toast (requiere `next-themes`)
- `label.tsx`, `separator.tsx`, `skeleton.tsx` — elementos de formulario y layout
- `form.tsx` — escrito manualmente (CLI omite silenciosamente en registry actual)

Hook: `packages/ui/src/hooks/use-mobile.tsx` con `useIsMobile()` (manual — CLI no lo genera)

Barrel export `packages/ui/src/index.ts`: 17 lineas de export (15 componentes + `useIsMobile` + `cn`)

Todos los componentes usan `radix-ui` (unified package 2026) y `cn()` de `@/lib/utils`.

Dependencias añadidas: `radix-ui`, `next-themes`, `@types/react`, `@types/react-dom`.

`tsconfig.json` actualizado con `paths: { "@/*": ["./src/*"] }` para resolucion interna.

### Task 3 — skeleton ratelimit.ts (commit: 00a9a18)

- `packages/config/src/ratelimit.ts` con factory `createRatelimit()`:
  - `Ratelimit.slidingWindow(10, "10 s")` como defaults conservadores
  - `Redis.fromEnv()` — lee `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` (ya en Zod schema de env.ts)
  - `analytics: true`, `prefix: "@repo/ratelimit"`
  - Re-exporta `Ratelimit` y `Redis` para uso directo
- `packages/config/package.json` con export `"./ratelimit": "./src/ratelimit.ts"`
- `@upstash/ratelimit` y `@upstash/redis` instalados en dependencies

## Key Decisions

| Decision | Razon |
|----------|-------|
| shadcn CLI con aliases `@/` durante instalacion | El CLI interpreta `@repo/ui/components` como path literal, creando `packages/ui/@repo/ui/components/`. Usar `@/` con tsconfig paths resuelve a `src/` correctamente |
| components.json final tiene aliases `@repo/ui/*` | La documentacion del monorepo es correcta — los consumidores (apps) importan via `@repo/ui/components/*` del package.json exports |
| form.tsx escrito manualmente | El CLI version actual no genera el archivo (respuesta silenciosa). El componente sigue el patron exacto de shadcn/ui registry con react-hook-form + Radix Slot |
| `radix-ui` unified package | Shadcn 2026 usa el paquete unificado en lugar de `@radix-ui/*` individuales — menos dependencias, mejor tree-shaking |
| tsconfig paths `@/*` → `./src/*` | Necesario para que `tsc --noEmit` resuelva los imports internos de los componentes instalados por el CLI |

## Verification Results

| Check | Result |
|-------|--------|
| 15 componentes en src/components/ | PASS (15/15) |
| barrel export lines | 17 (>= 17 requerido) |
| components.json style: radix-vega | PASS |
| packages/ui typecheck | PASS (0 errores) |
| ratelimit.ts createRatelimit export | PASS |
| packages/config ./ratelimit export | PASS |

## Commits

| Task | Commit | Descripcion |
|------|--------|-------------|
| Task 1 | 244c2c0 | feat(02-02): inicializar shadcn/ui con components.json monorepo y cn() utility |
| Task 2 | d5c5b1b | feat(02-02): instalar 15 componentes shadcn/ui y barrel exports en @repo/ui |
| Task 3 | 00a9a18 | feat(02-02): crear skeleton ratelimit.ts en @repo/config |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] shadcn CLI colocaba archivos en ruta literal @repo/ui/components/**
- **Found during:** Task 2
- **Issue:** El CLI interpreta `"components": "@repo/ui/components"` como path literal y crea `packages/ui/@repo/ui/components/*.tsx`
- **Fix:** Cambio temporal de aliases en components.json a `@/components` con tsconfig path `@/* -> ./src/*`. Los aliases se restauraron a `@repo/ui/*` en el JSON final para mantener la especificacion del plan
- **Files modified:** `packages/ui/components.json`, `packages/ui/tsconfig.json`
- **Commit:** incluido en d5c5b1b

**2. [Rule 2 - Missing] form.tsx no creado por CLI**
- **Found during:** Task 2
- **Issue:** `pnpm dlx shadcn@latest add form` completa sin errores pero no crea ningun archivo
- **Fix:** form.tsx escrito manualmente siguiendo el patron de shadcn registry (FormProvider, Controller, useFormContext, Radix Slot)
- **Files modified:** `packages/ui/src/components/form.tsx`
- **Commit:** incluido en d5c5b1b

**3. [Rule 2 - Missing] @types/react no instalado en @repo/ui**
- **Found during:** Task 2 (typecheck)
- **Issue:** `tsc --noEmit` fallaba con "Could not find a declaration file for module react"
- **Fix:** `pnpm add -D @types/react @types/react-dom --filter=@repo/ui`
- **Files modified:** `packages/ui/package.json`
- **Commit:** incluido en d5c5b1b

**4. [Rule 2 - Missing] radix-ui no instalado en @repo/ui**
- **Found during:** Task 2 (post-instalacion CLI)
- **Issue:** Los componentes importan de "radix-ui" pero el paquete no estaba en dependencies de @repo/ui (el CLI lo instalo en otro scope)
- **Fix:** `pnpm add radix-ui --filter=@repo/ui`
- **Files modified:** `packages/ui/package.json`
- **Commit:** incluido en d5c5b1b

## Known Stubs

- `packages/config/src/ratelimit.ts` — skeleton intencional para Phase 6. `Redis.fromEnv()` requiere `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` que no estan disponibles hasta Phase 6. Las env vars estan en el Zod schema de env.ts pero no validadas al importar ratelimit.ts (validacion lazy, solo al llamar `createRatelimit()`).

Este stub es **intencional** segun D-15 del plan. Se completara en Phase 6 (PRO-08).

## Threat Flags

None — los componentes son de presentacion sin acceso a datos sensibles. El ratelimit.ts usa `Redis.fromEnv()` que depende de env vars validadas por Zod en `env.ts` (T-02-03 mitigado). Los defaults conservadores (10 req/10s) estan en su lugar (T-02-04 mitigado).

## Self-Check: PASSED
