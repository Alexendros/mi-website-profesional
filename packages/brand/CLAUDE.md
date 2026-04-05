# CLAUDE.md — packages/brand

Design tokens, logos, and typography for the Alexendros brand system.

## Source of truth
- `src/tokens.ts` — oklch color tokens (Alexendros core + per-Kit palettes)
- `src/fonts.ts` — Geist + Geist Mono config for next/font

## Rules
- NEVER hardcode colors outside of tokens.ts
- All apps consume tokens from this package — no local color definitions
- Dark-first: default theme is dark mode
- oklch color space mandatory for all color tokens
- Per-Kit tokens use the kit slug as prefix (stagekit, lexkit, gestkit)
- Changes to tokens must be validated visually in alexendros.me first
