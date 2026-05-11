# ADR-0005 · Vergina Imperial v0.2.2 como design system

- Fecha: 2026-05-10
- Estado: Aceptado
- Decisor: Alexendros

## Contexto

El monorepo tiene múltiples apps con identidades de marca diferenciadas pero dentro del paraguas Alexendros. Necesitamos un sistema de diseño que sea dark-first, coherente, y que permita temas por kit sin duplicación de CSS.

## Decisión

**Vergina Imperial v0.2.2** como design system base. Dark-first por defecto. Dos brillos metálicos: oro Vergina (`--color-gold`) y titanio (`--color-titanium`). CSS custom properties con `oklch()`. `packages/brand/` como fuente de verdad visual.

## Justificación

- CSS custom properties con `oklch()` garantizan gamut amplio y cálculo de contraste WCAG AA sencillo.
- Dark-first elimina el problema de `prefers-color-scheme` en inversion — el modo oscuro es el default.
- `packages/brand/` centraliza tokens, fonts y estilos base; cada app importa y puede sobreescribir con su `theme_token` (dark-acid para StageKit, legal-navy para LexKit, gestoria-slate para GestKit).
- Vergina Imperial es la marca personal de Alexendros — aplicarla al hub y heredarla en los kits crea coherencia visual sin perder identidad por producto.

## Consecuencias

- `className="dark"` en el root `<html>` de todas las apps.
- Colores solo via CSS vars (`--color-*`) — prohibido hardcodear colores fuera de `packages/brand/tokens.ts`.
- Geist Sans + Mono como tipografías base; Inter 700/800 para display hero en `alexendros.pro`.
- View Transitions API para navegación suave entre páginas (React 19 nativo).
- `packages/brand/` exporta: `fonts.ts`, `tokens.ts`, `styles/` (parciales CSS).

## Alternativas descartadas

- **Tailwind-only sin design system**: inconsistencia visual entre apps a medida que crecen. Descartado.
- **shadcn/ui temas default (zinc/slate)**: no reflejan la identidad de marca. shadcn se usa como capa de componentes sobre los tokens de Vergina Imperial.
