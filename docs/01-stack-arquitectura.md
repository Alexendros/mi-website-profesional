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

---

## Rate Limiting

```yaml
provider: Upstash Redis (@upstash/ratelimit)
connection: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
algorithm: sliding-window

rules:
  /api/auth/*:
    limit: 5
    window: 60s
    identifier: IP
    action: 429 Too Many Requests

  /api/trpc/*:
    limit: 30
    window: 60s
    identifier: userId (JWT) || IP (anónimo)
    action: 429 Too Many Requests

  /api/webhooks/stripe:
    limit: none
    nota: Stripe controla su propio rate; verificar firma HMAC es suficiente

  /api/account/export:
    limit: 2
    window: 3600s
    identifier: userId
    action: 429 + log en AuditLog

  /api/account/delete:
    limit: 1
    window: 86400s
    identifier: userId
    action: 429 + log en AuditLog
```

### Implementación

```typescript
// packages/config/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const rateLimiters = {
  auth: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    prefix: 'rl:auth',
  }),
  api: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(30, '60 s'),
    prefix: 'rl:api',
  }),
  exportData: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(2, '1 h'),
    prefix: 'rl:export',
  }),
};
```

---

## Monitoring y Observabilidad

```yaml
errores:
  provider: Sentry
  config:
    dsn: NEXT_PUBLIC_SENTRY_DSN
    tracesSampleRate: 0.2        # 20% de transacciones en producción
    profilesSampleRate: 0.1
    environment: production | preview | development
  reglas:
    - Anonimizar emails e IDs antes de enviar (ver §3 CLAUDE.md)
    - Ignorar: ResizeObserver loop, Network request failed
    - Alertas Slack: errores con >5 ocurrencias/hora

analytics_producto:
  provider: PostHog
  config:
    host: https://eu.posthog.com  # Región EU — sin transferencia a EEUU
    key: NEXT_PUBLIC_POSTHOG_KEY
    autocapture: false            # Solo eventos explícitos
    consentimiento: obligatorio antes de cargar SDK (RGPD Art. 6.1.a)
  funnels_clave:
    - Landing → Waitlist signup
    - Signup → Onboarding completado
    - Free → Checkout Pro
    - Checkout → Pago exitoso
  métricas_retención:
    - DAU/MAU ratio
    - Feature adoption por Kit

cwv:
  provider: Vercel Speed Insights
  targets:
    LCP: < 2.0s desktop / < 2.5s mobile
    INP: < 200ms
    CLS: < 0.1
  alerta: Vercel notifica si CWV degrada vs baseline

uptime:
  provider: Better Uptime
  monitores:
    - url: https://alexendros.me
      interval: 60s
      alerta: email + Slack
    - url: https://stagekit.app
      interval: 60s
      alerta: email + Slack
    - url: https://n8n.example.com/healthz
      interval: 300s
      alerta: email
  status_page: status.alexendros.me (público)
  sla_target: 99.5% uptime mensual
```

---

## Respuesta a incidentes

```
1. DETECTAR — Alerta Better Uptime / Sentry / reporte de usuario
2. CLASIFICAR
   - P0 (Crítico): servicio caído, datos comprometidos, pagos fallando
   - P1 (Alto): feature principal rota, degradación > 50% usuarios
   - P2 (Medio): feature secundaria rota, workaround disponible
   - P3 (Bajo): bug cosmético, edge case
3. CONTENER
   - P0: rollback Vercel inmediato (redeploy último deploy estable)
   - Si breach de datos: revocar tokens, bloquear acceso, notificar AEPD < 72h (Art. 33 RGPD)
4. RESOLVER — Fix en hotfix branch → PR → merge → deploy
5. COMUNICAR — Status page actualizada durante todo el incidente
6. POSTMORTEM — Documento en Notion: causa raíz, timeline, acciones preventivas
```

---

## Variables de entorno adicionales (Rate Limiting)

```bash
# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```