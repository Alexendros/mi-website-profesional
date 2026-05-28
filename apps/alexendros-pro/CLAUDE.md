# CLAUDE.md — apps/alexendros-pro

Hub Alexendros en alexendros.pro.

> **Nota 2026-04-23**: la marca paraguas anterior fue retirada (ver `.archive/kitos-pre-reformulacion-2026-04-23/`). Pendiente reformular el concepto de producto.
>
> **Nota 2026-05 · Tienda de productos digitales + landing de servicios.** La app combina dos
> cosas: (1) la **tienda** de productos digitales con Stripe (#28): `(tienda)`, `/api/checkout`,
> webhooks, descargas firmadas; y (2) la **landing de captación de servicios** (esta integración):
> la home presenta servicios + CTA a la tienda, con contacto por formulario (`/api/contact` →
> Resend), Calendly y WhatsApp/email. Sin auth todavía — el hub completo (Fase 6) sigue pendiente.

## Contexto
- **Dominio:** alexendros.pro
- **Tipo (hoy):** tienda de productos digitales (Stripe) + landing de servicios con contacto. Auth/dashboard pendientes.
- **Proposito:** vender productos digitales y captar clientes para servicios de desarrollo.
- **Arquitectura:** Multi-producto, preparada para multiples aplicaciones verticales

## Captación de servicios (MVP · 2026-05)
- **Landing:** `app/page.tsx` (Server Component) — hero, servicios, proceso, sección "Productos
  digitales" con CTA a `/tienda`, y contacto.
- **Formulario:** `components/contact-form.tsx` (cliente) + `app/api/contact/route.ts` (Node).
  Validación Zod compartida en `lib/contact-schema.ts`; honeypot anti-spam; rate-limit reutilizando
  `checkRateLimit` de `lib/ratelimit.ts` (mismo que checkout/webhooks).
- **Legal:** `app/privacidad/page.tsx` y `app/aviso-legal/page.tsx` con layout compartido
  `components/legal-page.tsx`. Consentimiento RGPD obligatorio (art. 6.1.a) y rastro (fecha+IP) en
  el email (art. 7). Sin cookie banner: solo Vercel Analytics (gated por VERCEL, sin cookies).
- **Env nuevas:** `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_CONTACT_EMAIL`,
  `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CALENDLY_URL` (ver `.env.example`). El secreto se
  valida con `contactEnv` (patrón `createServerEnvValidator` de `@repo/config/env`) y la config
  pública con `getContactPublicConfig`, ambos en `lib/env.ts`. Las `NEXT_PUBLIC_*` se hornean en
  build: configúralas en Vercel antes de desplegar.
- **Email:** se envía con `getResend(key)` de `@repo/email` (lazy), pasando la key validada.
- **Nota UI:** la app usa el sistema de tokens Vergina Imperial (`globals.css`), no la capa de
  tokens shadcn de `@repo/ui`; por eso la landing y el formulario se estilan con esos tokens.

## Stack backend
- Supabase Auth SSR (login, register, Google OAuth)
- Prisma 5 (@repo/db) para data layer
- Stripe Subscriptions + Connect (@repo/stripe) para pagos
- Resend + React Email (@repo/email) para transaccionales
- tRPC v11 para API type-safe

## Reglas
- Server Components por defecto. "use client" solo para interactividad
- Middleware Supabase SSR protegiendo /(dashboard)
- RLS obligatorio en todas las queries
- Webhook Stripe verificado con constructEvent()
- PostHog NO activar sin consentimiento explicito
- Consumir tokens de @repo/brand (validados en alexendros.me)
- Rate limiting con @upstash/ratelimit en endpoints publicos

## Secciones
- Landing publica: catalogo de productos, pricing, waitlist
- Auth: login, register, reset-password, callback
- Dashboard: overview, billing, perfil, settings
- Legal: aviso-legal, privacidad, cookies, terminos
- API: tRPC router, webhooks Stripe, ARCO endpoints
