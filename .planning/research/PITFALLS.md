# Pitfalls Research: KitOS Platform

> **Audiencia:** Alejandro Domingo Agustí — desarrollador en solitario construyendo un monorepo multi-kit SaaS.
> **Fecha:** 2026-04-06
> **Stack:** Next.js 15 App Router · Turborepo · Supabase · Prisma 5 · Stripe Connect · n8n self-hosted · Vercel

---

## Critical Pitfalls (romperán producción)

### CP-01 — Supabase Auth SSR: Middleware que no refresca el token

**Qué es:** El token JWT de Supabase expira cada 60 minutos. En Next.js 15 App Router, si el middleware no llama a `supabase.auth.getUser()` (y no al deprecado `getSession()`), el servidor no refresca el token aunque el cliente lo tenga renovado. El resultado es que el usuario parece autenticado en el cliente pero todas las queries del servidor fallan con `401`. La sesión queda en un estado inconsistente indetectable en desarrollo porque localhost tiene latencia cero.

**Señales de alarma:**
- Usuarios reportan "cierre de sesión" aleatorio cada hora en producción.
- `getSession()` devuelve datos pero las queries RLS fallan.
- El middleware usa `getSession()` en lugar de `getUser()`.

**Prevención:**
```typescript
// CORRECTO — app/middleware.ts
const { data: { user } } = await supabase.auth.getUser()
// INCORRECTO — nunca usar en servidor:
const { data: { session } } = await supabase.auth.getSession()
```
- Usar `@supabase/ssr` (no el deprecado `auth-helpers-nextjs`).
- El middleware debe llamar `updateSession()` en CADA request, incluyendo rutas de assets.
- Configurar `matcher` para excluir `_next/static`, `_next/image`, `favicon.ico`.
- Cookiename prefix debe coincidir exactamente entre middleware y server components.

**Fase:** FASE 4 (DB-03) y FASE 6 (PRO-02). Validar antes de cualquier ruta protegida.

---

### CP-02 — Stripe Webhook: Duplicados y race conditions en pagos

**Qué es:** Stripe reintenta webhooks hasta 72 horas si no recibe `200`. Si el handler tarda más de 30 segundos o el servidor se reinicia durante el procesamiento, Stripe reintenta y el evento llega dos veces. Sin idempotency keys, esto provoca dobles suscripciones, dobles emails y estados de DB inconsistentes. En un sistema con n8n (W-11..W-17 dunning), un evento `invoice.payment_failed` duplicado puede suspender una cuenta que acaba de pagar.

**Señales de alarma:**
- El handler hace la lógica de negocio ANTES de responder `200`.
- No existe columna `stripe_event_id` con unique constraint en la tabla de audit.
- Los webhooks se procesan sincrónicamente en el handler.

**Prevención:**
```typescript
// 1. Verificar firma SIEMPRE antes de cualquier lógica
const event = stripe.webhooks.constructEvent(body, sig, secret)

// 2. Responder 200 INMEDIATAMENTE después de verificar
res.json({ received: true })

// 3. Procesar en background (queue o async)
await processStripeEvent(event) // dentro del handler pero tras el 200

// 4. Idempotency check — insertar con ON CONFLICT DO NOTHING
await db.auditLog.upsert({
  where: { stripeEventId: event.id },
  create: { stripeEventId: event.id, ... },
  update: {} // no hacer nada si ya existe
})
```
- Registrar `event.id` en `AuditLog` y rechazar duplicados antes de procesar.
- Para eventos críticos (`subscription.deleted`), usar transacción DB + update atómico.
- Evento `checkout.session.completed` y `customer.subscription.updated` pueden llegar en orden inverso: diseñar handlers idempotentes que no asuman orden.

**Fase:** FASE 5 (PAY-02). Testear con `stripe trigger` todos los 5 eventos antes de producción.

---

### CP-03 — RLS Supabase: Service Role Key expuesta al cliente

**Qué es:** La `SUPABASE_SERVICE_ROLE_KEY` bypasea TODAS las políticas RLS. Si se usa en un Server Component o Route Handler pero el valor se filtra al bundle del cliente (mediante `NEXT_PUBLIC_` prefix o serialización incorrecta en `props`), cualquier usuario puede leer todos los datos de todos los tenants. Es el error de seguridad más catastrófico posible en este stack.

**Señales de alarma:**
- Variable definida como `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`.
- `createClient(url, serviceRoleKey)` usado en archivos dentro de `app/` sin `"use server"`.
- El cliente service role se exporta desde un módulo compartido con componentes cliente.

**Prevención:**
- Nunca prefijo `NEXT_PUBLIC_` en la service role key. Solo en `url` y `anon key`.
- Dos clientes Supabase explícitos:
  - `createServerClient()` — solo en Server Components, Route Handlers, Server Actions.
  - `createBrowserClient()` — solo en `"use client"` components con anon key.
- El cliente admin (service role) solo en `/app/api/admin/*` con verificación de rol previa.
- Validar con `env.ts` Zod que `SUPABASE_SERVICE_ROLE_KEY` no tiene prefijo público.

**Fase:** FASE 4 (DB-03). Auditoria automática en CI: `grep -r "SUPABASE_SERVICE_ROLE" apps/ --include="*.tsx"`.

---

### CP-04 — Next.js 15 Caching: Datos obsoletos en producción

**Qué es:** Next.js 15 cambió el comportamiento de caché por defecto: Route Handlers y `fetch()` ya NO cachean por defecto (a diferencia de Next.js 13/14). Sin embargo, los segmentos de layout y page SÍ tienen Full Route Cache activo. Si se mezclan datos dinámicos (suscripción del usuario) con layouts cacheados, el usuario puede ver su plan antiguo durante horas después de un upgrade. El problema es invisible en desarrollo (caché desactivado).

**Señales de alarma:**
- Dashboard muestra plan "Free" después de pagar Pro.
- Datos de usuario correctos en DB pero incorrectos en UI.
- `revalidatePath()` no se llama después de mutaciones en Server Actions.
- Layouts con `export const revalidate = 3600` que contienen datos de usuario.

**Prevención:**
```typescript
// En layouts con datos de usuario: SIEMPRE dinámico
export const dynamic = 'force-dynamic'

// En Server Actions tras mutación:
import { revalidatePath } from 'next/cache'
revalidatePath('/dashboard')

// En Route Handlers de datos personales:
export const dynamic = 'force-dynamic'
// o
headers.set('Cache-Control', 'no-store')
```
- Separar datos estáticos (landing, pricing) de datos dinámicos (dashboard) en layouts distintos.
- El webhook handler de Stripe debe llamar `revalidatePath('/dashboard')` tras actualizar subscripción.

**Fase:** FASE 6 (PRO-03) y FASE 7 (SK-06). Testear el flujo upgrade Pro con caché de producción antes de lanzar.

---

### CP-05 — n8n Self-Hosted: Pérdida de workflows por OOM

**Qué es:** n8n en modo `sqlite` (default) guarda toda la historia de ejecuciones en disco. Con 28 workflows activos procesando dunning, emails y bookings, en 2-3 meses la base de datos SQLite puede superar 2GB. Si el VPS Hostinger tiene poca RAM y el proceso n8n hace un full scan de la tabla de ejecuciones, el proceso muere con OOM Killer. Todos los webhooks pendientes se pierden sin retries. Los workflows de dunning (W-11..W-17) afectan directamente revenue.

**Señales de alarma:**
- n8n configurado con `DB_TYPE=sqlite` (default).
- Sin límite en `EXECUTIONS_DATA_MAX_AGE`.
- Sin configurar `EXECUTIONS_DATA_PRUNE=true`.
- Hostinger VPS con < 2GB RAM sin swap configurado.

**Prevención:**
- Migrar a PostgreSQL desde el inicio: `DB_TYPE=postgresdb` apuntando al mismo Supabase (schema separado o instancia dedicada).
- Configurar en `.env` de n8n:
  ```
  EXECUTIONS_DATA_PRUNE=true
  EXECUTIONS_DATA_MAX_AGE=720        # horas (30 días)
  EXECUTIONS_DATA_PRUNE_MAX_COUNT=10000
  N8N_METRICS=true                   # para monitorear
  ```
- Queue mode con Redis para workflows críticos (dunning, pagos).
- Monitor de uptime (Better Uptime) apuntando a `n8n.alexendros.me/healthz`.

**Fase:** FASE 7.5 (N8N-01..N8N-06). Configurar PostgreSQL para n8n ANTES de crear el primer workflow de producción.

---

### CP-06 — Stripe Connect Express: Payouts bloqueados por KYC incompleto

**Qué es:** Cuando un afiliado se da de alta en Stripe Connect Express, Stripe realiza verificación KYC progresiva. Inicialmente permite recibir fondos pero bloquea los payouts hasta verificar identidad. El afiliado puede ver dinero acumulado en su balance pero no retirarlo durante días o semanas. Si el sistema automático (W-28) intenta transferir fondos antes de que el account esté en `charges_enabled: true` Y `payouts_enabled: true`, la transferencia falla silenciosamente o genera un error 400 que puede romper el workflow.

**Señales de alarma:**
- `transfer.created` manejado pero no `account.updated` (donde se detecta KYC completado).
- No verificar `account.payouts_enabled` antes de ejecutar W-28.
- Afiliados sin email de bienvenida que explique el proceso KYC.

**Prevención:**
```typescript
// Verificar antes de cualquier payout
const account = await stripe.accounts.retrieve(affiliateStripeAccountId)
if (!account.payouts_enabled || !account.charges_enabled) {
  // Notificar al afiliado con link de onboarding KYC
  // No ejecutar payout, programar reintento
  return
}
```
- Escuchar evento `account.updated` para notificar al afiliado cuando KYC está completo.
- Webhook para `account.updated` en el handler de Stripe (añadir a los 5 eventos actuales del doc/04).
- Email automatizado con n8n explicando KYC al registrarse como afiliado.
- En España: Stripe requiere NIF/NIE para afiliados personas físicas — documentarlo en el onboarding.

**Fase:** FASE 5 (PAY-03). No testear en producción hasta verificar flujo completo en Stripe test mode con cuentas KYC simuladas.

---

## Common Mistakes (perderán tiempo)

### CM-01 — Turborepo: Dependencias internas mal tipadas

**Qué es:** En un monorepo pnpm + Turborepo, los packages internos (`@repo/ui`, `@repo/db`) deben declararse en `package.json` de las apps como `"@repo/ui": "*"` y también en `pnpm-workspace.yaml`. Si solo se hace uno, `pnpm install` funciona pero `turbo build` falla con "module not found" porque el cache no encuentra el artefacto construido del package.

**Cómo evitar:**
- Cada package compartido necesita su propio `build` script que genere los artefactos.
- `turbo.json` debe declarar la dependencia: `"dependsOn": ["^build"]` en el pipeline de apps.
- Para packages que solo exportan TypeScript (sin compilar): usar `exports` en `package.json` apuntando directamente a `.ts` files con `"types"` field. Turborepo 2.x soporta esto con `tsconfig` paths.
- No mezclar `main` (CJS) y `module` (ESM) en packages internos — elegir ESM y configurar `"type": "module"`.

---

### CM-02 — Prisma + Supabase Pooler: Errores de conexión en serverless

**Qué es:** Vercel Functions son serverless — cada invocación puede crear una conexión nueva a la DB. Con Prisma en modo directo (port 5432), esto agota el pool de Postgres en minutos bajo carga. `DATABASE_URL` debe apuntar siempre al pooler de Supabase (PgBouncer, port 6543) con `?pgbouncer=true&connection_limit=1`. `DIRECT_URL` (port 5432) solo para migraciones.

**Cómo evitar:**
```
DATABASE_URL="postgresql://...@db.xxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://...@db.xxx.supabase.co:5432/postgres"
```
En `schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```
- Añadir `connection_limit=1` para entornos serverless (Vercel Edge).
- Nunca ejecutar migraciones con `DATABASE_URL` del pooler — siempre usar `DIRECT_URL`.

---

### CM-03 — Turborepo Build Cache: Cache inválido por variables de entorno

**Qué es:** Turborepo hashea los inputs para determinar si el cache es válido. Si las variables de entorno no están declaradas en `turbo.json` bajo `globalEnv` o `env` por tarea, el build se cachea incorrectamente aunque cambie el valor de `NEXT_PUBLIC_*`. El resultado es builds cacheados que incluyen valores de env de un entorno diferente (staging → producción).

**Cómo evitar:**
```json
// turbo.json
{
  "globalEnv": ["NODE_ENV"],
  "tasks": {
    "build": {
      "env": [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        "NEXT_PUBLIC_POSTHOG_KEY"
      ],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```
- Declarar TODAS las variables `NEXT_PUBLIC_*` en el campo `env` de la tarea `build`.
- En Vercel Remote Cache: verificar que los tokens de equipo coinciden entre CI y deploy.

---

### CM-04 — Next.js 15 Server Actions: Validación solo en servidor

**Qué es:** Las Server Actions son invocables directamente mediante fetch desde el navegador aunque no haya UI que lo permita. Si la validación Zod o la verificación de autenticación está solo en el componente cliente, un usuario malicioso puede llamar la action directamente con datos arbitrarios.

**Cómo evitar:**
```typescript
// Toda Server Action debe empezar así:
'use server'
export async function updateKitProfile(data: unknown) {
  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. Validación Zod en servidor (no confiar en validación cliente)
  const parsed = KitProfileSchema.safeParse(data)
  if (!parsed.success) throw new Error('Invalid data')

  // 3. RLS check implícito por usar el cliente con cookie del usuario
  await db.kitProfile.update({ where: { userId: user.id }, data: parsed.data })
}
```

---

### CM-05 — tRPC v11 + Next.js 15: Hydration mismatch

**Qué es:** tRPC v11 con React Query puede causar hydration mismatches si los Server Components prefetchen datos pero el cliente los re-fetcha con parámetros distintos. En modo desarrollo el error es silencioso; en producción puede romper la UI o mostrar contenido incorrecto al usuario.

**Cómo evitar:**
- Usar `HydrateClient` y `prefetch` correctamente en Server Components según docs tRPC v11.
- No usar `useQuery` en Server Components — solo en `"use client"` components.
- Para datos críticos de usuario (plan, suscripción): fetch en Server Component + pasar como props, sin tRPC en el cliente para esos datos.

---

### CM-06 — React Email + Resend: Emails en spam por SPF/DKIM

**Qué es:** Los emails de bienvenida, trial-ending y dunning son críticos para revenue. Si DKIM y SPF no están correctamente configurados en `alexendros.me`, los emails de Resend caen en spam. El dunning (W-11..W-17) falla silenciosamente porque el usuario nunca ve el aviso de impago.

**Cómo evitar:**
- Configurar en DNS: registro SPF `v=spf1 include:_spf.resend.com ~all` y DKIM de Resend.
- Verificar con `mail-tester.com` y `mxtoolbox.com` antes del primer email de producción.
- Usar dominio propio (`no-reply@alexendros.me`) — no el dominio genérico de Resend.
- DMARC: `v=DMARC1; p=quarantine; rua=mailto:dmarc@alexendros.me` para proteger el dominio.

---

### CM-07 — Tailwind v4 + shadcn/ui: Incompatibilidades de configuración

**Qué es:** Tailwind v4 usa CSS-first configuration (`@import "tailwindcss"` en CSS, no `tailwind.config.ts` para colores). shadcn/ui hasta abril 2026 tiene soporte parcial para Tailwind v4 — algunos componentes usan variables CSS v3 (`--background`, `--foreground`) que pueden requerir mapping manual. Los tokens oklch del `packages/brand` pueden no generarse correctamente si el preset de Tailwind no se configura bien.

**Cómo evitar:**
- Verificar versión de shadcn/ui compatible con Tailwind v4 en el momento de instalación.
- El preset de Tailwind en `packages/config` debe exportar la configuración base y cada app la extiende.
- Testear el sistema de tokens en dark mode antes de construir componentes (Gap G3 del checklist).
- Tener un archivo `design-test.html` mínimo para verificar contraste WCAG AA en cada paleta.

---

## Solo Developer Risks

### SDR-01 — Scope Creep silencioso

**El patrón:** Cada feature parece "pequeña" pero suma. El proyecto ya tiene 3 apps (alexendros.me, alexendros.pro, stagekit.app) + 5 packages + 28 workflows n8n + compliance RGPD. La sección "Out of Scope" de PROJECT.md tiene 13 items. El riesgo no es ignorar ese Out of Scope — es añadir "solo esto más" durante la implementación.

**Síntomas de alerta:**
- Implementar el calendario de disponibilidad "ya que estoy con el dashboard".
- Añadir i18n (EN/ES) "porque ya tengo hreflang".
- Construir una API REST completa "por si acaso".
- Modelar multi-tenancy Agency "para no tener que refactorizar después".

**Estrategia:**
- Antes de cualquier feature nueva no planificada: escribir en PROJECT.md, sección "Out of Scope" con razón. Si no cabe ahí, pertenece al backlog de una fase posterior.
- North Star Metric: "¿esto aumenta booking requests por semana en StageKit?" Si no, no es prioridad ahora.
- Usar la regla de las 2 semanas: si no se puede implementar en < 2 semanas de trabajo real, dividir en fases o eliminar del MVP.

---

### SDR-02 — Deuda técnica por herramientas de IA acumulada

**El patrón:** Claude Code puede generar código correcto pero inconsistente entre sesiones si el contexto no es claro. Sin revisión humana de cada fragmento generado, el código puede acumularse con patrones mezclados: algunos componentes con `"use client"` innecesario, otros sin validación Zod, otros con `any` en TypeScript. Pasadas semanas, refactorizar es más costoso que haberlo hecho bien desde el inicio.

**Estrategia:**
- Ejecutar `pnpm turbo lint typecheck` después de CADA sesión de Claude Code.
- El skill `simplify` existe por esta razón — usarlo antes de hacer commit en features complejas.
- Branch protection en `main`: nunca merge sin pasar CI (lint + typecheck + tests).
- Revisar manualmente cualquier componente que Claude genere con más de 150 líneas.

---

### SDR-03 — Burnout por infraestructura antes de producto

**El patrón:** Las semanas 1-4 (FASES 0-3) son pura infraestructura: Turborepo, tokens, shadcn, alexendros.me estático. Es trabajo necesario pero sin feedback de usuarios. La tentación es perfeccionar el Design System antes de tener un solo usuario. Esto es la variante más peligrosa de premature optimization para un solo desarrollador.

**Estrategia:**
- Timeboxing estricto: alexendros.me estático debe estar en producción antes de día 30.
- El Design Token System (BRAND-01..BRAND-03) es necesario pero no perfecto — lo suficientemente bueno para lanzar es suficiente.
- Un usuario beta en StageKit en semana 8 vale más que un sistema de diseño perfecto en semana 10.
- Tracking visual del progreso: marcar milestones en PROJECT.md al completarlos.

---

### SDR-04 — Dependencia excesiva de free tiers

**El patrón:** El proyecto usa free tiers de Supabase, Vercel, Sentry, PostHog, Better Uptime. Con el primer usuario de pago real, los límites aparecen: Supabase Free tiene 500MB DB, 2GB bandwidth, 50.000 MAUs. Vercel Free tiene 100GB bandwidth. n8n en VPS Hostinger puede tener restricciones de CPU bajo carga sostenida.

**Límites críticos a monitorear:**
| Servicio | Límite Free | Coste upgrade | Cuando escalar |
|----------|-------------|---------------|----------------|
| Supabase | 500MB DB, 50k MAU | $25/mes (Pro) | >10 artistas activos |
| Vercel | 100GB bandwidth | $20/mes (Pro) | >5k visitas/mes |
| Resend | 3k emails/mes | $20/mes (Starter) | >100 usuarios activos |
| Sentry | 5k errores/mes | $26/mes | Antes del lanzamiento público |

**Estrategia:** Presupuestar $100-150/mes para el primer año con usuarios reales. No construir el sistema asumiendo que los free tiers aguantarán siempre.

---

### SDR-05 — Falta de observabilidad en producción temprana

**El patrón:** En desarrollo todo funciona. En producción, los primeros usuarios encuentran errores que no se reproducen localmente: middleware SSR fallando, webhooks que llegan fuera de orden, n8n workflows que fallan silenciosamente. Sin observabilidad desde el día 1, los bugs son invisibles.

**Estrategia:**
- Sentry configurado ANTES del primer deploy de producción — no como mejora posterior.
- Better Uptime monitoreando los 3 dominios Y `n8n.alexendros.me/healthz` desde semana 1.
- Structured logging en todos los Route Handlers: `{ userId, action, status, durationMs }`.
- AuditLog en DB para eventos críticos: suscripción cambiada, pago procesado, cuenta eliminada.

---

## Compliance Pitfalls (consecuencias legales)

### COMP-01 — Consentimiento de cookies: Bloqueo real vs visual

**Qué es:** Muchas implementaciones muestran el banner de cookies pero cargan los scripts de analytics ANTES de que el usuario consienta. La AEPD considera esto una infracción del Art. 22 LSSI-CE. En auditorías de 2024-2025, la AEPD ha sancionado a sitios con banners "decorativos" que no bloquean la carga real.

**El error concreto:**
```html
<!-- INCORRECTO: PostHog carga antes del consentimiento -->
<script src="https://eu.posthog.com/..."></script>
<CookieBanner />

<!-- CORRECTO: PostHog carga SOLO tras consentimiento -->
<CookieBanner onAccept={() => loadPostHog()} />
```

**Prevención:**
- PostHog debe inicializarse solo dentro del callback `onAccept` del banner.
- El banner debe bloquear la carga de scripts de terceros mediante `dangerouslySetInnerHTML` condicional o lazy loading controlado.
- Cookie `cookie-consent` almacena la decisión: `accepted`, `rejected`, `partial`.
- Implementar `Consentimiento previo` — no `opt-out` — para cookies analíticas.
- Botón "Rechazar todas" visualmente equivalente a "Aceptar todo" (AEPD 2023).

**Consecuencia de ignorarlo:** Sanción AEPD hasta 10M€ o 2% facturación global (Art. 83.4 RGPD). Para empresa pequeña: multas reales de 3.000-50.000€ más publicidad negativa.

---

### COMP-02 — Derecho al olvido: Cascade DELETE incompleto

**Qué es:** El endpoint `/api/account/delete` debe eliminar TODOS los datos del usuario. Un Cascade DELETE de Prisma en la tabla `User` propaga si las relaciones tienen `onDelete: Cascade`, pero datos en Supabase Storage (fotos de perfil, logos), logs de Sentry (que incluyen userId) y registros en Stripe (customer) no se eliminan automáticamente.

**El error concreto:** El usuario solicita borrado. Se elimina la fila `User` en DB. Pero:
- Sus fotos siguen en Supabase Storage.
- Su `customerId` de Stripe sigue activo (datos de facturación en Stripe).
- Sus ejecuciones en n8n tienen su email en el payload.

**Prevención:**
```typescript
// /api/account/delete — orden correcto
async function deleteUserAccount(userId: string) {
  // 1. Cancelar suscripción activa en Stripe (no generar cobros futuros)
  await stripe.subscriptions.cancel(subscriptionId)

  // 2. Eliminar customer de Stripe (datos de pago)
  await stripe.customers.del(stripeCustomerId)

  // 3. Vaciar Supabase Storage del usuario
  await supabase.storage.from('kit-profiles').remove([`${userId}/`])

  // 4. Anonimizar AuditLog (no eliminar — requerido 5 años por fiscal)
  await db.auditLog.updateMany({
    where: { userId },
    data: { userId: 'ANONYMIZED', userEmail: 'ANONYMIZED' }
  })

  // 5. Eliminar User (cascade a tablas relacionadas)
  await db.user.delete({ where: { id: userId } })

  // 6. Revocar sesiones Supabase Auth
  await supabase.auth.admin.deleteUser(userId)
}
```
- Documentar el procedimiento en el Registro de Actividades (Art. 30 RGPD).
- Confirmar al usuario por email que los datos han sido eliminados (con plazo: 90 días para datos fiscales).

---

### COMP-03 — Transferencias internacionales: SCCs no firmadas

**Qué es:** Stripe procesa datos de ciudadanos EU pero tiene servidores en EEUU. Esto requiere Standard Contractual Clauses (SCCs) firmadas según Art. 46 RGPD. Stripe proporciona DPA automático pero debe ser aceptado explícitamente en el Dashboard. Lo mismo aplica a Vercel si los proyectos no están en región EU.

**El error:** Asumir que "Stripe es GDPR compliant" sin aceptar formalmente su DPA.

**Prevención:**
- Stripe Dashboard → Settings → Legal → Data Processing Agreement → Aceptar.
- Vercel: proyectos en región `mad1` (Madrid) o `fra1` (Frankfurt) — datos en EU.
- Documentar en el Registro de Actividades: proveedor, ubicación, SCC/DPA, fecha de firma.
- Revisión anual de DPAs (proveedores actualizan versiones).

---

### COMP-04 — LSSI-CE: Aviso legal incompleto en persona física

**Qué es:** Alejandro opera como persona física (autónomo). El Art. 10 LSSI-CE (Ley 34/2002) exige en el Aviso Legal: nombre completo, NIF, domicilio fiscal, email, actividad económica. Como persona física, el domicilio real queda expuesto públicamente. Muchos desarrolladores independientes omiten el domicilio o ponen uno de conveniencia — esto es infracción leve (hasta 30.000€).

**Prevención:**
- Opción 1: Darse de alta en el RETA como autónomo y usar domicilio fiscal (puede ser gestoría).
- Opción 2: Usar dirección de un coworking como domicilio fiscal.
- Opción 3 (no recomendada): Constituir SL para proteger domicilio personal — solo si la actividad lo justifica económicamente.
- El NIF (21002968N) debe aparecer en el Aviso Legal — esto es obligatorio y no negociable.

---

### COMP-05 — PSD2/SCA: Setup fees sin 3DS2

**Qué es:** El plan Agency tiene un setup fee. Los pagos únicos > 30€ en la UE requieren autenticación SCA (3DS2) obligatoria por PSD2. Si el setup fee se cobra como `amount` adicional en un PaymentIntent sin `payment_method_options.card.request_three_d_secure: 'any'`, algunos bancos españoles lo rechazan automáticamente.

**Prevención:**
```typescript
// Setup fee — forzar 3DS2
const paymentIntent = await stripe.paymentIntents.create({
  amount: setupFeeAmount,
  currency: 'eur',
  payment_method_options: {
    card: {
      request_three_d_secure: 'any' // forzar siempre para pagos EU
    }
  }
})
```
- Stripe gestiona SCA automáticamente en Checkout Sessions — pero en PaymentIntents manuales hay que configurarlo.
- Testear con tarjetas de prueba 3DS2 de Stripe antes de activar en producción.

---

### COMP-06 — Retención de datos: Logs de n8n con PII

**Qué es:** Los workflows n8n almacenan el payload completo de cada ejecución en su base de datos. Si el payload incluye email, nombre o datos de suscripción del usuario, n8n retiene PII indefinidamente por defecto. Esto viola el principio de minimización de datos (Art. 5.1.c RGPD) y los límites de retención del doc/07.

**Prevención:**
- `EXECUTIONS_DATA_MAX_AGE=720` (30 días) en n8n env.
- En workflows que manejan PII: usar nodos "Set" para anonimizar antes de pasar a nodos de logging.
- Documentar n8n como procesador en el Registro de Actividades.
- Si n8n usa la DB de Supabase: aplicar RLS también a las tablas de n8n (schema separado).

---

## Phase-Specific Warnings

### FASE 0 — Scaffolding del Monorepo

**Riesgo principal:** Turborepo mal configurado desde el inicio es técnicamente imposible de correcto después sin refactorizar todo.

**Warnings:**
- Configurar `turbo.json` con el campo `env` para variables públicas desde el principio.
- No crear packages internos sin definir su `exports` field en `package.json` — el tree-shaking no funciona sin esto.
- El `.gitignore` debe incluir `.turbo/` para no commitear el cache local.
- Configurar Turborepo Remote Cache con Vercel desde semana 1 — ahorra minutos en cada build de CI.
- `pnpm-workspace.yaml` debe incluir `packages/*` y `apps/*` — olvidar uno rompe todos los imports.

---

### FASE 1-2 — Design System

**Riesgo principal:** Crear un sistema de diseño "perfecto" es un pozo sin fondo.

**Warnings:**
- oklch es correcto técnicamente pero tiene soporte parcial en Safari < 15.4. Verificar los targets de browser antes de comprometerse con oklch exclusivamente.
- shadcn/ui tiene actualizaciones frecuentes — no actualizar componentes individualmente durante el desarrollo activo (rompe estilos). Fijar versión al inicio y actualizar en batch.
- Los tokens de dark mode para `dark-acid` (StageKit) son radicalmente diferentes de `legal-navy` (LexKit) — definir la arquitectura de temas ANTES de construir componentes, no después.

---

### FASE 3 — alexendros.me (Landing Estático)

**Riesgo principal:** Optimizar CWV de un site estático es relativamente sencillo, pero hay gotchas de Next.js export.

**Warnings:**
- `output: 'export'` en Next.js 15 no soporta Image Optimization servidor-side. Usar `<img>` nativo con atributos `width`/`height` explícitos o configurar un CDN para optimización.
- Con `output: 'export'`, los Route Handlers no existen. No incluir ninguna API route en alexendros.me.
- JSON-LD Person: el campo `sameAs` con URLs de redes sociales es crítico para citabilidad en AI (Perplexity, Google AI Overviews). No omitir.
- Vercel deploys de sites estáticos son instantáneos pero el CDN cache no invalida automáticamente. Configurar `Cache-Control` headers en `vercel.json`.

---

### FASE 4 — Base de Datos

**Riesgo principal:** Los errores de schema en producción son los más costosos de corregir.

**Warnings:**
- Definir `@@map()` y `@map()` correctamente en Prisma para que los nombres SQL sean snake_case aunque TypeScript use camelCase. Un error aquí rompe todas las queries de RLS.
- Las políticas RLS deben testearse con un cliente Supabase autenticado como usuario real, no como service role. Un error en RLS es silencioso — devuelve vacío en lugar de error.
- `AuditLog` NO debe tener `onDelete: Cascade` desde `User` — los logs deben sobrevivir al borrado del usuario (requisito fiscal 5 años).
- Prisma Migrate en producción: NUNCA `migrate reset`. SIEMPRE `migrate deploy` (no `dev`) en producción.

---

### FASE 5 — Pagos y Email

**Riesgo principal:** Stripe Connect Express es complejo — testar exhaustivamente antes de activar afiliados reales.

**Warnings:**
- Crear los Stripe Price IDs en el Dashboard ANTES de codificar — hardcodear precios en código es el error más frecuente (Gap G1 del checklist).
- El evento `customer.subscription.updated` se dispara en MUCHOS casos: upgrade, downgrade, trial ending, cambio de método de pago. El handler debe diferenciar correctamente o fallará en edge cases.
- Los emails de dunning (W-11..W-17) son los más críticos para revenue — testear el flujo completo con una cuenta de test antes de activar en producción.
- `invoice.payment_failed` puede llegar antes de que `customer.subscription.updated` refleje el estado `past_due` — diseñar el handler para manejar este orden.

---

### FASE 6 — alexendros.pro (Hub KitOS)

**Riesgo principal:** Es la app más compleja — auth, pagos, dashboard, legal — y debe funcionar perfectamente desde el inicio.

**Warnings:**
- El middleware de Supabase SSR debe proteger `/(dashboard)/*` pero NO las rutas `/legal/*`, `/api/webhooks/*` (Stripe no envía cookies de auth) ni `/auth/*`.
- tRPC v11 + Next.js 15 App Router: los Server Components deben usar `caller` de tRPC (no el client de React Query). Mezclar los dos genera hydration mismatches.
- Rate limiting en `/api/webhooks/stripe`: NO aplicar rate limiting aquí — Stripe tiene IPs conocidas pero variables. Aplicar rate limiting solo en `/api/auth/*` y endpoints de usuario.
- El banner de cookies debe implementarse con un `CookieConsentProvider` en el layout raíz que bloquee efectivamente PostHog — verificar con Network tab antes de producción.

---

### FASE 7 — StageKit MVP

**Riesgo principal:** La funcionalidad de booking es el North Star Metric — cualquier bug aquí es crítico.

**Warnings:**
- El formulario de booking en el perfil público es accesible sin autenticación (promotores anónimos). Necesita rate limiting, honeypot anti-spam y validación estricta en servidor.
- El slug público del Kit Profile debe ser único y URL-safe. Implementar normalización (lowercase, sin tildes, guiones) y verificación de unicidad en DB al crear.
- Las OG images dinámicas para perfiles EPK (`/[slug]/opengraph-image.tsx`) consumen Edge Function compute en Vercel. Cachear con `revalidate` largo o pre-generar estáticamente.
- Feature gates de plan (Free vs Pro): implementar en MIDDLEWARE de Next.js, no solo en UI. Un usuario puede modificar localStorage o llamar directamente a la API si la verificación solo es client-side.

---

### FASE 7.5 — n8n Workflows

**Riesgo principal:** 28 workflows interdependientes son difíciles de debuggear si algo falla.

**Warnings:**
- Implementar los workflows en orden de criticidad: dunning (revenue) > welcome sequence (UX) > notificaciones (nice-to-have). No construir los 28 a la vez.
- Cada webhook de n8n debe tener una URL secreta en el path (`/webhook/abc123`) Y verificar el header `N8N_WEBHOOK_SECRET`. Sin esto, cualquiera puede disparar el workflow.
- Los workflows con `cron` (semanales, mensuales) deben tener un nodo de "circuit breaker" que valide que el webhook de Stripe está activo antes de procesar. Un cron que falla silenciosamente es peor que uno que falla ruidosamente.
- n8n en VPS Hostinger: configurar `pm2` o `systemd` para que n8n se reinicie automáticamente tras OOM o reinicio del servidor.

---

### FASE 8-9 — Hardening y Deploy

**Riesgo principal:** Los bugs de seguridad que no se detectan aquí llegan a producción.

**Warnings:**
- `npm audit` en un monorepo puede reportar vulnerabilidades en packages de desarrollo (Playwright, Vitest) que no afectan producción. Distinguir entre `devDependencies` vulnerables vs `dependencies` vulnerables.
- El scan de secretos (`gitleaks` en GitHub Actions) debe correr en CADA PR, no solo en `main`. Un secreto commiteado en una feature branch es un secreto comprometido aunque no llegue a main.
- Vercel `turbo-ignore`: configurar correctamente para que solo redesplieguen las apps afectadas por cambios. Sin esto, cada commit despliega las 3 apps aunque solo cambie una.
- Better Uptime debe verificar no solo `200 OK` sino también el contenido de la respuesta — un error silencioso que devuelve `200` con HTML de error no se detecta si solo se verifica el status code.

---

## Resumen de Riesgos por Probabilidad × Impacto

| Pitfall | Probabilidad | Impacto | Prioridad |
|---------|-------------|---------|-----------|
| CP-03 — Service Role Key expuesta | Media | Catastrófico | P0 |
| CP-02 — Webhooks Stripe sin idempotency | Alta | Crítico | P0 |
| CP-01 — Supabase SSR token refresh | Alta | Alto | P1 |
| CP-05 — n8n OOM en producción | Media | Alto | P1 |
| CP-04 — Next.js 15 caching datos usuario | Alta | Medio | P1 |
| COMP-01 — Cookies analytics sin consentimiento | Alta | Legal | P1 |
| COMP-02 — Delete incompleto (Art. 17 RGPD) | Media | Legal | P1 |
| CP-06 — Stripe Connect KYC bloqueado | Media | Medio | P2 |
| SDR-01 — Scope creep | Alta | Alto | P1 |
| SDR-03 — Burnout por infra antes de producto | Alta | Alto | P1 |
| CM-02 — Prisma Pooler mal configurado | Alta | Medio | P2 |
| COMP-05 — Setup fee sin 3DS2 | Media | Medio | P2 |

---

*Documento generado: 2026-04-06 | Revisar en cada transición de fase importante*
