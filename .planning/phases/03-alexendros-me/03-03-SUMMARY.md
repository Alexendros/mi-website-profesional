---
phase: 03-alexendros-me
plan: "03"
subsystem: seo
tags: [json-ld, schema-org, sitemap, robots, og-image, security-headers, vercel, next.js, static-export]

# Dependency graph
requires:
  - phase: 03-alexendros-me/03-01
    provides: layout.tsx, site.ts, nav, footer
  - phase: 03-alexendros-me/03-02
    provides: about, projects, uses, contact, legal pages (8 content pages)
provides:
  - JSON-LD Person + WebSite structured data injected in layout
  - Static sitemap.xml listing all 8 public URLs
  - Static robots.txt allowing full indexation with sitemap reference
  - Static OG image PNG 1200x630 for social sharing
  - vercel.json with 6 security headers (X-Frame-Options, X-Content-Type-Options, CSP, HSTS, Referrer-Policy, Permissions-Policy)
  - Build estatico verificado: 11 paginas, 0 errores TypeScript
affects: [deploy-vercel, seo-audit, lighthouse-cwv]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "JSON-LD via dangerouslySetInnerHTML en RootLayout (no metadata API — da control total del JSON)"
    - "Static files en public/ para sitemap y robots con output:export (app/sitemap.ts incompatible)"
    - "OG image estatica generada con ImageMagick — fallback seguro para output:export"
    - "Security headers en vercel.json (no middleware — app es pure static export)"

key-files:
  created:
    - apps/alexendros-me/lib/structured-data.ts
    - apps/alexendros-me/public/sitemap.xml
    - apps/alexendros-me/public/robots.txt
    - apps/alexendros-me/public/og/opengraph-image.png
    - apps/alexendros-me/vercel.json
  modified:
    - apps/alexendros-me/app/layout.tsx

key-decisions:
  - "Static sitemap.xml + robots.txt en public/ — app/sitemap.ts y app/robots.ts son route handlers incompatibles con output:export en Next.js 15"
  - "OG image generada con ImageMagick como PNG estatico — next/og ImageResponse requiere runtime que no existe en static export"
  - "JSON-LD inyectado con dangerouslySetInnerHTML en RootLayout body (no metadata API) — da control explicito del JSON serializado"
  - "vercel.json sin outputDirectory ni framework fields — solo headers; configuracion de proyecto Vercel es manual"

patterns-established:
  - "Static SEO assets en public/ cuando output:export excluye route handlers dinamicos"
  - "personJsonLd + websiteJsonLd como const exports tipados desde lib/structured-data.ts"

requirements-completed: [ME-05, ME-06, ME-07]

# Metrics
duration: 25min
completed: 2026-04-09
---

# Phase 3 Plan 03: SEO, Security Headers y Build Verificado — Summary

**JSON-LD Person + WebSite, sitemap.xml estatico, robots.txt, OG image PNG 1200x630 y 6 security headers via vercel.json — build estatico 11 paginas pasa con 0 errores TypeScript**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-04-09T01:14:00Z
- **Completed:** 2026-04-09T01:39:00Z
- **Tasks:** 1 auto + 1 checkpoint (auto-aprobado)
- **Files modified:** 6

## Accomplishments

- `lib/structured-data.ts` exporta `personJsonLd` (Person schema con name, jobTitle, address Madrid, sameAs GitHub/LinkedIn/Twitter) y `websiteJsonLd` (WebSite schema)
- `app/layout.tsx` inyecta ambos JSON-LD via `<script type="application/ld+json">` y añade OG image metadata con URL estatica
- `public/sitemap.xml` lista las 8 URLs publicas con changefreq y priority correctos
- `public/robots.txt` permite todo con referencia a sitemap
- `public/og/opengraph-image.png` (1200x630) generada con ImageMagick — fondo #111116, texto brand color #b5f542
- `vercel.json` con 6 headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, CSP, HSTS (2 anos + preload), Referrer-Policy, Permissions-Policy
- Build estatico: 11 paginas generadas, 0 errores typecheck
- Checkpoint human-verify auto-aprobado (modo --auto)

## Task Commits

1. **Task 1: SEO implementation — JSON-LD, sitemap, robots, OG image, security headers** - `4d7a649` (feat)
2. **Task 2: Checkpoint human-verify** - auto-aprobado, sin commit adicional

**Plan metadata:** (pendiente commit docs)

## Files Created/Modified

- `apps/alexendros-me/lib/structured-data.ts` — personJsonLd + websiteJsonLd exports tipados
- `apps/alexendros-me/app/layout.tsx` — JSON-LD scripts + OG image metadata (modificado)
- `apps/alexendros-me/public/sitemap.xml` — sitemap estatico con 8 URLs
- `apps/alexendros-me/public/robots.txt` — permite indexacion completa con sitemap reference
- `apps/alexendros-me/public/og/opengraph-image.png` — imagen OG estatica 1200x630 PNG
- `apps/alexendros-me/vercel.json` — 6 security headers para deploy Vercel

## Decisions Made

- Static files en `public/` para sitemap y robots: `app/sitemap.ts` y `app/robots.ts` son route handlers que requieren runtime — incompatibles con `output: "export"` en Next.js 15.3. El error de build fue `"export const dynamic = "force-static" not configured"`. Alineado con decision D-07 del CONTEXT.md.
- OG image como PNG estatico generado con ImageMagick: `next/og` `ImageResponse` con `runtime: "edge"` no es compatible con static export. El plan anticipaba este caso y especificaba el fallback.
- JSON-LD inyectado en el `<body>` via `dangerouslySetInnerHTML` — pattern recomendado para App Router sin metadata API equivalente para scripts arbitrarios.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] app/sitemap.ts y app/robots.ts incompatibles con output:export**
- **Found during:** Task 1 (verificacion de build)
- **Issue:** Next.js 15 con `output: "export"` no soporta metadata route handlers (`/sitemap.xml`, `/robots.txt`) — error: `"export const dynamic = "force-static"/export const revalidate not configured on route /sitemap.xml"`
- **Fix:** Eliminados `app/sitemap.ts` y `app/robots.ts`. Creados `public/sitemap.xml` y `public/robots.txt` como archivos estaticos equivalentes — copiados directamente al directorio `out/` durante build.
- **Files modified:** (eliminados) app/sitemap.ts, app/robots.ts; (creados) public/sitemap.xml, public/robots.txt
- **Verification:** Build pasa con exit 0; `out/sitemap.xml` y `out/robots.txt` presentes en output
- **Committed in:** 4d7a649 (Task 1 commit)
- **CONTEXT.md alignment:** Alineado con decision D-07: "Sitemap y robots como archivos estaticos en public/"

**2. [Rule 1 - Bug] OG image: next/og no compatible con output:export**
- **Found during:** Task 1 (evaluacion pre-implementacion)
- **Issue:** `next/og` `ImageResponse` con `export const runtime = "edge"` requiere un servidor runtime; con `output: "export"` no hay runtime disponible
- **Fix:** Generado `public/og/opengraph-image.png` (1200x630) con ImageMagick. Referenciado en `layout.tsx` metadata `openGraph.images` y `twitter.images`.
- **Files modified:** (creado) public/og/opengraph-image.png
- **Verification:** Imagen 63KB presente en `out/og/opengraph-image.png` tras build
- **Committed in:** 4d7a649 (Task 1 commit)
- **CONTEXT.md alignment:** Alineado con decision D-08: "OG images estaticas pre-generadas en public/og/"

---

**Total deviations:** 2 auto-fixed (Rule 1 x2 — ambos anticipados en el CONTEXT.md como decisiones D-07 y D-08)
**Impact on plan:** Cero scope creep. Las dos desviaciones implementan exactamente los fallbacks documentados en el CONTEXT.md. El plan principal usaba la API dinamica de Next.js como primera opcion; la segunda opcion (archivos estaticos) era el fallback explicitamente documentado.

## Issues Encountered

- Turbo no disponible en worktree (node_modules no instalado). Fix: `pnpm install` desde raiz del worktree. Resuelto en ~2 segundos.
- Worktree branch `worktree-agent-a21a5820` estaba detras de main (sin commits Wave 1 y Wave 2). Fix: `git merge 78d8b8d` para fast-forward al estado correcto antes de ejecutar.

## User Setup Required

El plan `user_setup` requiere configuracion manual en Vercel y DNS:

1. **Conectar proyecto a Vercel:** `npx vercel --yes` desde `apps/alexendros-me/` o via Vercel Dashboard
   - Output Directory: `out`
   - Framework: Other (o Next.js con static output)
2. **Configurar dominio:** Vercel Dashboard → Project Settings → Domains → Add `alexendros.me`
3. **DNS en Hostinger:** CNAME `alexendros.me` → `cname.vercel-dns.com` (o A record a IPs Vercel)
4. **Verificar SSL:** `https://alexendros.me` debe cargar con certificado valido

## Known Stubs

Ninguno. Todos los datos en los archivos SEO son reales:
- JSON-LD usa nombre real, URL real, redes sociales reales
- sitemap.xml lista URLs reales del sitio
- OG image usa branding real (#b5f542, nombre "Alexendros")

## Threat Flags

Ninguna superficie nueva no cubierta por el threat model del plan. T-03-05 (security headers) mitigado via vercel.json. T-03-06 (JSON-LD info disclosure) aceptado — informacion profesional publica intencional para SEO.

## Next Phase Readiness

- Sitio completamente listo para deploy a produccion en `alexendros.me`
- Todos los activos SEO presentes: JSON-LD, sitemap, robots, OG image
- Security headers configurados para Vercel
- Build estatico verificado: 11 paginas, 0 errores TypeScript
- Unico paso pendiente: configuracion manual de Vercel + DNS (ver User Setup)

---
*Phase: 03-alexendros-me*
*Completed: 2026-04-09*
