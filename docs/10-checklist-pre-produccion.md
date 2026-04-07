# ✅ CHECKLIST — Auditoría Pre-Producción

> **Propósito:** Verificar integridad, coherencia y completitud de toda la documentación antes del primer `claude` en producción.
> 

> **Estado:** 🟡 EN REVISIÓN — completar todos los bloques antes de marcar LISTO
> 

> **Última revisión:** 2026-04-05 (actualizado: modelos DB 11, eventos Stripe 5, env vars multi-Kit)
> 

---

## BLOQUE A — Integridad Documental

> Verifica que cada documento existe, está accesible y no tiene secciones vacías.
> 
- [ ]  **00 [CLAUDE.md](http://CLAUDE.md)** — Legible desde Notion MCP en sesión Claude Code
- [ ]  **01 Stack** — Versiones de todas las dependencias especificadas (no rangos vagos)
- [ ]  **02 Design System** — Tokens CSS verificados contra modo oscuro
- [ ]  **03 Schema DB** — Todos los modelos tienen `@@map()` y relaciones definidas
- [ ]  **04 Pagos** — `STRIPE_PRICE_STAGEKIT_PRO_MONTHLY` y `STRIPE_PRICE_STAGEKIT_AGENCY_MONTHLY` tienen IDs reales (no placeholder)
- [ ]  **05 Marketing** — UVP aprobado por el owner. Headlines no son borradores.
- [ ]  **06 Fases** — Semana 0 completada antes de iniciar Semana 1
- [ ]  **07 Compliance** — Textos legales `/legal/*` revisados por letrado
- [ ]  **08 Templates** — Template EPK `default` probado con datos reales de un artista
- [ ]  **09 CRM** — Pipeline tiene al menos 1 lead real antes del lanzamiento

---

## BLOQUE B — Infraestructura y Accesos

> Sin estos elementos activos, Claude Code no puede ejecutar ninguna tarea de producción.
> 

### B.1 Cuentas y servicios

- [ ]  **Vercel** — Proyecto creado, dominio `alexendros.me` conectado, SSL activo
- [ ]  **Supabase** — Proyecto creado en región `eu-west-1` (Frankfurt). RLS activado.
- [ ]  **Stripe** — Cuenta en modo Live. Plans Pro + Agency creados. Webhook endpoint registrado.
- [ ]  **Resend** — Dominio verificado (`alexendros.me`). DKIM + SPF configurados.
- [ ]  **Sentry** — Proyecto `alexendros-stagekit` creado. DSN obtenido.
- [ ]  **PostHog** — Proyecto creado. API key obtenida. Confirmar región EU.
- [ ]  **GitHub** — Repo `alexendros-stagekit` privado creado. Branch protection en `main`.
- [ ]  **Better Uptime** — Monitor creado para `alexendros.me` y `stagekit.app`

### B.2 Variables de entorno

- [ ]  `.env.local` con las 12 variables del doc/00 §5 completadas (sin placeholders)
- [ ]  Variables subidas a Vercel (Settings → Environment Variables) para `production` y `preview`
- [ ]  `env.ts` con validación Zod creado y funcionando (`npm run build` sin errores de env)
- [ ]  `SUPABASE_SERVICE_ROLE_KEY` **NO** tiene prefijo `NEXT_PUBLIC_` (crítico: server-only)
- [ ]  `DATABASE_URL` apunta al pooler port `6543` (PgBouncer). `DIRECT_URL` a port `5432`.

### B.3 MCPs en `.claude/mcp.json`

- [ ]  MCP Notion configurado y autenticado (`NOTION_TOKEN` válido)
- [ ]  MCP Supabase configurado (`SUPABASE_ACCESS_TOKEN` válido)
- [ ]  MCP Stripe configurado (`STRIPE_SECRET_KEY` test key para desarrollo)
- [ ]  MCP GitHub configurado (`GH_TOKEN` con permisos `repo` + `workflow`)
- [ ]  Test de conexión: ejecutar `claude "lista las páginas de Notion del hub"` y verificar respuesta

---

## BLOQUE C — Código Base (Semana 0)

> El repo debe estar en este estado exacto antes del primer prompt de negocio.
> 

### C.1 Proyecto Next.js

- [ ]  `create-next-app` ejecutado con flags: `--typescript --tailwind --app`
- [ ]  `tsconfig.json` con `"strict": true` confirmado
- [ ]  `tailwind.config.ts` con `darkMode: 'class'` configurado
- [ ]  `shadcn init` completado con config del doc/02 (style: `new-york`, baseColor: `zinc`)
- [ ]  Componentes shadcn del doc/02 instalados (verificar con `ls components/ui/`)

### C.2 Prisma + Supabase

- [ ]  `prisma/schema.prisma` contiene los 11 modelos del doc/03 (Kit, User, Plan, Subscription, ClientProfile, KitProfile, InboundRequest, Affiliate, AffiliatePayout, AuditLog, DigitalRegistration)
- [ ]  `npx prisma migrate dev --name init` ejecutado sin errores
- [ ]  `npx prisma studio` abre y muestra las 11 tablas
- [ ]  Policies RLS del doc/03 aplicadas en Supabase SQL Editor
- [ ]  Verificación RLS: request sin JWT devuelve 0 filas en tablas protegidas

### C.3 Stripe

- [ ]  `lib/stripe/plans.ts` creado con constantes `PLANS` del doc/04
- [ ]  Checkout session funciona en modo test (card `4242 4242 4242 4242`)
- [ ]  Webhook recibe evento en local (`stripe listen` activo)
- [ ]  Handler procesa `checkout.session.completed` y actualiza `subscriptions` en DB

### C.4 Calidad de código

- [ ]  `npm run build` sin errores TypeScript
- [ ]  `npm run lint` (ESLint) sin warnings críticos
- [ ]  No existe ningún `@ts-ignore` ni `as any` en el codebase
- [ ]  No existe ninguna API key hardcodeada (verificar con `grep -r "sk_" src/`)

---

## BLOQUE D — Seguridad

> Requisitos no negociables antes de cualquier deploy a producción.
> 
- [ ]  **Auth:** Middleware de Supabase SSR protege todas las rutas `/(dashboard)/*`
- [ ]  **CSRF:** tRPC con `httpBatchLink` usa `credentials: 'same-origin'`
- [ ]  **Headers HTTP:** `next.config.ts` tiene `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- [ ]  **Rate limiting:** `/api/webhooks/stripe` y `/api/auth/*` con Vercel Edge Config o `@upstash/ratelimit`
- [ ]  **RLS doble verificación:** ninguna ruta de API hace query con `service_role` key a menos que sea admin explicitamente comprobado
- [ ]  **Secrets scan:** GitHub Actions con `gitleaks` o `trufflehog` en cada PR
- [ ]  **Dependencias:** `npm audit` sin vulnerabilidades `high` o `critical`
- [ ]  **Stripe webhook:** firma verificada con `constructEvent()` antes de procesar
- [ ]  **CORS:** `/api/*` solo acepta origen propio en producción

---

## BLOQUE E — Compliance Legal

> Bloquea el deploy si alguno de estos no está listo.
> 
- [ ]  **Aviso Legal** (`/legal/aviso-legal`) publicado — Art. 10 LSSI-CE (RD 1/2002)
- [ ]  **Política de Privacidad** (`/legal/privacidad`) publicada — Art. 13 RGPD (UE 2016/679)
- [ ]  **Política de Cookies** (`/legal/cookies`) publicada — Guía AEPD 2023
- [ ]  **Términos y Condiciones** (`/legal/terminos`) publicados — con cláusula SaaS (suspensión, reembolsos, SLA)
- [ ]  **Banner cookies** implementado: no carga PostHog/Meta Pixel hasta consentimiento `accept`
- [ ]  **DPA Stripe** firmado (disponible en Stripe Dashboard → Settings → Legal)
- [ ]  **DPA Supabase** disponible (región EU, no requiere firma manual)
- [ ]  **Endpoint ARCO** (`/api/account/delete` + `/api/account/export`) funcional y documentado
- [ ]  **Registro de actividades** (Art. 30 RGPD) — documento interno actualizado
- [ ]  **Textos revisados por letrado** — firma o validación escrita del revisor y fecha

---

## BLOQUE F — Rendimiento (CWV Pre-Launch)

> Verificar antes del lanzamiento con herramientas oficiales.
> 
- [ ]  **LCP < 2.5s** — medido con `unlighthouse` o PageSpeed Insights en staging
- [ ]  **INP < 200ms** — medido con Chrome DevTools → Performance → Interaction to Next Paint
- [ ]  **CLS < 0.1** — imágenes con `width`/`height` explícitos, no hay layout shifts
- [ ]  **Fuentes** — `next/font` con `display: swap`. Verificar no hay FOUT en 3G throttled.
- [ ]  **Imágenes** — todas pasan por `next/image`. WebP/AVIF servido automáticamente.
- [ ]  **Bundle** — `@next/bundle-analyzer` ejecutado. No hay dependencias >100KB sin justificación.
- [ ]  **Lighthouse score** — Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 95, SEO ≥ 95

---

## BLOQUE G — SEO Técnico

- [ ]  `app/layout.tsx` tiene `metadata` completo: `title`, `description`, `openGraph`, `twitter`
- [ ]  `app/sitemap.ts` genera sitemap dinámico incluyendo slugs de EPKs públicos
- [ ]  `app/robots.ts` configurado: indexar marketing, bloquear dashboard y API
- [ ]  JSON-LD `Person` en `/` ([alexendros.me](http://alexendros.me)) con `name`, `url`, `sameAs` (redes sociales)
- [ ]  JSON-LD `SoftwareApplication` en landing de StageKit
- [ ]  OG images dinámicas via `@vercel/og` para EPKs públicos (`/[slug]/opengraph-image.tsx`)
- [ ]  Canonical URLs en todas las páginas
- [ ]  `hreflang` para ES/EN en páginas bilingues

---

## BLOQUE H — Tests

- [ ]  **Unit (Vitest):** funciones de `lib/stripe/plans.ts`, helpers de Prisma, validaciones Zod
- [ ]  **Integration:** webhook handler procesando los 5 eventos Stripe del doc/04
- [ ]  **E2E (Playwright):**
    - [ ]  Registro de usuario nuevo → onboarding → primer EPK publicado
    - [ ]  Flujo de checkout Pro (Stripe test mode)
    - [ ]  Booking request enviada por promotor anónimo → artista la recibe
    - [ ]  Login / logout / protección de rutas autenticadas
- [ ]  **Coverage mínimo:** 60% en `lib/` y `app/api/`
- [ ]  Tests ejecutan en GitHub Actions en cada PR a `main`

---

## BLOQUE I — Gaps Identificados en la Documentación Actual

> ⚠️ Estos items requieren acción antes de pasar a producción. No son bloqueantes del setup inicial pero sí del lanzamiento público.
> 

| # | Gap detectado | Documento afectado | Acción requerida | Prioridad |
| --- | --- | --- | --- | --- |
| G1 | `STRIPE_PRICE_STAGEKIT_PRO_MONTHLY` y `STRIPE_PRICE_STAGEKIT_AGENCY_MONTHLY` son placeholders | doc/04 | Crear planes en Stripe Dashboard y actualizar IDs reales | 🔴 ALTA |
| G2 | `stagekit.app` sin confirmar disponibilidad/registro | doc/00, doc/05 | Verificar y registrar dominio en Namecheap/Cloudflare | 🔴 ALTA |
| G3 | Design System sin paleta de colores validada en dark mode real | doc/02 | Crear `design-test.html` con tokens y verificar contraste WCAG AA | 🟡 MEDIA |
| G4 | ~~Schema DB no tiene modelo `AuditLog`~~ **RESUELTO** — AuditLog + DigitalRegistration añadidos | doc/03 | ✅ Completado | ✅ |
| G5 | No hay definición de SLA en Términos de Servicio | doc/07 | Definir uptime mínimo (99.5%) y proceso de reembolso | 🟡 MEDIA |
| G6 | Falta `env.ts` con validación Zod de variables de entorno | doc/00 | Crear `/lib/env.ts` antes de primer deploy | 🔴 ALTA |
| G7 | No hay estrategia de backup de DB documentada | doc/03 | Documentar backup diario Supabase + retención 30 días | 🟡 MEDIA |
| G8 | Rate limiting no especificado en ningún documento | doc/00 | Añadir Upstash Redis config al doc/01 y regla al doc/00 | 🟡 MEDIA |
| G9 | CRM no tiene integración con n8n para automatizar seguimiento | doc/09 | Diseñar workflow n8n: nuevo cliente → notificación + tarea | 🟒 BAJA |
| G10 | Templates de email React no documentados | doc/08 | Listar los 5 templates mínimos con variables necesarias | 🟡 MEDIA |

---

## FIRMA DE APROBACIóN

> Completar antes de iniciar sesión de producción con Claude Code.
> 

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| Owner / Dev | Alejandro Domingo Agustí | ___ | ⏳ Pendiente |
| Revisor Legal | ___ | ___ | ⏳ Pendiente |

---

## CRITERIO DE PASO A PRODUCCIóN

```
Bloques A, B, C, D, E → 100% completados = GREEN LIGHT ✅
Bloques F, G, H → Completar antes del lanzamiento público
Bloque I Gaps G1, G2, G6 → Resolver antes del primer deploy
```

> Una vez este checklist esté en estado GREEN LIGHT, iniciar con:
> 

> `claude "Lee CLAUDE.md en Notion y prepara el entorno Semana 0 del doc/06"`
>