# CLAUDE.md — apps/alexendros-pro

Hub KitOS completo en alexendros.pro.

## Contexto
- **Dominio:** alexendros.pro
- **Tipo:** App completa con backend (auth, DB, pagos, dashboard)
- **Proposito:** Hub de productos KitOS. Venta de kits, suscripciones, afiliados, CRM
- **Arquitectura:** Multi-producto, preparada para multiples kits

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
- Landing publica: catalogo kits, pricing, waitlist
- Auth: login, register, reset-password, callback
- Dashboard: overview, billing, perfil, settings
- Legal: aviso-legal, privacidad, cookies, terminos
- API: tRPC router, webhooks Stripe, ARCO endpoints
