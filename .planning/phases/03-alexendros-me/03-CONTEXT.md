# Phase 3: Landing alexendros.me - Context

**Gathered:** 2026-04-07 (assumptions mode, auto)
**Status:** Ready for planning

<domain>
## Phase Boundary

Landing personal estatica de Alejandro en produccion en alexendros.me antes del dia 30 — valida el branding real y desbloquea DNS + SSL para fases posteriores.

</domain>

<decisions>
## Implementation Decisions

### Visual Design
- **D-01:** Usar tokens `:root` (dark-acid core) SIN `data-kit` — es marca personal, no un Kit. Eliminar `data-kit="stagekit"` del layout.tsx (artefacto de test Phase 2).
- **D-02:** Componentes de @repo/ui (15 shadcn) + layout sections custom en la app. Layouts custom son aceptables en apps/ si son composicion, no componentes reutilizables.

### Page Structure
- **D-03:** 8 paginas totales: `/` (hero + about breve + projects + stack + timeline), `/about`, `/projects`, `/uses`, `/contact`, `/legal/aviso-legal`, `/legal/privacidad`, `/legal/cookies`.
- **D-04:** Contenido sourced from docs/pf-0-biografia-posicionamiento.md (hero, UVP, bio, 3-act narrative) y docs/pf-3-repositorios-proyectos.md (portfolio). Son copy validada, no borradores.
- **D-05:** Test de 5 segundos: quien es, que construye, para quien — visible sin scroll en hero.

### SEO / Structured Data
- **D-06:** Metadata via Next.js metadata API (ya parcialmente en layout.tsx). JSON-LD Person + WebSite como script manual en page components.
- **D-07:** Sitemap y robots como archivos estaticos en `public/` (output: export no soporta route handlers dinamicos de forma fiable).
- **D-08:** OG images estaticas pre-generadas en `public/og/` — NO @vercel/og (incompatible con output: export, no API routes).

### Legal Pages
- **D-09:** Contenido legal real basado en docs/07-compliance-legal.md: LSSI-CE Art. 10, RGPD Art. 13, AEPD 2023. Con datos reales de Alejandro.
- **D-10:** NO cookie banner funcional — sitio estatico sin cookies de tracking (no PostHog, no Supabase, no Stripe). Pagina de cookies documenta que el sitio no usa cookies de terceros.

### Deployment
- **D-11:** Vercel project filtrado a apps/alexendros-me con output directory `out/`. Añadir `out/**` a turbo.json build outputs para caching correcto.
- **D-12:** DNS migration Hostinger → Vercel para alexendros.me (configuracion manual, fuera del codigo).
- **D-13:** Security headers via vercel.json: CSP, HSTS, X-Frame-Options, X-Content-Type-Options.

### Claude's Discretion
- Layout exacto de secciones en la home (grid, spacing)
- Iconografia y decoracion visual
- Transiciones/animaciones (si las hay, minimales)
- Orden de navegacion
- Estilo de la pagina /uses

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Content Source
- `docs/pf-0-biografia-posicionamiento.md` — Hero copy, UVP, bio, 3-act narrative, social bios
- `docs/pf-3-repositorios-proyectos.md` — Project portfolio descriptions

### Legal Spec
- `docs/07-compliance-legal.md` — LSSI-CE, RGPD, cookies content outlines

### App Rules
- `apps/alexendros-me/CLAUDE.md` — Static only, no backend, dark-first, CWV targets, SEO reqs, page list

### Design System
- `packages/brand/styles/globals.css` — oklch tokens, :root palette
- `packages/brand/src/tokens.ts` — TypeScript token values
- `packages/ui/CLAUDE.md` — Component usage rules

### Pre-production
- `docs/10-checklist-pre-produccion.md` — SEO checklist (Bloque G), security headers

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/alexendros-me/app/layout.tsx` — Metadata ya configurada, Geist fonts cargadas
- `apps/alexendros-me/app/page.tsx` — Test page con componentes @repo/ui (reemplazar con real content)
- `apps/alexendros-me/app/globals.css` — Tokens inlineados, Tailwind v4 configurado
- `packages/ui/src/components/` — 15 componentes shadcn listos

### Established Patterns
- Static export con output: 'export'
- Dark-first theming via class="dark" en html
- PostCSS + @tailwindcss/postcss

### Integration Points
- `apps/alexendros-me/next.config.ts` — output: export ya configurado
- `apps/alexendros-me/postcss.config.mjs` — @tailwindcss/postcss configurado
- Vercel — necesita vercel.json para headers y output config

</code_context>

<specifics>
## Specific Ideas

- Hero headline from PF-0: "Construyo productos digitales que funcionan y cumplen la ley"
- JSON-LD Person con sameAs: GitHub, LinkedIn, Twitter
- Lighthouse Performance >= 90 es success criteria hard
- LCP < 2.0s desktop — critical para validacion

</specifics>

<deferred>
## Deferred Ideas

- Animaciones complejas (Framer Motion) — post-MVP polish
- Blog / MDX content — future phase
- i18n (EN version) — post-MVP
- Analytics (PostHog) — Phase 6 with consent
- Dynamic OG images — Phase 7 (StageKit EPKs)

</deferred>

---

*Phase: 03-alexendros-me*
*Context gathered: 2026-04-07*
