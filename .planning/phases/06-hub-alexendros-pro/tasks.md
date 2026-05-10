# Fase 6 — Tareas detalladas

## T6.1 — Auth SSR
- `proxy.ts` con `updateSession()` de `@supabase/ssr`
- Login/signup pages con `shadcn/ui` Form + Zod
- Proteccion de rutas dashboard: redirect a /login si no hay sesion
- `getUser()` en Server Components (nunca `getSession()`)

## T6.2 — tRPC setup
- `initTRPC.context<Context>()` con `session` del request
- Middleware `protectedProcedure` que verifica `ctx.session`
- `createCallerFactory` para llamadas server-side sin HTTP round-trip
- React Query v5 provider en `app/providers.tsx`

## T6.3 — Dashboard
- Layout con sidebar usando componente `Sidebar` de shadcn/ui
- Dashboard page: datos desde `createCallerFactory` (no fetch HTTP)
- Billing page: integrar Stripe Customer Portal (`stripe.billingPortal.sessions.create`)

## T6.4 — Landing con conversion
- Hero: headline + subheadline + CTA dual ("Empezar gratis" + "Ver demo")
- Kits section: card por cada kit con pricing y CTA
- Social proof: metricas cuantificadas (benchmark Vercel: numeros concretos > claims)
- Pricing: `RadioGroup` con toggle mensual/anual, precios desde env vars

## T6.5 — Cookie banner AEPD
- Banner no dismiss hasta click explícito en una de las 3 opciones
- `consent_given` cookie: `SameSite=Strict; max-age=31536000`
- PostHog inicializado SOLO en `useEffect` tras verificar consent
- E2E test: verificar que PostHog no carga en DOM sin consent

## T6.6 — Performance
- `export const dynamic = 'force-dynamic'` en layouts con datos de usuario
- Rutas de marketing: ISR con `revalidate = 3600`
- Lighthouse CI: score >=90 en landing y dashboard

## Verificacion de fase completada
Ver `verification.md`
