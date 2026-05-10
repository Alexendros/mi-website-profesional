# Fase 6 — Hub alexendros.pro

- Estado: PENDIENTE
- Prerrequisito: Fase 4 (DB) + Fase 5 (Pagos)
- Duracion estimada: 3 semanas
- ADRs: 0001, 0002, 0004, 0005, 0006

## Objetivo

Construir el hub central alexendros.pro: autenticacion SSR, dashboard de usuario, API tRPC type-safe, y landing de marketing con conversion.

## Componentes

### Auth (Supabase SSR)
- [ ] `proxy.ts` — session refresh en cada request (Next.js 16)
- [ ] `app/(auth)/login/page.tsx` — login con email+password + magic link
- [ ] `app/(auth)/signup/page.tsx` — registro con validacion Zod
- [ ] `app/(auth)/callback/route.ts` — OAuth callback handler
- [ ] `lib/supabase/server.ts` — `createServerClient` factory
- [ ] `lib/supabase/browser.ts` — `createBrowserClient` factory
- [ ] Regla: `getUser()` siempre, nunca `getSession()` para autorizacion

### tRPC v11
- [ ] `server/trpc.ts` — `initTRPC` con contexto de sesion
- [ ] `server/routers/user.ts` — procedures: getProfile, updateProfile
- [ ] `server/routers/subscription.ts` — procedures: getSubscription, cancel
- [ ] `server/root.ts` — `appRouter` + `createCallerFactory`
- [ ] `app/api/trpc/[trpc]/route.ts` — `fetchRequestHandler`
- [ ] `lib/trpc/client.ts` — cliente React Query v5
- [ ] Rate limiting Upstash en middleware tRPC

### Dashboard
- [ ] `app/(dashboard)/layout.tsx` — sidebar + auth guard
- [ ] `app/(dashboard)/dashboard/page.tsx` — resumen cuenta, kit activo, proxima factura
- [ ] `app/(dashboard)/settings/page.tsx` — datos personales, cambiar password
- [ ] `app/(dashboard)/billing/page.tsx` — plan actual, facturas, cancelar

### Landing de marketing
- [ ] `app/(marketing)/page.tsx` — hero, UVP, kits showcase, CTA dual
- [ ] `app/(marketing)/pricing/page.tsx` — tabla de precios con toggle mensual/anual
- [ ] JSON-LD: `organizationJsonLd`, `websiteJsonLd` desde `@repo/seo`
- [ ] OG images con `next/og`

### Cookie consent (AEPD 2023)
- [ ] `components/analytics-provider.tsx` — PostHog guard con `consent_given`
- [ ] `components/cookie-banner.tsx` — tres opciones igual prominencia
- [ ] `app/api/consent/route.ts` — POST (grant) + DELETE (revoke)
- [ ] Tabla `ConsentLog` en Prisma: `user_id`, `consent_at`, `consent_version`, `ip_hash`
