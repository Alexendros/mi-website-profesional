# CLAUDE.md — apps/alexendros-pro

Hub Alexendros en alexendros.pro.

> **Nota 2026-04-23**: la marca paraguas anterior fue retirada (ver `.archive/kitos-pre-reformulacion-2026-04-23/`). Pendiente reformular el concepto de producto.

## Contexto
- **Dominio:** alexendros.pro
- **Tipo:** App completa con backend (auth, DB, pagos, dashboard)
- **Proposito:** Sitio Alexendros con auth, pagos y suscripciones. Venta de productos verticales por reformular
- **Arquitectura:** Multi-producto, preparada para multiples aplicaciones verticales

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
