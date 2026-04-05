# 06 — Fases de Implementación

# Fases de Implementación

## Semana 0 (Actual) — Setup

```bash
# 1. Crear repo
ghq create alexendros-stagekit --private
cd alexendros-stagekit

# 2. Next.js 15 + TypeScript
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false

# 3. Dependencias core
npm i @prisma/client prisma
npm i @supabase/ssr @supabase/supabase-js
npm i stripe @stripe/stripe-js
npm i resend react-email
npm i @trpc/server @trpc/client @trpc/react-query
npm i zod react-hook-form @hookform/resolvers
npm i zustand
npm i -D @types/node vitest @playwright/test

# 4. shadcn/ui init
npx shadcn@latest init

# 5. Prisma init
npx prisma init
# Configurar DATABASE_URL en .env.local
# Pegar schema del doc/03 en prisma/schema.prisma
npx prisma migrate dev --name init

# 6. Variables de entorno
cp .env.example .env.local
# Rellenar todas las variables del doc/00 sección 5
```

## Semana 1-2 — Auth + Perfil

```bash
claude "Implementa auth flow completo con Supabase SSR:
- /app/(auth)/login, /register, /reset-password
- Middleware en middleware.ts que protege /(dashboard)
- Callback handler en /app/auth/callback/route.ts
- Al crear usuario: INSERT en tabla users + artist_profiles (Prisma)
- Google OAuth configurado
Referencia: doc/03 Schema DB"
```

## Semana 3-4 — EPK Builder

```bash
claude "Implementa EPK builder:
- /app/(dashboard)/epk/new: wizard 3 pasos (info, media, links)
- Preview en tiempo real
- Guardar como borrador vs publicar
- URL pública: /[slug] (fuera del dashboard, App Router)
- Template 'default': header con foto + bio + links sociales + formulario booking embebido
Referencia: doc/03 Schema DB modelo EPK"
```

## Semana 5 — Stripe + Suscripciones

```bash
claude "Implementa billing completo:
- /app/(dashboard)/billing: plan actual + upgrade button
- Checkout session para plan Pro (Stripe)
- Webhook handler completo (doc/04 sección Webhook Handler)
- Feature gates: comprobar plan en tRPC middleware antes de acciones premium
- Billing portal para gestionar suscripción"
```

## Semana 6 — Landing + SEO + Launch

```bash
claude "Implementa landing alexendros.me:
- Hero: headline UVP del doc/05
- Sección: EPK demo interactivo (iframe del EPK de ejemplo)
- Pricing: tabla 3 planes del doc/04
- JSON-LD: SoftwareApplication + Person schema
- Sitemap dinámico que incluya slugs de EPKs públicos
- OG images dinámicas con @vercel/og
- CWV: verificar LCP < 2.5s con unlighthouse"
```

## KPIs de lanzamiento (target mes 1)

| Métrica | Target |
| --- | --- |
| Artistas registrados | 50 |
| EPKs publicados | 30 |
| Trials iniciados | 20 |
| Conversión trial→Pro | ≥ 25% |
| Booking requests generados | 15 |
| MRR | ≥ 145 € |