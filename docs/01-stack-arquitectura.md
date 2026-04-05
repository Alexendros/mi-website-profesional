# 01 — Stack & Arquitectura

## Decisión: Vercel vs Hostinger VPS

| Criterio | Vercel | Hostinger VPS |
| --- | --- | --- |
| Deploy Next.js | Nativo (1 click) | Manual (Docker + Nginx) |
| Edge Network | 100+ PoPs global | Región única |
| CWV automático | Speed Insights built-in | Configurar manualmente |
| Observabilidad | Logs + Analytics + Traces | ELK stack manual |
| Costo MVP | Free → Pro $20/mes | VPS desde $12/mes + ops |
| Escalado | Automático (serverless) | Manual (resize VPS) |
| **Veredicto** | ✅ **ELEGIDO** | Auxiliar (n8n, cron) |

## Stack completo

```yaml
frontend:
  framework: Next.js 15.x (App Router)
  language: TypeScript 5.x (strict)
  ui_components: shadcn/ui (Radix UI + Tailwind)
  styling: Tailwind CSS 4.x
  state: Zustand (client) + React Query (server cache)
  forms: React Hook Form + Zod
  animations: Framer Motion 12

backend:
  runtime: Node.js 22 (Vercel Functions)
  edge_runtime: Vercel Edge (middleware, auth checks)
  api_layer: tRPC v11 (type-safe end-to-end)
  auth: Supabase Auth (SSR)
  file_storage: Supabase Storage (EPK assets, press photos)

database:
  primary: PostgreSQL 16 via Supabase
  orm: Prisma 5.x
  migrations: prisma migrate
  rls: Supabase RLS (habilitado en todas las tablas)
  vector: pgvector (para búsqueda semántica de artistas)

pagos:
  provider: Stripe
  model: Subscriptions + one-time (EPK Pro upgrade)
  compliance: PCI DSS SAQ-A · SCA/3DS2 PSD2 UE
  webhook_handler: /api/webhooks/stripe (Edge Function)

email:
  transaccional: Resend + React Email
  marketing: Resend Broadcasts
  sequences: n8n (VPS Hostinger auxiliar)

monitoring:
  errors: Sentry
  analytics_producto: PostHog (con consentimiento)
  cwv: Vercel Speed Insights
  uptime: Better Uptime

automatizacion:
  workflows: n8n (self-hosted VPS Hostinger)
  triggers: webhooks Stripe + Supabase DB webhooks

ci_cd:
  platform: GitHub Actions + Vercel CI
  tests: Vitest (unit) + Playwright (E2E)
  branch_strategy: main (prod) · dev (staging) · feature/*
```

## Diagrama de flujo (simplificado)

```
User → Vercel Edge (middleware auth) → Next.js App
                                        ├→ Supabase Auth (verify JWT)
                                        ├→ tRPC Router → Prisma → Supabase PG
                                        ├→ Stripe API (pagos)
                                        └→ Supabase Storage (archivos)

Stripe → /api/webhooks/stripe → Prisma (actualizar subscripción)
                              → Resend (email confirmación)
                              → n8n (trigger onboarding sequence)
```