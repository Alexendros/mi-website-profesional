# Phase 2: Design System - Research

**Researched:** 2026-04-07
**Domain:** Design system (tokens oklch, tipografia, Tailwind v4 CSS-first, shadcn/ui monorepo)
**Confidence:** HIGH

## Summary

Esta fase construye el sistema de diseno completo del monorepo: tokens de color oklch con theming por Kit via `[data-kit="x"]`, tipografia Geist variable via `next/font/local`, configuracion Tailwind v4 CSS-first (sin `tailwind.config.ts`), e inicializacion de shadcn/ui en `packages/ui/` con 15+ componentes exportables como `@repo/ui`. Todo dark-first con contraste WCAG AA verificado.

La arquitectura CSS ya esta definida en CONTEXT.md con 15 decisiones bloqueadas. Los hallazgos clave de esta investigacion son: (1) shadcn/ui ha renombrado los estilos -- "default" ahora es `radix-vega` en `components.json`, (2) Tailwind v4 requiere `@source` directives explicitas para escanear `packages/ui/` desde las apps, (3) la importacion `@import "shadcn/tailwind.css"` es obligatoria para Tailwind v4, y (4) el paquete `shadcn` (no `shadcn-ui`) es la dependencia CLI correcta.

**Recomendacion principal:** Seguir estrictamente el patron oficial de monorepo de shadcn/ui con `components.json` en ambos niveles (`packages/ui/` y cada app), usar `@source` directives para Tailwind v4, y definir los 31 tokens semanticos en oklch bajo `:root` (dark-first) con overrides `[data-kit="x"]` en `packages/brand/styles/globals.css`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Tailwind v4 CSS-first -- NO `tailwind.config.ts`. Configuracion via `@theme inline` en CSS. Cada app importa el CSS base de `packages/brand/`.
- **D-02:** `packages/brand/src/tokens.ts` sigue siendo fuente de verdad TypeScript. Adicionalmente, crear `packages/brand/styles/globals.css` con `:root` vars y `[data-kit="x"]` overrides. Mantener manualmente sincronizados (sin script de generacion por ahora -- solo 3 kits).
- **D-03:** Todos los 31 tokens semanticos de shadcn/ui (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring, card, popover, chart-1..5, sidebar-*, radius) definidos en oklch bajo `:root` y overrideados por `[data-kit="stagekit|lexkit|gestkit"]`.
- **D-04:** Dark mode como default (dark-first). Light mode via `.light` class para futuro. Custom variant: `@custom-variant dark (&:where(.dark, .dark *));`
- **D-05:** El CSS base de Tailwind vive en `packages/brand/styles/globals.css`, NO en `packages/config/`. Brand es el owner de identidad visual y tokens.
- **D-06:** Usar `@tailwindcss/postcss` como plugin de PostCSS en cada app Next.js. No usar `@tailwindcss/vite`.
- **D-07:** Inicializar shadcn/ui en `packages/ui/` con `components.json` monorepo -- style: "default", iconLibrary: "lucide", baseColor: "neutral", cssVariables: true, `tailwind.config: ""` (vacio, Tailwind v4).
- **D-08:** Aliases en components.json: `@repo/ui/components`, `@repo/ui/lib/utils`, `@repo/ui/hooks`.
- **D-09:** Usar `tw-animate-css` (no `tailwindcss-animate`, deprecado en v4).
- **D-10:** 15 componentes minimo: Button, Card, Input, Badge, Dialog, Sheet, Tabs, Table, Avatar, DropdownMenu, Toast (Sonner), Form, Label, Separator, Skeleton.
- **D-11:** Dependencias a instalar en @repo/ui: tailwindcss, @radix-ui/*, class-variance-authority, clsx, tailwind-merge, lucide-react, tw-animate-css.
- **D-12:** `next/font` NO se puede exportar desde un package compartido (bug Next.js #51476 abierto). Cada app carga Geist via `next/font/local` en su `layout.tsx`.
- **D-13:** Font files (.woff2) viven en `packages/brand/fonts/` como ubicacion centralizada. Cada app referencia via path relativo o copia en build.
- **D-14:** CSS variables estandarizadas: `--font-geist-sans`, `--font-geist-mono`. `@repo/ui` referencia fonts solo via CSS variables en `@theme inline { --font-sans: var(--font-geist-sans); }`.
- **D-15:** Crear `packages/config/src/ratelimit.ts` con Upstash setup basico (se usara en Phase 6/7). Solo el scaffold, no la implementacion completa.

### Claude's Discretion
- Estructura exacta de directorios dentro de packages/ui/src/components/
- Orden de instalacion de los 15 componentes
- Valores exactos oklch para los 31 tokens (reconciliar tokens.ts con docs/02-design-system.md)
- Configuracion de PostCSS por app
- Whether to use `next/font/local` vs `next/font/google` para Geist (local preferido por control)

### Deferred Ideas (OUT OF SCOPE)
- Storybook / component playground -- not in Phase 2 scope (could be Phase 2.5)
- Light mode theme -- dark-first, light mode deferred post-MVP
- Custom shadcn variants beyond the 15 base components -- add as needed in Phase 3/6/7
- Font subsetting for non-Latin characters -- post-MVP optimization
- tokens.ts auto-generation of CSS from TypeScript -- implement if drift becomes a problem
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BRAND-01 | Tokens oklch en packages/brand (dark-acid, legal-navy, gestoria-slate) | tokens.ts ya existe con estructura base; necesita reconciliacion con docs/02-design-system.md y expansion a los 31 tokens semanticos shadcn. globals.css con :root y [data-kit] overrides es la salida principal. |
| BRAND-02 | Geist + Geist Mono via next/font con display: swap | next/font/local en cada app layout.tsx; .woff2 en packages/brand/fonts/; CSS vars --font-geist-sans/--font-geist-mono; @theme inline para mapear --font-sans |
| BRAND-03 | Tailwind v4 preset consumiendo tokens de packages/brand | globals.css con @import "tailwindcss", @import "tw-animate-css", @import "shadcn/tailwind.css", @theme inline, @source directives. PostCSS config por app. |
| BRAND-04 | CSS custom properties con [data-kit="x"] para theming por Kit | :root define default (stagekit/dark-acid), [data-kit="lexkit"] y [data-kit="gestkit"] overridean tokens relevantes. Cada app pone data-kit en <html>. |
| UI-01 | shadcn/ui inicializado con 15+ componentes | shadcn CLI con --monorepo, components.json en packages/ui/ y apps/, style "radix-vega" (not "default"), 15 componentes via `pnpm dlx shadcn@latest add` |
| UI-02 | Exportable como @repo/ui, consumible por todas las apps | Barrel exports en packages/ui/src/index.ts + package.json "exports" field con paths granulares; @source directive en cada app CSS para scan |
| UI-03 | Dark mode verificado con contraste WCAG AA | oklch tokens con L>=0.95 para foreground sobre L<=0.15 background garantizan ratio >15:1. Verificar con OddContrast o Atmos Style. |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- TypeScript `strict: true`. Prohibido `any`.
- Server Components por defecto. `"use client"` solo para interactividad browser.
- Nunca secretos en codigo. `.env.local` + validacion Zod.
- Commits: nunca a `main` directo. Feature branch + PR siempre.
- No hardcodear colores fuera de packages/brand/tokens.ts.
- No crear componentes en apps/ que deberian estar en packages/ui/.
- No instalar librerias UI alternativas a shadcn sin consultar.
- Importar siempre desde `@repo/config/env`, nunca `process.env` directo.
- Stack global: Next.js 15 App Router (actualizar a 16), Tailwind CSS v4, shadcn/ui, Radix UI.
- pnpm como package manager (pnpm@10.33.0 confirmado en root package.json).

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.2.2 | CSS utility framework | CSS-first config, oklch nativo, @theme inline [VERIFIED: npm registry] |
| @tailwindcss/postcss | 4.2.2 | PostCSS plugin para Tailwind v4 | Requerido por D-06 para apps Next.js [VERIFIED: npm registry] |
| shadcn | 4.2.0 | CLI para instalar componentes shadcn/ui | CLI oficial, soporta monorepo y Tailwind v4 [VERIFIED: npm registry] |
| tw-animate-css | 1.4.0 | Animaciones CSS para shadcn/ui | Reemplaza tailwindcss-animate deprecado en v4 (D-09) [VERIFIED: npm registry] |
| class-variance-authority | 0.7.1 | Gestion de variantes de componentes | Standard para shadcn/ui, CVA pattern [VERIFIED: npm registry] |
| clsx | 2.1.1 | Construccion condicional de classNames | Usado por cn() utility [VERIFIED: npm registry] |
| tailwind-merge | 3.5.0 | Merge inteligente de clases Tailwind | Resuelve conflictos de clases duplicadas [VERIFIED: npm registry] |
| lucide-react | 1.7.0 | Iconos SVG | Icon library oficial de shadcn/ui (D-11) [VERIFIED: npm registry] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sonner | 2.0.7 | Toast notifications | Componente Toast de shadcn/ui usa Sonner (D-10) [VERIFIED: npm registry] |
| react-hook-form | 7.72.1 | Form management | Componente Form de shadcn/ui lo requiere [VERIFIED: npm registry] |
| @hookform/resolvers | 5.2.2 | Zod resolver para RHF | Validacion de forms con Zod [VERIFIED: npm registry] |
| zod | 4.3.6 | Schema validation | Ya en uso en env.ts; forms lo requieren [VERIFIED: npm registry] |
| geist | 1.7.0 | Font files .woff2 | Fuente de archivos Geist Sans + Mono [VERIFIED: npm registry] |
| @upstash/ratelimit | 2.0.8 | Rate limiting (skeleton D-15) | Solo scaffold en esta fase [VERIFIED: npm registry] |
| @upstash/redis | 1.37.0 | Redis client para Upstash (skeleton D-15) | Solo scaffold en esta fase [VERIFIED: npm registry] |

### Radix UI Primitives (instaladas via shadcn CLI)

| Library | Version | Component |
|---------|---------|-----------|
| @radix-ui/react-dialog | 1.1.15 | Dialog [VERIFIED: npm registry] |
| @radix-ui/react-dropdown-menu | 2.1.16 | DropdownMenu [VERIFIED: npm registry] |
| @radix-ui/react-tabs | 1.1.13 | Tabs [VERIFIED: npm registry] |
| @radix-ui/react-avatar | 1.1.11 | Avatar [VERIFIED: npm registry] |
| @radix-ui/react-label | 2.1.8 | Label [VERIFIED: npm registry] |
| @radix-ui/react-separator | 1.1.8 | Separator [VERIFIED: npm registry] |
| @radix-ui/react-slot | 1.2.4 | Slot (base de Button) [VERIFIED: npm registry] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next/font/local` | `next/font/google` | Google depende de CDN externo; local da control total y funciona con output: export. **Usar local.** |
| `geist` npm package | Descargar .woff2 de GitHub releases | npm package mas facil de actualizar. **Usar npm package y copiar .woff2 a packages/brand/fonts/.** |
| oklch manual | oklch via `color-mix()` | color-mix() anade complejidad sin beneficio para tokens fijos. **Usar oklch directo.** |

**Installation (packages/ui):**
```bash
pnpm add tailwindcss class-variance-authority clsx tailwind-merge lucide-react tw-animate-css sonner react-hook-form @hookform/resolvers zod
```

**Installation (cada app Next.js):**
```bash
pnpm add @tailwindcss/postcss -D
```

**Installation (packages/brand -- solo dev dependency para tipado):**
```bash
# No dependencies adicionales -- solo CSS y TS
```

## Architecture Patterns

### Recommended Project Structure

```
packages/
  brand/
    fonts/                    # .woff2 files (Geist Sans + Geist Mono)
      GeistVF.woff2
      GeistMonoVF.woff2
    styles/
      globals.css             # :root tokens, [data-kit] overrides, @theme inline
    src/
      tokens.ts               # TypeScript source of truth (oklch values)
      fonts.ts                # Font metadata (variable names, display strategy)
      index.ts                # Barrel export
    CLAUDE.md
    package.json

  ui/
    src/
      components/
        button.tsx
        card.tsx
        input.tsx
        badge.tsx
        dialog.tsx
        sheet.tsx
        tabs.tsx
        table.tsx
        avatar.tsx
        dropdown-menu.tsx
        toast.tsx              # Sonner wrapper
        form.tsx
        label.tsx
        separator.tsx
        skeleton.tsx
      hooks/
        use-mobile.tsx         # useMediaQuery para Dialog/Drawer responsive
      lib/
        utils.ts               # cn() function
      index.ts                 # Barrel export de todos los componentes
    components.json            # shadcn CLI config
    CLAUDE.md
    package.json

  config/
    src/
      env.ts                   # Ya existe
      ratelimit.ts             # Nuevo: skeleton Upstash (D-15)
    package.json

apps/
  alexendros-me/
    app/
      globals.css              # @import del CSS de brand + @source directive
      layout.tsx               # next/font/local Geist + className + data-kit
    components.json            # shadcn CLI config (apunta a packages/ui)
    postcss.config.mjs         # @tailwindcss/postcss
```

### Pattern 1: globals.css Architecture (Tailwind v4 + shadcn)

**What:** Archivo CSS central que combina imports de Tailwind, animaciones shadcn, tokens oklch y mapeo @theme inline.
**When to use:** En `packages/brand/styles/globals.css` -- importado por cada app.
**Example:**

```css
/* packages/brand/styles/globals.css */
/* Source: https://ui.shadcn.com/docs/installation/manual + https://tailwindcss.com/docs/theme */

@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:where(.dark, .dark *));

/* ============================================
   @theme inline: mapea CSS vars a Tailwind utilities
   Usa "inline" para que var() se resuelva en runtime
   ============================================ */
@theme inline {
  /* Colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Radius */
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);

  /* Fonts */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* ============================================
   :root — Default theme (StageKit / dark-acid)
   Dark-first: :root ES dark mode
   ============================================ */
:root {
  --radius: 0.5rem;

  /* Surfaces */
  --background: oklch(0.09 0.005 240);
  --foreground: oklch(0.95 0.005 240);
  --card: oklch(0.13 0.008 240);
  --card-foreground: oklch(0.95 0.005 240);
  --popover: oklch(0.13 0.008 240);
  --popover-foreground: oklch(0.95 0.005 240);

  /* Actions */
  --primary: oklch(0.72 0.22 142);
  --primary-foreground: oklch(0.09 0.005 240);
  --secondary: oklch(0.17 0.008 240);
  --secondary-foreground: oklch(0.95 0.005 240);
  --muted: oklch(0.17 0.008 240);
  --muted-foreground: oklch(0.65 0.01 240);
  --accent: oklch(0.65 0.18 55);
  --accent-foreground: oklch(0.09 0.005 240);
  --destructive: oklch(0.60 0.22 25);
  --destructive-foreground: oklch(0.95 0.005 240);

  /* Borders & rings */
  --border: oklch(0.22 0.01 240);
  --input: oklch(0.22 0.01 240);
  --ring: oklch(0.72 0.22 142);

  /* Chart */
  --chart-1: oklch(0.72 0.22 142);
  --chart-2: oklch(0.65 0.18 55);
  --chart-3: oklch(0.65 0.16 240);
  --chart-4: oklch(0.75 0.15 70);
  --chart-5: oklch(0.60 0.22 25);

  /* Sidebar */
  --sidebar: oklch(0.11 0.006 240);
  --sidebar-foreground: oklch(0.95 0.005 240);
  --sidebar-primary: oklch(0.72 0.22 142);
  --sidebar-primary-foreground: oklch(0.09 0.005 240);
  --sidebar-accent: oklch(0.17 0.008 240);
  --sidebar-accent-foreground: oklch(0.95 0.005 240);
  --sidebar-border: oklch(0.22 0.01 240);
  --sidebar-ring: oklch(0.72 0.22 142);
}

/* ============================================
   Kit overrides via [data-kit="x"]
   ============================================ */
[data-kit="lexkit"] {
  --primary: oklch(0.45 0.12 250);
  --primary-foreground: oklch(0.95 0.005 250);
  --accent: oklch(0.70 0.10 80);
  --accent-foreground: oklch(0.12 0.01 250);
  --ring: oklch(0.45 0.12 250);
  --chart-1: oklch(0.45 0.12 250);
  --chart-2: oklch(0.70 0.10 80);
  --sidebar-primary: oklch(0.45 0.12 250);
  --sidebar-ring: oklch(0.45 0.12 250);
}

[data-kit="gestkit"] {
  --primary: oklch(0.55 0.08 220);
  --primary-foreground: oklch(0.95 0.005 220);
  --accent: oklch(0.65 0.15 160);
  --accent-foreground: oklch(0.13 0.005 220);
  --ring: oklch(0.55 0.08 220);
  --chart-1: oklch(0.55 0.08 220);
  --chart-2: oklch(0.65 0.15 160);
  --sidebar-primary: oklch(0.55 0.08 220);
  --sidebar-ring: oklch(0.55 0.08 220);
}

/* ============================================
   Base layer
   ============================================ */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Pattern 2: App-level CSS import + @source

**What:** Cada app importa el globals.css de brand y anade `@source` directive para que Tailwind escanee `packages/ui/`.
**When to use:** En `apps/alexendros-me/app/globals.css` y equivalentes.
**Example:**

```css
/* apps/alexendros-me/app/globals.css */
/* Source: https://tailwindcss.com/docs/detecting-classes-in-source-files */

@import "../../packages/brand/styles/globals.css";
@source "../../packages/ui/src";
```

### Pattern 3: PostCSS config por app

**What:** Cada app Next.js necesita un `postcss.config.mjs` con `@tailwindcss/postcss`.
**When to use:** En cada app del monorepo.
**Example:**

```javascript
// apps/alexendros-me/postcss.config.mjs
// Source: https://tailwindcss.com/docs (Tailwind v4 PostCSS setup)

export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### Pattern 4: next/font/local en layout.tsx

**What:** Carga de Geist via next/font/local con CSS variables.
**When to use:** En `layout.tsx` de cada app.
**Example:**

```tsx
// apps/alexendros-me/app/layout.tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts

import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "../../packages/brand/fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../../packages/brand/fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      data-kit="stagekit"
    >
      <body>{children}</body>
    </html>
  );
}
```

### Pattern 5: cn() utility

**What:** Funcion estandar de merge de clases Tailwind.
**When to use:** En todos los componentes de `packages/ui/`.
**Example:**

```typescript
// packages/ui/src/lib/utils.ts
// Source: https://ui.shadcn.com/docs/installation/manual

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Pattern 6: components.json monorepo (dos niveles)

**What:** shadcn CLI necesita components.json en packages/ui/ Y en cada app.
**When to use:** Configuracion inicial.
**Example:**

```json
// packages/ui/components.json
// Source: https://ui.shadcn.com/docs/monorepo
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-vega",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/brand/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@repo/ui/components",
    "utils": "@repo/ui/lib/utils",
    "hooks": "@repo/ui/hooks",
    "lib": "@repo/ui/lib",
    "ui": "@repo/ui/components"
  }
}
```

```json
// apps/alexendros-me/components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-vega",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/brand/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@repo/ui/lib/utils",
    "ui": "@repo/ui/components"
  }
}
```

### Anti-Patterns to Avoid

- **tailwind.config.ts en Tailwind v4:** No existe. Toda configuracion va en CSS con `@theme`. Crear este archivo rompe la deteccion automatica de v4.
- **Hardcodear colores oklch en componentes:** Siempre usar `var(--token)`. Los componentes no deben conocer el valor oklch, solo el nombre semantico.
- **Exportar next/font desde package compartido:** Bug abierto #51476 en Next.js. Las fuentes deben cargarse en cada `layout.tsx` de app.
- **Usar @import sin @source en monorepo:** Tailwind v4 no escanea `node_modules` ni paquetes externos por defecto. Sin `@source "../../packages/ui/src"`, las clases de componentes UI no se generan.
- **`tailwindcss-animate` en v4:** Deprecado. Usar `tw-animate-css` con `@import "tw-animate-css"` en CSS.
- **Usar style "default" en components.json:** Renombrado a "radix-vega" en shadcn/ui 2026. El CLI puede no reconocer "default".

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class merging con conflictos | Custom className merger | `tailwind-merge` + `clsx` via `cn()` | tailwind-merge resuelve conflictos como `p-2 p-4` correctamente; un merger custom falla en edge cases (arbitrary values, responsive, dark) |
| Variantes de componentes | Props manuales con if/else | `class-variance-authority` (CVA) | CVA da type-safety, composabilidad y patterns consistentes en todos los componentes |
| Toast notifications | Custom toast system | `sonner` via shadcn Toast | Sonner maneja stacking, swipe-dismiss, promises, accesibilidad; reimplementar requiere meses |
| Animaciones de entrada/salida | CSS animations manuales | `tw-animate-css` | Preconfigured con shadcn; animaciones de Dialog, Sheet, DropdownMenu ya funcionan |
| Contrast checking runtime | Manual WCAG calculator | OddContrast.com / Atmos.style | Herramientas online que aceptan oklch y calculan WCAG 2 ratio instantaneamente |
| Dialog/Drawer responsive | Media query manual | shadcn Dialog + Drawer con `use-mobile` hook | Pattern oficial shadcn para Dialog desktop / Drawer mobile |

**Key insight:** shadcn/ui + Tailwind v4 es un sistema integrado. Cada pieza (CVA, cn(), @theme inline, tw-animate-css) existe para resolver un problema especifico. Sustituir cualquier pieza rompe la integracion.

## Common Pitfalls

### Pitfall 1: @source directive olvidada en apps del monorepo
**What goes wrong:** Los componentes de `packages/ui/` se importan correctamente en TypeScript, pero sus clases Tailwind no se generan. La UI aparece sin estilos.
**Why it happens:** Tailwind v4 auto-detecta clases solo en el directorio del proyecto, ignorando `node_modules` y paquetes externos. En un monorepo con workspaces, `packages/ui/` no se escanea automaticamente.
**How to avoid:** Anadir `@source "../../packages/ui/src";` en el CSS de cada app DESPUES del import de globals.css.
**Warning signs:** Componentes renderizan sin colores, sin spacing, sin border-radius. `pnpm turbo build` pasa pero la UI esta rota visualmente. [VERIFIED: https://tailwindcss.com/docs/detecting-classes-in-source-files]

### Pitfall 2: @theme sin "inline" para CSS variables
**What goes wrong:** Las clases utility como `bg-background` o `font-sans` no resuelven correctamente. Aplican valores literales como `var(--background)` pero el navegador no encuentra la variable en el contexto donde se definio.
**Why it happens:** `@theme` (sin inline) resuelve las variables en el momento de definicion del tema, no en runtime. Si la variable `:root` se define despues, el valor es undefined.
**How to avoid:** Siempre usar `@theme inline { ... }` cuando los valores son `var(--...)`. El keyword `inline` fuerza resolucion en runtime.
**Warning signs:** Clases Tailwind se generan correctamente en el CSS output, pero los colores no aparecen en el navegador. DevTools muestra `var(--background)` pero el computed value esta vacio. [VERIFIED: https://tailwindcss.com/docs/theme]

### Pitfall 3: Inconsistencia entre tokens.ts y globals.css
**What goes wrong:** Los valores oklch en `tokens.ts` divergen de los valores en `globals.css`. TypeScript types dicen un color, pero la UI muestra otro.
**Why it happens:** Decision D-02 mantiene sincronizacion manual (sin script de generacion). Con 3 kits x ~10 tokens por kit = 30+ valores, el drift es probable.
**How to avoid:** Al modificar un token, actualizar AMBOS archivos en el mismo commit. Considerar un test unitario que compare valores.
**Warning signs:** El color acid green en `tokens.ts` no coincide visualmente con la UI renderizada.

### Pitfall 4: dark mode variant incorrecto
**What goes wrong:** Los estilos dark mode no se aplican o se aplican donde no deben.
**Why it happens:** CONTEXT.md especifica `@custom-variant dark (&:where(.dark, .dark *));` pero el patron oficial de shadcn usa `@custom-variant dark (&:is(.dark *));`. La diferencia es que `:where()` tiene especificidad 0, mientras que `:is()` toma la especificidad del selector mas especifico.
**How to avoid:** Dado que el proyecto es dark-first (`:root` YA es dark), el custom variant solo se necesita para posible future light mode toggle. Usar el patron de CONTEXT.md con `:where()` para menor especificidad. Asegurarse de que `<html>` siempre tiene class `dark`.
**Warning signs:** Estilos `dark:` no se aplican; overrides inesperados de especificidad. [ASSUMED]

### Pitfall 5: shadcn style name cambiado
**What goes wrong:** `pnpm dlx shadcn@latest init` falla o instala componentes con estilos inesperados.
**Why it happens:** shadcn/ui reemplazo los nombres "default" y "new-york" con "radix-vega", "radix-nova", etc. en febrero 2026. El CLI actual (v4.2.0) puede no reconocer el nombre antiguo.
**How to avoid:** Usar `"style": "radix-vega"` en components.json. Radix-vega es equivalente al antiguo "new-york"/"default". [VERIFIED: https://www.shadcnblocks.com/blog/shadcn-component-styles-vega-nova-maia-lyra-mira/]

### Pitfall 6: next/font path relativo incorrecto con output: export
**What goes wrong:** Build falla con "Could not find font file" cuando `next build` intenta resolver el path relativo a packages/brand/fonts/.
**Why it happens:** `next/font/local` resuelve paths relativos al archivo donde se invoca. Con `output: "export"`, el build process puede cambiar el working directory.
**How to avoid:** Usar path relativo desde el layout.tsx: `../../packages/brand/fonts/GeistVF.woff2`. Verificar que el path sea correcto con `ls` antes de build. Si falla, copiar fonts al directorio `public/` de la app como fallback.
**Warning signs:** Build error "Module not found: Can't resolve" en font files. [ASSUMED]

## Code Examples

### Ejemplo completo: PostCSS config
```javascript
// apps/alexendros-me/postcss.config.mjs
// Source: Tailwind CSS v4 docs — PostCSS plugin

export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### Ejemplo completo: package.json exports para @repo/ui
```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*.tsx",
    "./lib/utils": "./src/lib/utils.ts",
    "./hooks/*": "./src/hooks/*.tsx"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwindcss": "^4.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.5.0",
    "lucide-react": "^1.7.0",
    "tw-animate-css": "^1.4.0",
    "sonner": "^2.0.7",
    "react-hook-form": "^7.72.0",
    "@hookform/resolvers": "^5.2.0",
    "zod": "^4.3.0"
  },
  "devDependencies": {
    "@repo/config": "workspace:*",
    "typescript": "^5.8.0"
  }
}
```

### Ejemplo completo: ratelimit.ts skeleton (D-15)
```typescript
// packages/config/src/ratelimit.ts
// Skeleton para Phase 6/7 — Upstash rate limiting

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiter factory.
 * Configurar UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN antes de usar.
 * Se activara en Phase 6 (PRO-08).
 */
export function createRatelimit(config?: {
  requests?: number;
  window?: `${number} ${"s" | "m" | "h" | "d"}`;
}) {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(
      config?.requests ?? 10,
      config?.window ?? "10 s",
    ),
    analytics: true,
    prefix: "@repo/ratelimit",
  });
}

export { Ratelimit, Redis };
```

### Ejemplo: Obtener .woff2 de Geist desde npm
```bash
# Instalar geist temporalmente para extraer los .woff2
pnpm add geist --filter=@repo/brand -D
# Copiar los archivos de variable font
mkdir -p packages/brand/fonts
cp node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2 packages/brand/fonts/GeistVF.woff2
cp node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2 packages/brand/fonts/GeistMonoVF.woff2
# Desinstalar si no se quiere como dependency permanente
pnpm remove geist --filter=@repo/brand
```

### Ejemplo: shadcn CLI add en monorepo
```bash
# Desde packages/ui/ (o directorio raiz apuntando al workspace)
cd packages/ui
pnpm dlx shadcn@latest add button card input badge dialog sheet tabs table avatar dropdown-menu label separator skeleton

# Sonner (toast) se instala aparte
pnpm dlx shadcn@latest add sonner

# Form (requiere react-hook-form + zod)
pnpm dlx shadcn@latest add form
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.ts` | CSS-first con `@theme` | Tailwind v4 (ene 2025) | No config file; todo en CSS |
| `tailwindcss-animate` | `tw-animate-css` | shadcn/ui Tailwind v4 update (2025) | CSS import en vez de plugin |
| `React.forwardRef` | Function components + `data-slot` | shadcn/ui 2025-2026 | Componentes mas simples sin HOC |
| shadcn style "default"/"new-york" | "radix-vega"/"radix-nova"/etc | Feb 2026 | 5 estilos x 2 libraries (radix/base) |
| `hsl()` en CSS vars shadcn | `oklch()` directo | shadcn/ui Tailwind v4 neutral preset | Colores mas uniformes perceptualmente |
| `@radix-ui/react-*` individual | `radix-ui` unified package | Feb 2026 | Ambos enfoques funcionan; CLI maneja la migracion |
| `content: [...]` en tailwind.config | `@source` directive en CSS | Tailwind v4 | Escaneo automatico + directives explicitas |

**Deprecated/outdated:**
- `tailwindcss-animate`: Reemplazado por `tw-animate-css` en Tailwind v4
- `tailwind.config.ts/js`: No existe en Tailwind v4 CSS-first
- `@layer base { :root { ... } }`: En v4, `:root` va FUERA de `@layer base`
- shadcn style "default": Renombrado a "radix-vega"
- `@supabase/auth-helpers-nextjs`: Usar `@supabase/ssr`

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | El dark mode custom variant `(&:where(.dark, .dark *))` funciona igual que `(&:is(.dark *))` de shadcn docs | Common Pitfalls #4 | Estilos dark: podrian no aplicarse; fix rapido cambiando a `:is()` |
| A2 | next/font/local resuelve paths relativos `../../packages/brand/fonts/` correctamente con output: export | Architecture Pattern 4 | Build falla; fallback: copiar fonts a public/ de cada app |
| A3 | El path de los .woff2 en el package npm `geist` es `dist/fonts/geist-sans/Geist-Variable.woff2` | Code Examples | Path incorrecto; verificar con `ls node_modules/geist/dist/` despues de install |
| A4 | Los valores oklch propuestos para tokens oscuros (L=0.09 bg, L=0.95 fg) cumplen WCAG AA 4.5:1 | Phase Requirements UI-03 | Contraste insuficiente; verificar con OddContrast antes de mergear |
| A5 | `@import "shadcn/tailwind.css"` funciona cuando shadcn esta instalado como dependencia de packages/ui y el CSS se importa desde packages/brand | Architecture Pattern 1 | Import falla si shadcn no esta en el tree de dependencies de la app; fix: instalar shadcn tambien en brand o como root dependency |

## Open Questions (RESOLVED)

1. **Valores oklch exactos para los 31 tokens de los 3 kits**
   - What we know: tokens.ts tiene valores base para alexendros core + 3 kits. docs/02-design-system.md tiene valores para brand/surface/text pero NO para los 31 tokens semanticos de shadcn.
   - What's unclear: Valores exactos de secondary, muted, accent, destructive, border, input, ring, chart-1..5, sidebar-* para cada kit.
   - Recommendation: Partir de los valores de shadcn neutral dark theme como baseline, ajustando primary y accent con los colores de cada kit. Verificar contraste con OddContrast.

2. **Resolucion del @import "shadcn/tailwind.css" en monorepo**
   - What we know: El manual install dice `@import "shadcn/tailwind.css"`. El package `shadcn` es el CLI.
   - What's unclear: Si este import se resuelve cuando `shadcn` no es dependency directa del package que contiene el CSS (packages/brand).
   - Recommendation: Instalar `shadcn` como devDependency en packages/brand, O mover el import a cada app CSS (despues de importar globals.css de brand).

3. **Nombre exacto de .woff2 files en npm package `geist`**
   - What we know: El package geist v1.7.0 contiene variable fonts en .woff2.
   - What's unclear: Path exacto dentro del package.
   - Recommendation: Instalar temporalmente, hacer `find node_modules/geist -name "*.woff2"` y documentar.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| pnpm | Package management | Yes | 10.33.0 | -- |
| Node.js | Runtime | Yes | >=22 | -- |
| next | App framework | Yes | ^15.3.0 (en package.json) | -- |
| Tailwind CLI (optional) | Solo si se quiere probar standalone | N/A | -- | @tailwindcss/postcss en build |

**Missing dependencies with no fallback:** Ninguno. Todo se instala via pnpm.

**Missing dependencies with fallback:** Ninguno.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (no instalado aun -- Wave 0 gap) |
| Config file | none -- Wave 0 |
| Quick run command | `pnpm turbo test --filter=@repo/ui` |
| Full suite command | `pnpm turbo test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BRAND-01 | tokens.ts exporta paletas oklch para 3 kits | unit | `pnpm vitest run packages/brand/src/__tests__/tokens.test.ts` | Wave 0 |
| BRAND-02 | fontConfig exporta variables correctas | unit | `pnpm vitest run packages/brand/src/__tests__/fonts.test.ts` | Wave 0 |
| BRAND-03 | globals.css contiene @import y @theme inline | smoke (file exists) | `test -f packages/brand/styles/globals.css` | Wave 0 |
| BRAND-04 | [data-kit] overrides existen para 3 kits | unit (CSS parse) | `pnpm vitest run packages/brand/src/__tests__/css-tokens.test.ts` | Wave 0 |
| UI-01 | 15 componentes exportados desde @repo/ui | unit | `pnpm vitest run packages/ui/src/__tests__/exports.test.ts` | Wave 0 |
| UI-02 | Componentes importables por apps | integration | `pnpm turbo build --filter=alexendros-me` | Manual |
| UI-03 | Contraste WCAG AA en dark mode | unit (oklch contrast calc) | `pnpm vitest run packages/brand/src/__tests__/contrast.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm turbo typecheck --filter=@repo/ui --filter=@repo/brand`
- **Per wave merge:** `pnpm turbo build lint typecheck`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `packages/brand/vitest.config.ts` -- config Vitest para brand
- [ ] `packages/ui/vitest.config.ts` -- config Vitest para ui
- [ ] `packages/brand/src/__tests__/tokens.test.ts` -- verifica export de oklch tokens
- [ ] `packages/brand/src/__tests__/fonts.test.ts` -- verifica fontConfig export
- [ ] `packages/brand/src/__tests__/contrast.test.ts` -- calcula contrast ratio oklch y verifica >= 4.5
- [ ] `packages/ui/src/__tests__/exports.test.ts` -- verifica que los 15 componentes se exportan
- [ ] Root `vitest` devDependency: `pnpm add vitest -Dw`

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | -- (fase sin auth) |
| V3 Session Management | No | -- |
| V4 Access Control | No | -- |
| V5 Input Validation | No | -- (no hay inputs funcionales aun) |
| V6 Cryptography | No | -- |

**Nota:** Esta fase es puramente de UI/CSS/tokens. No hay superficie de ataque. Las unicas consideraciones de seguridad son:
- No hardcodear secretos en tokens o CSS.
- Los font files (.woff2) deben servirse con headers `Cache-Control` adecuados (manejado por Vercel automaticamente).

### Known Threat Patterns for Design System

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| CSS injection via user-generated class names | Tampering | No aplica -- los tokens son estaticos, no user-generated |
| Font loading from untrusted sources | Information Disclosure | Fonts self-hosted en packages/brand/fonts/ (no CDN externo) |

## Sources

### Primary (HIGH confidence)
- [shadcn/ui monorepo docs](https://ui.shadcn.com/docs/monorepo) -- Estructura monorepo, components.json, CLI commands
- [shadcn/ui manual install](https://ui.shadcn.com/docs/installation/manual) -- globals.css completo, dependencias, utils.ts
- [shadcn/ui theming](https://ui.shadcn.com/docs/theming) -- 31 tokens semanticos, @theme inline, oklch values, radius scale
- [shadcn/ui Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4) -- Migration guide, tw-animate-css, forwardRef removal
- [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme) -- @theme vs @theme inline, font vars, oklch
- [Tailwind CSS source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files) -- @source directive, monorepo scanning
- npm registry -- Versiones verificadas de todos los paquetes

### Secondary (MEDIUM confidence)
- [shadcnblocks.com styles guide](https://www.shadcnblocks.com/blog/shadcn-component-styles-vega-nova-maia-lyra-mira/) -- Mapeo old->new style names
- [OddContrast](https://www.oddcontrast.com/) -- Herramienta de contraste oklch para WCAG
- [Atmos Style contrast checker](https://atmos.style/contrast-checker) -- Checker oklch para WCAG AA
- [W3C WCAG 2.1 contrast minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) -- 4.5:1 ratio requirement

### Tertiary (LOW confidence)
- Next.js font path resolution con output: export -- No verificado con la version actual

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- todas las versiones verificadas en npm registry, docs oficiales consultados
- Architecture: HIGH -- patrones de shadcn/ui monorepo docs + Tailwind v4 docs oficiales
- Pitfalls: HIGH/MEDIUM -- pitfalls 1-3 y 5 verificados con docs; pitfall 4 y 6 asumidos

**Research date:** 2026-04-07
**Valid until:** 2026-05-07 (30 dias -- stack estable)
