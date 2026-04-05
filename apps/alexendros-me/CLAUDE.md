# CLAUDE.md — apps/alexendros-me

Landing page profesional de marca personal en alexendros.me.

## Contexto
- **Dominio:** alexendros.me
- **Tipo:** Sitio estatico (output: 'export') — SIN backend
- **Proposito:** Campo de pruebas de branding/UI. Validar identidad visual antes de aplicarla a alexendros.pro
- **Redirige a:** alexendros.pro para productos y servicios

## Reglas
- NO backend, NO API routes, NO middleware, NO auth
- output: 'export' en next.config.ts (estatico puro)
- Consumir tokens SOLO de @repo/brand
- Componentes compartidos de @repo/ui
- Headers de seguridad via Vercel config (no middleware)
- Dark-first por defecto
- Test de 5 segundos: quien es, que construye, para quien — visible sin scroll

## Paginas
- `/` — Hero + about breve + proyectos + stack + timeline
- `/about` — Narrativa 3 actos completa
- `/projects` — Portfolio con links
- `/uses` — Herramientas y stack
- `/contact` — Info de contacto (mailto/Calendly, sin formulario server-side)
- `/legal/aviso-legal` — Art. 10 LSSI-CE
- `/legal/privacidad` — Art. 13 RGPD
- `/legal/cookies` — AEPD Guia 2023

## SEO
- JSON-LD Person con sameAs (GitHub, LinkedIn, Twitter)
- JSON-LD WebSite
- Sitemap estatico, robots.txt
- OG images, canonical URLs

## CWV Targets
- LCP < 2.0s desktop / < 2.5s mobile
- INP < 200ms, CLS < 0.1
- Lighthouse > 90
