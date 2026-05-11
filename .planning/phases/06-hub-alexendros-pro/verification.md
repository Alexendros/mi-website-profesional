# Fase 6 — Criterios de verificacion

## Auth
- [ ] Login con email+password funciona
- [ ] Magic link funciona y llega via Resend
- [ ] Rutas `/dashboard/*` redirigen a `/login` sin sesion activa
- [ ] `getUser()` retorna usuario real (no desde cookie local)
- [ ] Logout invalida sesion en Supabase

## tRPC
- [ ] `pnpm turbo typecheck` verde — tipos E2E sin errores
- [ ] Procedure protegido retorna UNAUTHORIZED sin sesion
- [ ] `createCallerFactory` funciona desde Server Component
- [ ] Rate limiting: 100 req/min por IP en `/api/trpc/*`

## Cookie consent
- [ ] PostHog NO aparece en Network tab antes de "Aceptar"
- [ ] Cookie `consent_given=1` se crea tras "Aceptar"
- [ ] `ConsentLog` tiene entrada en DB tras aceptar
- [ ] "Rechazar" no activa PostHog y no crea `consent_given`
- [ ] Revocar desde Settings elimina cookie y desactiva PostHog

## Performance (Lighthouse CI en landing)
- [ ] LCP < 2.0s desktop
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] Performance score >= 90

## Seguridad
- [ ] `SUPABASE_SERVICE_ROLE_KEY` no aparece en client bundle (bundle analyzer)
- [ ] Headers CSP/HSTS/X-Frame-Options activos en Vercel
- [ ] `pnpm audit --audit-level=high` sin vulnerabilidades
