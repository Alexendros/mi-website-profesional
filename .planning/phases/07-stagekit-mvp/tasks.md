# Fase 7 — Tareas detalladas

## T7.1 — Theme dark-acid
- Extender tokens Vergina Imperial con `--color-acid-*` en `packages/brand/`
- `className="dark"` en root html + `data-theme="stagekit"` para overrides

## T7.2 — Kit Profile SSG
- `generateStaticParams` para profiles activos
- `generateMetadata` con OG image dinamica (next/og con foto artista)
- Embed SoundCloud iframe con lazy load
- Revalidate ISR: 3600s

## T7.3 — Booking flow
- Zod schema para `BookingRequest`: fecha, ciudad, tipo evento, presupuesto estimado
- Server Action con rate limiting Upstash
- Email confirmation al solicitante + notificacion al artista

## T7.4 — Suscripcion y planes
- `middleware.ts` de plan checking: verificar feature access segun plan
- UI de upgrade cuando se llega al limite de features
- Checkout Stripe con price_id correcto segun plan seleccionado

## T7.5 — Analytics per kit
- PostHog event `kit_profile_viewed` con slug y referrer
- Solo tras consentimiento del visitante
- Dashboard: tabla de views + fuentes de trafico

## T7.6 — Tests
- E2E: perfil publico carga con datos correctos
- E2E: booking form envia y email llega
- RLS: artista A no puede editar perfil de artista B

## Verificacion de fase completada
Ver `verification.md`
