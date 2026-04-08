# Phase 2: Design System - Discussion Log (Assumptions Mode)

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the analysis.

**Date:** 2026-04-07
**Phase:** 02-Design System
**Mode:** assumptions (auto)
**Areas analyzed:** Token Architecture, Tailwind v4 Config, shadcn/ui Monorepo, Font Loading, Rate Limiting Prep

## Assumptions Presented

### Token Architecture y CSS Variables
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| CSS-first @theme inline, no tailwind.config.ts | Confident | .planning/research/STACK.md, Tailwind v4 docs |
| tokens.ts as TS source + manual globals.css | Likely | packages/brand/CLAUDE.md, .planning/research/ARCHITECTURE.md |
| 31 shadcn tokens in oklch with [data-kit] overrides | Confident | shadcn/ui theming docs, Tailwind v4 @theme inline docs |
| Dark-first default with @custom-variant dark | Confident | packages/brand/CLAUDE.md, docs/02-design-system.md |

### Tailwind v4 Config Placement
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| CSS preset in packages/brand/, not packages/config/ | Likely | Brand owns visual identity, packages/brand/CLAUDE.md |
| @tailwindcss/postcss as integration plugin | Confident | .planning/research/STACK.md line 376 |

### shadcn/ui in Monorepo
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Official monorepo support with components.json per workspace | Confident | shadcn/ui monorepo docs (external research) |
| tw-animate-css replaces tailwindcss-animate | Confident | shadcn/ui Tailwind v4 changelog (external research) |
| 15 components in packages/ui with custom aliases | Confident | REQUIREMENTS.md UI-01, packages/ui/CLAUDE.md |

### Font Loading
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| next/font cannot export from shared package | Confident | Next.js #51476, packages/brand/src/fonts.ts comment |
| Per-app loading with centralized font files in brand | Confident | External research, Geist npm package docs |
| CSS variable standardization for @repo/ui | Confident | packages/brand/src/fonts.ts metadata |

## Corrections Made

No corrections — all assumptions confirmed (auto mode).

## Auto-Resolved

- Token source strategy (Likely): auto-selected manual CSS alongside TS tokens (recommended default)
- Tailwind config location (Likely): auto-selected packages/brand/ (recommended default)

## External Research

- shadcn/ui + Tailwind v4: Full compatibility confirmed (Source: ui.shadcn.com/docs/tailwind-v4)
- shadcn/ui monorepo: Official support with components.json per workspace (Source: ui.shadcn.com/docs/monorepo)
- oklch + [data-kit] + @theme inline: Works as expected for runtime theme switching (Source: tailwindcss.com/docs/theme)
- next/font in monorepo: Blocked by Next.js bug #51476; per-app loading is the workaround (Source: github.com/vercel/next.js/issues/51476)
