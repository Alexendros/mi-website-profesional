---
phase: 03-alexendros-me
plan: "01"
subsystem: alexendros-me
tags: [layout, nav, footer, hero, personal-brand, static-export]
dependency_graph:
  requires: []
  provides: [layout-shell, nav, footer, hero-page, site-config]
  affects: [alexendros-me]
tech_stack:
  added: [lucide-react]
  patterns: [server-components, static-export, flex-layout, oklch-tokens]
key_files:
  created:
    - apps/alexendros-me/lib/site.ts
    - apps/alexendros-me/components/nav.tsx
    - apps/alexendros-me/components/footer.tsx
  modified:
    - apps/alexendros-me/app/layout.tsx
    - apps/alexendros-me/app/globals.css
    - apps/alexendros-me/app/page.tsx
    - apps/alexendros-me/package.json
decisions:
  - ":root tokens as personal brand — no data-kit needed on alexendros.me"
  - "lucide-react added as explicit dependency (was transitive via @repo/ui)"
  - "Nav uses Sheet from @repo/ui for mobile drawer — no new UI primitives"
  - "Footer is Server Component — no interactivity required"
  - "Hero is Server Component — text-only, no images, fast LCP"
metrics:
  duration: "~25 minutes"
  completed: "2026-04-08T23:03:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 3
  files_modified: 4
---

# Phase 03 Plan 01: Layout Shell + Hero — Summary

**One-liner:** Layout limpio con marca personal (:root tokens, sin data-kit), nav sticky responsive con Sheet mobile, footer con links legales y sociales, hero con contenido real de pf-0 que supera el test de 5 segundos.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Layout refactor + site config + nav + footer | 7b6d547 | layout.tsx, globals.css, lib/site.ts, components/nav.tsx, components/footer.tsx |
| 2 | Hero page with real positioning content | 72ded58 | app/page.tsx, package.json, pnpm-lock.yaml |

## Decisions Made

1. **:root tokens sin data-kit** — `data-kit="stagekit"` eliminado del `<html>`. Los tokens `:root` en globals.css SON la paleta de marca personal (dark-acid oklch). No se necesita selector adicional para alexendros.me.

2. **lucide-react como dependencia explícita** — El componente nav.tsx importa `Menu` y `X` de lucide-react. Aunque @repo/ui lo usa internamente, no estaba declarado en alexendros-me. Auto-fixed añadiéndolo a dependencies para evitar errores TypeScript en build.

3. **Nav = "use client"** — usePathname() y useState() requieren client boundary para active link highlighting y toggle del menú móvil.

4. **Footer = Server Component** — Sin interactividad. Los social links usan `target="_blank" rel="noopener noreferrer"` (mitigación T-03-02 del threat model).

5. **Hero sin imagen** — Text-focused, dark background. Favorece LCP < 2.0s. Imágenes OG en plan posterior.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] lucide-react no declarado como dependencia**
- **Found during:** Task 2 build (TypeScript error "Cannot find module 'lucide-react'")
- **Issue:** nav.tsx importa Menu y X de lucide-react, que existe en el pnpm store global (vía @repo/ui) pero no estaba listado en package.json de alexendros-me
- **Fix:** `pnpm add lucide-react --filter=alexendros-me` — versión ^1.7.0
- **Files modified:** apps/alexendros-me/package.json, pnpm-lock.yaml
- **Commit:** 72ded58 (incluido en Task 2 commit)

## Verification Results

| Check | Result |
|-------|--------|
| data-kit="stagekit" eliminado de layout.tsx | PASS (0 ocurrencias) |
| [data-kit="lexkit"] eliminado de globals.css | PASS (0 ocurrencias) |
| [data-kit="gestkit"] eliminado de globals.css | PASS (0 ocurrencias) |
| siteConfig exportado con nav + legalNav | PASS |
| Nav component con 5 links de navegacion | PASS |
| Footer component con 3 links legales | PASS |
| Hero headline de pf-0 en page.tsx | PASS |
| Subtitulo "Fundador de KitOS" en page.tsx | PASS |
| CTAs Ver proyectos + Contacto | PASS |
| Bio con "kits digitales verticalizados" | PASS |
| page.tsx es Server Component (sin "use client") | PASS |
| page.tsx >= 40 lineas | PASS (178 lineas) |
| Build pasa (static export, 0 errores TypeScript) | PASS |
| External links con rel="noopener noreferrer" | PASS (threat T-03-02) |

## Known Stubs

Ninguno. Todo el contenido del hero proviene de pf-0-biografia-posicionamiento.md. Los project cards muestran KitOS y alexendros.me con datos reales.

## Threat Flags

Ninguno. Sitio estático sin nuevas superficies de red, auth o acceso a ficheros.

## Self-Check: PASSED

- apps/alexendros-me/lib/site.ts — FOUND
- apps/alexendros-me/components/nav.tsx — FOUND
- apps/alexendros-me/components/footer.tsx — FOUND
- apps/alexendros-me/app/layout.tsx — FOUND (sin data-kit)
- apps/alexendros-me/app/globals.css — FOUND (sin kit selectors)
- apps/alexendros-me/app/page.tsx — FOUND (hero con contenido real)
- Commit 7b6d547 — FOUND (git log verificado)
- Commit 72ded58 — FOUND (git log verificado)
- Build: PASS (✓ Compiled successfully, ✓ Exporting 2/2 static pages)
