# Phase 2: Design System - Context

**Gathered:** 2026-04-07 (assumptions mode, auto)
**Status:** Ready for planning

<domain>
## Phase Boundary

Sistema de diseno completo: tokens oklch por Kit, tipografia Geist, Tailwind v4 CSS-first preset y 15+ componentes shadcn/ui exportables como `@repo/ui`, testados en dark mode con contraste WCAG AA. Selector `[data-kit="x"]` cambia tema visualmente.

</domain>

<decisions>
## Implementation Decisions

### Token Architecture y CSS Variables
- **D-01:** Tailwind v4 CSS-first — NO `tailwind.config.ts`. Configuracion via `@theme inline` en CSS. Cada app importa el CSS base de `packages/brand/`.
- **D-02:** `packages/brand/src/tokens.ts` sigue siendo fuente de verdad TypeScript. Adicionalmente, crear `packages/brand/styles/globals.css` con `:root` vars y `[data-kit="x"]` overrides. Mantener manualmente sincronizados (sin script de generacion por ahora — solo 3 kits).
- **D-03:** Todos los 31 tokens semanticos de shadcn/ui (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring, card, popover, chart-1..5, sidebar-*, radius) definidos en oklch bajo `:root` y overrideados por `[data-kit="stagekit|lexkit|gestkit"]`.
- **D-04:** Dark mode como default (dark-first). Light mode via `.light` class para futuro. Custom variant: `@custom-variant dark (&:where(.dark, .dark *));`

### Tailwind v4 Preset Location
- **D-05:** El CSS base de Tailwind vive en `packages/brand/styles/globals.css`, NO en `packages/config/`. Brand es el owner de identidad visual y tokens. Cada app importa este CSS en su layout.
- **D-06:** Usar `@tailwindcss/postcss` como plugin de PostCSS en cada app Next.js. No usar `@tailwindcss/vite`.

### shadcn/ui en Monorepo
- **D-07:** Inicializar shadcn/ui en `packages/ui/` con `components.json` monorepo — style: "default", iconLibrary: "lucide", baseColor: "neutral", cssVariables: true, `tailwind.config: ""` (vacio, Tailwind v4).
- **D-08:** Aliases en components.json: `@repo/ui/components`, `@repo/ui/lib/utils`, `@repo/ui/hooks`.
- **D-09:** Usar `tw-animate-css` (no `tailwindcss-animate`, deprecado en v4).
- **D-10:** 15 componentes minimo: Button, Card, Input, Badge, Dialog, Sheet, Tabs, Table, Avatar, DropdownMenu, Toast (Sonner), Form, Label, Separator, Skeleton.
- **D-11:** Dependencias a instalar en @repo/ui: tailwindcss, @radix-ui/*, class-variance-authority, clsx, tailwind-merge, lucide-react, tw-animate-css.

### Font Loading
- **D-12:** `next/font` NO se puede exportar desde un package compartido (bug Next.js #51476 abierto). Cada app carga Geist via `next/font/local` en su `layout.tsx`.
- **D-13:** Font files (.woff2) viven en `packages/brand/fonts/` como ubicacion centralizada. Cada app referencia via path relativo o copia en build.
- **D-14:** CSS variables estandarizadas: `--font-geist-sans`, `--font-geist-mono`. `@repo/ui` referencia fonts solo via CSS variables en `@theme inline { --font-sans: var(--font-geist-sans); }`.

### Rate Limiting (prep)
- **D-15:** Crear `packages/config/src/ratelimit.ts` con Upstash setup basico (se usara en Phase 6/7). Solo el scaffold, no la implementacion completa.

### Claude's Discretion
- Estructura exacta de directorios dentro de packages/ui/src/components/
- Orden de instalacion de los 15 componentes
- Valores exactos oklch para los 31 tokens (reconciliar tokens.ts con docs/02-design-system.md)
- Configuracion de PostCSS por app
- Whether to use `next/font/local` vs `next/font/google` para Geist (local preferido por control)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System Spec
- `docs/02-design-system.md` — Spec completa: tokens oklch, tipografia, shadcn config, dark mode
- `docs/01-stack-arquitectura.md` — Stack decisions y architecture constraints

### Brand Rules
- `packages/brand/CLAUDE.md` — Rules: oklch mandatory, dark-first, no hardcoded colors
- `packages/brand/src/tokens.ts` — Current oklch token values (need reconciliation with spec)
- `packages/brand/src/fonts.ts` — Font metadata (variable names, display strategy)

### UI Rules
- `packages/ui/CLAUDE.md` — Rules: shadcn variants first, lucide only, Dialog/Drawer, CVA, WCAG AA

### Research
- `.planning/research/STACK.md` — Tailwind v4 CSS-first config, shadcn/ui compat notes
- `.planning/research/ARCHITECTURE.md` — data-kit selector pattern, globals.css reference
- `.planning/research/PITFALLS.md` — CM-07: shadcn/Tailwind v4 compat risk (RESOLVED: full support confirmed)

### External Sources (verified 2026-04-07)
- shadcn/ui Tailwind v4 docs — Full compatibility confirmed, tw-animate-css migration
- shadcn/ui Monorepo docs — Official monorepo pattern with components.json per workspace
- Tailwind CSS v4 @theme inline docs — CSS variable runtime resolution pattern
- Next.js #51476 — next/font export from library bug (open, blocks shared font package)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `packages/brand/src/tokens.ts` — oklch tokens for Alexendros core + 3 kits (stagekit, lexkit, gestkit). Values need reconciliation with docs/02-design-system.md.
- `packages/brand/src/fonts.ts` — Font metadata ready (variable names, display: swap). No actual font loading.
- `packages/brand/src/index.ts` — Clean barrel export (tokens + fonts).
- `packages/config/tsconfig.library.json` — Ready for new packages to extend.

### Established Patterns
- TypeScript strict everywhere (tsconfig.base.json: strict: true, noUncheckedIndexedAccess)
- ESLint flat config with no-explicit-any: error
- Package exports via package.json "exports" field (not index barrel only)
- pnpm workspace with `workspace:*` references

### Integration Points
- Each app's `layout.tsx` — will add font loading + globals.css import
- Each app's `postcss.config.mjs` — will add @tailwindcss/postcss
- `packages/ui/package.json` — needs shadcn dependencies added
- `packages/ui/src/index.ts` — will become barrel export of all 15+ components

</code_context>

<specifics>
## Specific Ideas

- oklch color space for perceptual uniformity across Kit themes
- data-slot attribute on shadcn primitives enables CSS-based styling hooks
- Geist is a variable font (single .woff2 per variant) — minimal perf impact even without next/font optimization
- `@theme inline` keyword is critical — ensures CSS variables resolve at runtime, not definition time

</specifics>

<deferred>
## Deferred Ideas

- Storybook / component playground — not in Phase 2 scope (could be Phase 2.5)
- Light mode theme — dark-first, light mode deferred post-MVP
- Custom shadcn variants beyond the 15 base components — add as needed in Phase 3/6/7
- Font subsetting for non-Latin characters — post-MVP optimization
- tokens.ts auto-generation of CSS from TypeScript — implement if drift becomes a problem

</deferred>

---

*Phase: 02-design-system*
*Context gathered: 2026-04-07*
