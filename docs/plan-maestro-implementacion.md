# Plan Maestro: ALEXENDROS — Monorepo

## Contexto

Implementar desde cero el monorepo `alexendros-monorepo` documentado en Notion (13 docs del Hub).

**Arquitectura de dominios (CAMBIO CLAVE):**
- **alexendros.me** = Landing page profesional de marca personal. SIN backend. Estatica. Sirve como campo de pruebas de branding/UI antes de aplicarlo a .pro. Redirige a alexendros.pro para productos y servicios.
- **alexendros.pro** = Hub completo. CON backend (auth, DB, pagos, dashboard). Aqui vive toda la logica de negocio: venta de apps verticales, suscripciones, afiliados, CRM. La arquitectura y diseno del sitio deben estar preparados para multiples productos y servicios. *(Nota 2026-04-23: la marca paraguas anterior fue retirada; pendiente reformular.)*
- **stagekit.app** (y futuras apps verticales) = Apps individuales desplegadas desde el monorepo.

**Flujo de branding:** Disenar y validar identidad visual en alexendros.me (rapido, sin backend) → una vez consolidado, aplicar el sistema de diseno a alexendros.pro y los kits.

**UI/UX:** Integrar skill `ui-ux-pro-max` en el flujo de desarrollo de toda interfaz.

**Stack:** Next.js 15 App Router, TypeScript strict, Tailwind v4, shadcn/ui, Supabase, Prisma 5, Stripe, Resend, Turborepo, pnpm, Vercel (mad1).

**Estado actual:** Repo con commit inicial + Export Notion en GitHub (github.com/alexendros/alexendros-monorepo). Node v22.x LTS, pnpm 9.x.

**Dominios actuales:** alexendros.me y alexendros.pro registrados en Hostinger. Pendiente migracion DNS a Vercel.

---

## PRE-FASE — Migracion de Dominios (Hostinger → Vercel)
> **Objetivo:** Apuntar alexendros.me y alexendros.pro a Vercel sin downtime.
> **Cuando:** Ejecutar ANTES de FASE 3.9 (deploy alexendros.me) y FASE 9 (deploy .pro).
> **Nota:** No es transferencia de registrador — solo cambio de DNS. Los dominios siguen registrados en Hostinger.

**Opcion A — Cambio de nameservers a Vercel (recomendado):**
1. En Vercel Dashboard: Projects → Settings → Domains → Add `alexendros.me`
2. Vercel mostrara los nameservers requeridos (ej: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
3. En Hostinger Panel → Dominios → alexendros.me → DNS/Nameservers
4. Cambiar nameservers de Hostinger a los de Vercel
5. Repetir para alexendros.pro
6. Propagacion: 1-48h (normalmente <1h)
7. Vercel gestiona SSL automaticamente

**Opcion B — CNAME (si se quiere mantener DNS en Hostinger):**
1. En Hostinger DNS: eliminar registros A existentes
2. Anadir CNAME `@` → `cname.vercel-dns.com`
3. Anadir CNAME `www` → `cname.vercel-dns.com`
4. En Vercel: verificar dominio

**Checklist post-migracion:**
- [ ] alexendros.me resuelve a Vercel (dig alexendros.me)
- [ ] SSL activo y valido
- [ ] Redirect www → apex configurado
- [ ] alexendros.pro resuelve a Vercel
- [ ] Email: si hay MX records en Hostinger, mantenerlos (CNAME no afecta MX; con nameservers Vercel, recrear MX records en Vercel DNS)

---

## FASE 0 — Scaffolding del Monorepo
> **Objetivo:** Estructura Turborepo funcional, CLAUDE.md, agentes, skills, tooling.
> **Resultado:** `pnpm turbo build` exitoso.

**Tareas:**

1. **Inicializar Turborepo monorepo**
   - `pnpm dlx create-turbo@latest . --package-manager pnpm`
   - `turbo.json` con pipelines: build, dev, lint, typecheck, test
   - `pnpm-workspace.yaml` con `apps/*` y `packages/*`

2. **Estructura de packages compartidos**
   ```
   packages/
   ├── config/    → tsconfig base, eslint, tailwind preset
   ├── brand/     → tokens CSS (oklch), logos SVG, tipografias
   ├── ui/        → shadcn/ui compartido (Radix + Tailwind)
   ├── db/        → Prisma schema + Supabase client (solo para apps con backend)
   ├── stripe/    → logica de pagos compartida
   └── email/     → React Email templates
   ```

3. **CLAUDE.md jerarquico** (desde doc/00 Notion)
   - `/CLAUDE.md` (raiz)
   - `apps/alexendros-me/CLAUDE.md` (reglas: solo estatico, sin backend, testeo branding)
   - `apps/alexendros-pro/CLAUDE.md` (reglas: hub completo, multi-producto)
   - `packages/brand/CLAUDE.md`, `packages/ui/CLAUDE.md`, `packages/db/CLAUDE.md`

4. **Agentes y skills** (copiar desde doc Notion)
   ```
   .claude/
   ├── agents/  (5: brand-auditor, db-architect, stripe-engineer, seo-geo-specialist, gdpr-compliance)
   └── skills/  (6: create-kit, new-db-migration, add-stripe-plan, deploy-vercel, gdpr-audit, brand-manual)
   ```

5. **Instalar UI/UX Pro Max skill**
   ```bash
   npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
   ```
   Usar ANTES de generar cualquier interfaz en todo el monorepo.

6. **.claude/mcp.json** (Notion, Supabase, GitHub, Stripe)

7. **TypeScript strict + ESLint flat config + Prettier**

8. **Git strategy:** `main` (prod) → `dev` (staging) → `feature/*`

9. **.gitignore, .env.example, env.ts (validacion Zod)**

**Archivos criticos:**
- `/turbo.json`, `/pnpm-workspace.yaml`, `/package.json`
- `/CLAUDE.md`
- `/.claude/agents/*.md` (5), `/.claude/skills/*.md` (5), `/.claude/mcp.json`
- `/packages/config/tsconfig.base.json`, `/packages/config/eslint.config.mjs`
- `/.env.example`, `/.gitignore`

---

## FASE 1 — packages/brand + packages/config (Sistema de Diseno)
> **Objetivo:** Tokens visuales y config compartida. Fuente unica de verdad para .me y .pro.
> **Prerequisito:** FASE 0

1. **packages/brand/tokens.ts** — tokens oklch del doc/02:
   - Paleta Alexendros (dark-first: negro profundo + verde acid + gris mineral)
   - Paleta por Kit (StageKit: dark-acid, LexKit: legal-navy, GestKit: gestoria-slate)
   - Surfaces, text scales, semantic colors, radius

2. **packages/brand/fonts.ts** — Geist + Geist Mono (next/font)

3. **packages/brand/globals.css** — CSS variables oklch

4. **packages/config/tailwind.preset.ts** — preset Tailwind v4 consumiendo tokens

5. **packages/brand/CLAUDE.md** — reglas: nunca hardcodear colores fuera de tokens

---

## FASE 2 — packages/ui (Componentes Compartidos)
> **Objetivo:** shadcn/ui dark-first + componentes base. Compartidos entre .me y .pro.
> **Prerequisito:** FASE 1
> **REGLA:** Ejecutar `/ui-ux-pro-max` ANTES de disenar cualquier componente nuevo.

1. **Inicializar shadcn/ui** (style: new-york, baseColor: zinc, CSS vars: true)

2. **Componentes obligatorios** (doc/02):
   - button, card, input, label, dialog, sheet, drawer
   - form, select, textarea, table, badge, avatar
   - navigation-menu, tabs, toast, sonner, skeleton, separator

3. **Exportar** como `@repo/ui` para consumo en apps

4. **packages/ui/CLAUDE.md** — reglas: variantes shadcn primero, lucide-react, Dialog desktop / Drawer mobile

---

## FASE 3 — apps/alexendros-me (Landing de Marca — Testeo de Branding)
> **Objetivo:** Landing profesional estatica en alexendros.me. SIN backend. Campo de pruebas del sistema de diseno.
> **Prerequisito:** FASES 1-2 (brand + ui)
> **Fuente de verdad:** PRE-FASE docs PF-0 a PF-7
> **REGLA UI:** Ejecutar `/ui-ux-pro-max` antes de generar interfaz.

### 3.1 — Scaffold Next.js 15 (output: export estatico)
- `create-next-app` con App Router, TypeScript, Tailwind
- **`output: 'export'`** en next.config.ts (sitio estatico, sin server)
- Conectar a packages/brand y packages/ui
- Headers seguridad via Vercel config (no middleware)

### 3.2 — Layout + Navegacion
- `app/layout.tsx`: metadata completa (titulo, OG, twitter card)
- next/font: Geist + Geist Mono
- Header minimalista: Alexendros logo + nav (About, Projects, Contact)
- Footer: links legales, redes sociales, copyright, link a alexendros.pro
- Dark-first por defecto

### 3.3 — Pagina principal (Hero)
Contenido desde PF-0 (Biografia & Posicionamiento):
- **Hero:** "Construyo productos digitales que funcionan y cumplen la ley."
  - Subtitulo: "Fullstack developer con plataforma propia. Background en derecho. Madrid."
  - CTA primario: "Explorar la plataforma" → enlace a alexendros.pro
  - CTA secundario: "Contactar" → seccion contacto o mailto
- **About breve:** Bio 150 palabras (PF-0)
- **Proyectos destacados:** card de la plataforma con link a alexendros.pro (PF-3)
- **Stack visual:** Grid del stack autodidacta (PF-2)
- **Timeline:** Narrativa 3 actos condensada (PF-0)

**Test de 5 segundos:** Quien es, que construye, para quien — visible sin scroll.

### 3.4 — Paginas secundarias (estaticas)
- `/about` — Narrativa 3 actos completa
- `/projects` — Portfolio con links a demos/repos
- `/uses` — Herramientas (PF-2 seccion 4)
- `/contact` — Info de contacto + links (sin formulario server-side; usar mailto o Calendly embed)

### 3.5 — Paginas legales (Compliance — doc/07)
- `/legal/aviso-legal` — Art. 10 LSSI-CE
- `/legal/privacidad` — Art. 13 RGPD
- `/legal/cookies` — AEPD Guia 2023
- (Sin /legal/terminos — no hay SaaS en .me)

### 3.6 — SEO Tecnico + GEO
- JSON-LD `Person` con sameAs (GitHub, LinkedIn, Twitter)
- JSON-LD `WebSite`
- `sitemap.ts` estatico
- `robots.ts`
- OG images con `@vercel/og`
- Canonical URLs
- hreflang ES/EN si aplica

### 3.7 — Rendimiento (CWV)
- LCP < 2.0s desktop / < 2.5s mobile
- INP < 200ms, CLS < 0.1
- next/image, next/font display: swap
- Lighthouse Performance > 90 (sitio estatico = facil de lograr)

### 3.8 — Cookie Banner ligero
- Solo cookies necesarias (sin PostHog ni analytics en .me)
- Banner informativo minimo (AEPD compliance)
- Si se anade analytics futuro: banner granular con bloqueo

### 3.9 — Deploy alexendros.me
- Vercel con dominio alexendros.me
- SSL automatico
- Verificar CWV en produccion
- **RESULTADO:** Branding validado en produccion, listo para replicar en .pro

---

## FASE 4 — packages/db (Prisma + Supabase)
> **Objetivo:** Schema completo, client factory. Solo lo consume alexendros.pro y apps con backend.
> **Prerequisito:** FASE 0 (paralela con FASES 1-3, no depende de UI)

1. **Prisma schema** (doc/03):
   - Kit, User, Plan, Subscription, ClientProfile, KitProfile
   - InboundRequest, Affiliate, AffiliatePayout
   - Enums: KitStatus, UserRole, SubStatus, RequestStatus, PayoutStatus
   - AuditLog (gap G4 checklist)

2. **Supabase client factory** (createServerClient / createBrowserClient SSR)

3. **env.ts** validacion Zod (DATABASE_URL, DIRECT_URL, SUPABASE_*)

4. **Seed data** — Kit entries + planes

5. **packages/db/CLAUDE.md**

**Nota:** Migracion real requiere Supabase activo. Se prepara schema, se ejecuta con credenciales.

---

## FASE 5 — packages/stripe + packages/email
> **Objetivo:** Logica de pagos y email compartida para alexendros.pro y kits.
> **Prerequisito:** FASE 4 (db)

1. **packages/stripe/**
   - `kit-plans.ts` — planes por Kit (Free/Pro/Agency)
   - `checkout.ts` — checkout session + setup fee
   - `affiliate.ts` — Stripe Connect Express
   - `webhook-handler.ts` — eventos Stripe

2. **packages/email/**
   - Templates React Email: bienvenida, booking, upgrade, trial, payment failed, certificado tokenización
   - Resend client factory

3. **Servicios transversales de la plataforma** (integración en fases posteriores)
   - **Dossier de presencia digital:** Entregable incluido en Pro/Agency — plataformas, publicaciones, almacenamiento, suite Proton.me
   - **Tokenización digital:** Servicio bajo demanda — registro SafeCreative/blockchain con hash SHA-256, workflow n8n automatizado, modelo `DigitalRegistration` en DB
   - **Contratos Afiladocs:** Integración con afiladocs.com — generación automática de contratos por evento (checkout, booking, alta afiliado), firma electrónica eIDAS, almacenamiento en Supabase Storage

---

## FASE 6 — apps/alexendros-pro (Hub — App Completa)
> **Objetivo:** alexendros.pro como hub completo: catalogo de apps verticales, auth, dashboard, pagos, waitlist. Arquitectura preparada para multiples productos y servicios.
> **Prerequisito:** FASES 3 (branding validado en .me) + FASES 4-5 (db, stripe, email)
> **REGLA UI:** Ejecutar `/ui-ux-pro-max` antes de generar interfaz. Aplicar tokens de brand validados en .me.

### 6.1 — Scaffold Next.js 15 (CON server-side)
- App Router, TypeScript, Tailwind
- Conectar a TODOS los packages: brand, ui, db, stripe, email
- Middleware Supabase SSR protegiendo /(dashboard)
- next.config.ts con headers seguridad

### 6.2 — Landing publica (marketing)
- Hero: que es la plataforma, UVP
- Catalogo de apps disponibles (StageKit activo, otras verticales en waitlist)
- Pricing comparativo
- JSON-LD SoftwareApplication
- Waitlist segmentada por Kit (con consentimiento RGPD)
- Link desde alexendros.me ya apuntando aqui

### 6.3 — Auth + Onboarding
- Supabase Auth SSR: login, register, reset-password, Google OAuth
- Callback handler
- Onboarding: seleccion de Kit → perfil basico

### 6.4 — Dashboard usuario
- Vista general: Kit contratado, estado suscripcion, perfil
- Billing: plan actual, upgrade, Stripe billing portal
- Perfil/Settings: datos personales, ARCO endpoints

### 6.5 — Seccion legal completa
- `/legal/aviso-legal`, `/legal/privacidad`, `/legal/cookies`, `/legal/terminos`
- Banner cookies granular (PostHog EU condicionado a consentimiento)
- Endpoints ARCO: /api/account/export, /api/account/delete

### 6.6 — API + Webhooks
- tRPC v11 router (type-safe)
- Webhook handler Stripe (/api/webhooks/stripe)
- Rate limiting con @upstash/ratelimit

---

## FASE 7 — apps/stagekit (MVP StageKit)
> **Objetivo:** Primer Kit funcional. MVP segun doc/06.
> **Prerequisito:** FASE 6 (alexendros.pro operativo)
> **REGLA UI:** `/ui-ux-pro-max` antes de generar interfaz.

### 7.1 — Auth + Onboarding (heredado de .pro o standalone)
- Perfil artista: stage name, generos, bio, foto
- 3 pasos: info → generos → primer perfil

### 7.2 — Kit Profile Builder
- Wizard: info basica, media/assets, links
- Preview en tiempo real
- Borrador vs publicar
- URL publica: stagekit.app/[slug]

### 7.3 — Booking + Dashboard
- Formulario booking embebido en perfil publico
- Dashboard: views, requests, estado

### 7.4 — Stripe Integration
- Billing page, checkout Pro, webhook completo
- Feature gates en tRPC middleware

### 7.5 — Landing StageKit
- UVP: "Tu musica ya suena como tier A. Ahora que tu carrera tambien lo haga."
- Demo perfil interactivo
- Pricing 3 planes
- JSON-LD SoftwareApplication

---

## FASE 7.5 — Automatizaciones n8n (Plantillas de workflows de la plataforma)
> **Objetivo:** Implementar todos los flujos automatizados de ciclo de vida del cliente: onboarding, engagement, cobro, impago, recuperación y baja. Desplegados en n8n (Hostinger VPS) con webhooks desde las apps.
> **Prerequisito:** FASES 5 (stripe/email) + FASE 6 o 7 (app con webhooks operativos)
> **Infraestructura:** n8n self-hosted en Hostinger VPS (`n8n.alexendros.me`), Resend para email, Stripe para eventos de pago.

### 7.5.1 — Workflows de ciclo de vida del cliente

#### A. Onboarding (post-registro)

| # | Workflow | Trigger | Acciones |
|---|---------|---------|----------|
| W-01 | **Welcome sequence** | `checkout.session.completed` (webhook Stripe) | 1. Email bienvenida (inmediato) → 2. Email "completa tu perfil" (24h) → 3. Email "publica tu primer Kit Profile" (72h) → 4. Si no ha publicado en 7d: email con tutorial paso a paso |
| W-02 | **Onboarding checklist tracker** | Webhook de la plataforma `profile_updated` | Marcar pasos completados → si completa 100%: email felicitación + badge → si < 50% a los 5d: email recordatorio |
| W-03 | **Setup fee confirmation** | `checkout.session.completed` con setup fee | Email confirmación de pago único + factura PDF + contrato Afiladocs generado |

#### B. Engagement y retención activa

| # | Workflow | Trigger | Acciones |
|---|---------|---------|----------|
| W-04 | **Weekly digest** | Cron: lunes 9:00 CET | Agregar métricas semanales del cliente (views, bookings, requests) → Email resumen personalizado con comparativa semana anterior |
| W-05 | **Booking notification** | Webhook de la plataforma `booking_request_created` | Email inmediato al artista/profesional → Notificación push (si PWA) → Actualizar dashboard |
| W-06 | **Milestone celebration** | Webhook de la plataforma `milestone_reached` | Detectar hitos (10 bookings, 100 views, 1 año activo) → Email personalizado + badge → Post en redes (opcional, con consentimiento) |
| W-07 | **Inactivity re-engagement** | Cron: diario 10:00 CET | Consultar usuarios sin login en >14d → Día 14: email "te echamos de menos" + novedades → Día 30: email con oferta especial (descuento 20% próximo mes) → Día 60: email final "tu perfil sigue activo" |

#### C. Trial y conversión

| # | Workflow | Trigger | Acciones |
|---|---------|---------|----------|
| W-08 | **Trial progress** | Cron: diario | Consultar trials activos → Día 3: email tips para aprovechar el trial → Día 10: email "quedan 4 días" + comparativa Free vs Pro → Día 13: email urgencia "último día mañana" con CTA directo a checkout |
| W-09 | **Trial expired** | `customer.subscription.updated` (status → canceled/free) | Email "tu trial ha terminado" → Mostrar qué pierde (feature comparison) → Oferta: volver a Pro con 30% descuento primer mes (código único, 7 días validez) |
| W-10 | **Upgrade celebration** | `customer.subscription.updated` (plan upgrade) | Email felicitación + guía de nuevas features desbloqueadas → Activar onboarding de features Pro/Agency |

#### D. Impago y dunning (secuencia de recobro legítimo)

> **Base legal:** Art. 6.1.b RGPD (ejecución de contrato) + Art. 1100-1108 Código Civil (mora del deudor) + Ley 3/2004 de morosidad en operaciones comerciales (si B2B).
> **Principio:** Comunicación gradual, transparente y proporcional. Nunca amenazante, nunca publicar la deuda, siempre ofrecer solución.

| # | Workflow | Trigger / Timing | Acción | Canal |
|---|---------|------------------|--------|-------|
| W-11 | **Payment failed — Intento 1** | `invoice.payment_failed` (inmediato) | Email informativo: "No hemos podido procesar tu pago" + enlace directo a actualizar método de pago en Stripe Billing Portal + motivo del fallo (si Stripe lo proporciona: fondos insuficientes, tarjeta expirada, etc.) | Email |
| W-12 | **Payment failed — Intento 2** | `invoice.payment_failed` (retry automático Stripe, ~3 días) | Email recordatorio: "Segundo intento fallido" + enlace Billing Portal + "Si necesitas ayuda, responde a este email" | Email |
| W-13 | **Payment failed — Intento 3** | `invoice.payment_failed` (retry ~7 días) | Email urgente: "Último intento antes de suspender servicio" + enlace Billing Portal + plazo concreto ("tienes hasta el [fecha]") + teléfono/email de soporte | Email |
| W-14 | **Servicio suspendido** | `customer.subscription.updated` (status: `past_due` → `unpaid`, ~14 días) | 1. Suspender acceso a features Pro/Agency (downgrade a Free, NO borrar datos) → 2. Email: "Tu suscripción ha sido suspendida por impago" + qué se mantiene (datos, perfil) + qué se pierde (features) + enlace para reactivar → 3. Registrar en AuditLog | Email + In-app |
| W-15 | **Recordatorio post-suspensión** | Cron: 7 días tras W-14 | Email: "Tus datos siguen seguros" + oferta de reactivación (posible descuento) + plazo de retención de datos (90 días) | Email |
| W-16 | **Aviso pre-eliminación** | Cron: 60 días tras suspensión | Email formal: "En 30 días eliminaremos tus datos conforme a nuestra política de retención" + enlace para exportar datos (ARCO portabilidad) + enlace para reactivar | Email |
| W-17 | **Eliminación de datos** | Cron: 90 días tras suspensión | 1. Ejecutar anonimización RGPD (mantener datos fiscales 5 años) → 2. Email confirmación de eliminación → 3. Registrar en AuditLog → 4. Actualizar Registro de Actividades (Art. 30) | Sistema |

**Configuración Stripe para dunning:**
```
Stripe Dashboard → Settings → Subscriptions → Smart Retries:
  - Retry schedule: 3, 5, 7 días
  - After all retries fail: Mark subscription as unpaid
  - Send emails: Desactivar (gestionar desde n8n para control total)
  - Customer portal: Permitir actualizar método de pago
```

**Reglas de impago:**
- ❌ NUNCA comunicar la deuda a terceros (prohibido sin consentimiento, Art. 6 RGPD)
- ❌ NUNCA usar lenguaje amenazante o coercitivo
- ❌ NUNCA borrar datos del cliente sin agotar el plazo de retención (90 días)
- ❌ NUNCA cobrar intereses sin cláusula contractual previa (Art. 1108 CC)
- ✅ SIEMPRE ofrecer vía de solución en cada comunicación
- ✅ SIEMPRE enlace a soporte humano (email directo)
- ✅ SIEMPRE respetar derecho de exportación de datos antes de eliminar
- ✅ SIEMPRE registrar cada acción en AuditLog

#### E. Baja voluntaria y recuperación (churn prevention)

| # | Workflow | Trigger / Timing | Acción |
|---|---------|------------------|--------|
| W-18 | **Cancelación iniciada** | `customer.subscription.updated` (cancel_at_period_end = true) | 1. Email inmediato: "Lamentamos que te vayas" + encuesta de motivo (3 opciones: precio, no uso, competidor, otro) → 2. Según motivo: |
| | | — Si **precio**: Ofrecer descuento 30% durante 3 meses (código único) | |
| | | — Si **no uso**: Ofrecer sesión de onboarding personalizada (Calendly link) | |
| | | — Si **competidor**: Ofrecer comparativa + migración gratuita de datos | |
| | | — Si **otro**: Agradecimiento + invitación a compartir feedback | |
| W-19 | **Último día de suscripción** | Cron: día antes de period_end | Email: "Tu suscripción termina mañana" + resumen de lo que pierde + CTA "Reconsidera" con descuento vigente (si aplica) |
| W-20 | **Post-baja inmediata** | `customer.subscription.deleted` | 1. Downgrade a Free (NO borrar datos ni perfil) → 2. Email: "Tu plan ha cambiado a Free" + qué mantiene + qué pierde → 3. Registrar motivo en CRM |
| W-21 | **Win-back 30 días** | Cron: 30 días tras baja | Email: "¿Qué tal todo?" + novedades lanzadas desde su baja + oferta reactivación (40% descuento primer mes) |
| W-22 | **Win-back 90 días** | Cron: 90 días tras baja | Email final: "Seguimos aquí" + caso de éxito de un cliente similar + oferta definitiva. Si no reacciona: marcar como churned definitivo en CRM |

**Reglas de baja:**
- ❌ NUNCA dificultar la baja (dark patterns prohibidos, Directiva 2005/29/CE)
- ❌ NUNCA seguir cobrando tras cancelación confirmada
- ❌ NUNCA enviar más de 3 emails de recuperación post-baja
- ✅ SIEMPRE confirmar baja por email con fecha efectiva
- ✅ SIEMPRE permitir exportar datos antes de downgrade
- ✅ SIEMPRE mantener acceso Free (datos + perfil público) salvo eliminación explícita

#### F. Automatizaciones operativas del Kit contratado

| # | Workflow | Trigger | Acciones |
|---|---------|---------|----------|
| W-23 | **Nuevo booking → notificación + CRM** | Webhook de la plataforma `booking_request_created` | 1. Email al profesional con datos del booking → 2. Crear/actualizar lead en CRM (docs/09) → 3. Si Pro/Agency: crear evento en Proton Calendar (si integrado) |
| W-24 | **Kit Profile publicado → SEO check** | Webhook de la plataforma `kit_profile_published` | 1. Invocar agente seo-geo-specialist (verificar JSON-LD, OG) → 2. Ping Google Search Console (indexación) → 3. Email al cliente: "Tu perfil está live" + URL |
| W-25 | **Generación de contrato** | Webhook de la plataforma `contract_requested` | 1. POST API Afiladocs con merge fields → 2. PDF generado → Supabase Storage → 3. Email al cliente con enlace de firma → 4. Si tokenización activa: registrar hash |
| W-26 | **Tokenización de producto** | Webhook de la plataforma `tokenization_requested` | Flujo completo de 7 pasos documentado en docs/08 (SHA-256 → SafeCreative → certificado → email) |
| W-27 | **Renovación mensual → factura** | `invoice.paid` | 1. Generar factura PDF (Stripe Invoice + datos fiscales) → 2. Email con factura adjunta → 3. Actualizar contabilidad (si integración Holded/Quaderno) |
| W-28 | **Affiliate payout** | `transfer.created` | 1. Registrar payout en tabla AffiliatePayout → 2. Email al afiliado: "Comisión recibida" + detalle → 3. Generar recibo |

### 7.5.2 — Arquitectura técnica de los workflows

```
┌─────────────────────────────────────────────────────────┐
│              Apps de la plataforma                       │
│  (alexendros.pro / stagekit.app / lexkit.pro)           │
│                                                         │
│  Eventos → POST /api/n8n/trigger                        │
│            (webhook autenticado con N8N_WEBHOOK_SECRET)  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────┐
│              n8n (Hostinger VPS)                         │
│              n8n.alexendros.me                           │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Lifecycle   │  │ Dunning     │  │ Operations  │    │
│  │ W-01..W-10  │  │ W-11..W-17  │  │ W-23..W-28  │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │             │
│         ▼                ▼                ▼             │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Servicios externos                  │   │
│  │  Resend (email) · Stripe (pagos) · Supabase    │   │
│  │  Afiladocs (contratos) · SafeCreative (tokens) │   │
│  │  Google Search Console · Proton Calendar        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 7.5.3 — Variables de entorno n8n

```bash
# En n8n (Hostinger VPS) — Environment Variables
N8N_WEBHOOK_SECRET=           # Compartido con las apps para autenticar webhooks
RESEND_API_KEY=               # Envío de emails
STRIPE_SECRET_KEY=            # Consultar estado de suscripciones
SUPABASE_URL=                 # Consultar datos de usuario
SUPABASE_SERVICE_ROLE_KEY=    # Acceso server-side sin RLS
AFILADOCS_API_KEY=            # Generación de contratos
SAFECREATIVE_API_KEY=         # Registro de tokenización
```

### 7.5.4 — Plantilla base de workflow n8n (SDK)

> Cada workflow sigue esta estructura estándar para mantener consistencia y facilitar el mantenimiento.

```typescript
// Estructura base para cada workflow n8n
// Crear con skill: /n8n create_workflow_from_code

import { WorkflowBuilder } from 'n8n-workflow-sdk';

const workflow = new WorkflowBuilder('W-XX — [Nombre del workflow]')
  // Trigger
  .addTrigger({
    type: 'webhook' | 'cron' | 'stripe',
    config: { /* ... */ }
  })
  // Paso 1: Obtener datos de contexto
  .addNode('fetch-context', {
    type: 'supabase',
    operation: 'getRows',
    table: '...',
    filters: { /* ... */ }
  })
  // Paso 2: Lógica condicional
  .addNode('check-condition', {
    type: 'if',
    condition: { /* ... */ }
  })
  // Paso 3: Acción principal
  .addNode('send-email', {
    type: 'resend',
    template: '...',
    to: '{{ $json.email }}',
    variables: { /* merge fields */ }
  })
  // Paso 4: Registrar en audit log
  .addNode('audit-log', {
    type: 'supabase',
    operation: 'insert',
    table: 'audit_logs',
    data: {
      entity: 'workflow',
      action: 'W-XX executed',
      userId: '{{ $json.userId }}',
      metadata: { /* resultado */ }
    }
  })
  .build();
```

### 7.5.5 — Tabla resumen de workflows

| ID | Nombre | Categoría | Trigger | Emails | Prioridad |
|----|--------|-----------|---------|--------|-----------|
| W-01 | Welcome sequence | Onboarding | Stripe webhook | 4 | MVP |
| W-02 | Onboarding tracker | Onboarding | webhook de la plataforma | 2 | MVP |
| W-03 | Setup fee confirmation | Onboarding | Stripe webhook | 1 | MVP |
| W-04 | Weekly digest | Engagement | Cron semanal | 1 | MVP |
| W-05 | Booking notification | Engagement | webhook de la plataforma | 1 | MVP |
| W-06 | Milestone celebration | Engagement | webhook de la plataforma | 1 | Post-MVP |
| W-07 | Inactivity re-engagement | Engagement | Cron diario | 3 | Post-MVP |
| W-08 | Trial progress | Conversión | Cron diario | 3 | MVP |
| W-09 | Trial expired | Conversión | Stripe webhook | 1 | MVP |
| W-10 | Upgrade celebration | Conversión | Stripe webhook | 1 | MVP |
| W-11 | Payment failed — 1 | Dunning | Stripe webhook | 1 | MVP |
| W-12 | Payment failed — 2 | Dunning | Stripe webhook | 1 | MVP |
| W-13 | Payment failed — 3 | Dunning | Stripe webhook | 1 | MVP |
| W-14 | Servicio suspendido | Dunning | Stripe webhook | 1 | MVP |
| W-15 | Recordatorio post-susp. | Dunning | Cron | 1 | MVP |
| W-16 | Aviso pre-eliminación | Dunning | Cron | 1 | MVP |
| W-17 | Eliminación de datos | Dunning | Cron | 1 | MVP |
| W-18 | Cancelación iniciada | Churn | Stripe webhook | 1 | MVP |
| W-19 | Último día suscripción | Churn | Cron | 1 | MVP |
| W-20 | Post-baja inmediata | Churn | Stripe webhook | 1 | MVP |
| W-21 | Win-back 30d | Churn | Cron | 1 | Post-MVP |
| W-22 | Win-back 90d | Churn | Cron | 1 | Post-MVP |
| W-23 | Booking → CRM | Operativo | webhook de la plataforma | 1 | MVP |
| W-24 | Profile → SEO check | Operativo | webhook de la plataforma | 1 | Post-MVP |
| W-25 | Contrato Afiladocs | Operativo | webhook de la plataforma | 1 | Post-MVP |
| W-26 | Tokenización | Operativo | webhook de la plataforma | 1 | Post-MVP |
| W-27 | Renovación → factura | Operativo | Stripe webhook | 1 | MVP |
| W-28 | Affiliate payout | Operativo | Stripe webhook | 1 | MVP |

**MVP: 20 workflows · Post-MVP: 8 workflows**

---

## FASE 8 — Hardening Pre-Produccion
> **Objetivo:** Checklist de Auditoria Pre-Produccion completo.
> **Prerequisito:** FASES 6-7 + 7.5 (workflows n8n operativos)

- **Bloque B:** Cuentas activas (Vercel, Supabase, Stripe, Resend, Sentry, PostHog, GitHub)
- **Bloque C:** Build limpio (sin `any`, sin keys hardcodeadas)
- **Bloque D:** Seguridad (middleware auth, CSRF, headers, rate limiting, RLS, secrets scan, npm audit)
- **Bloque E:** Compliance (textos legales, cookies, DPAs, ARCO)
- **Bloque F:** CWV (LCP, INP, CLS, Lighthouse > 90)
- **Bloque G:** SEO (metadata, sitemap, robots, JSON-LD, OG, canonical)
- **Bloque H:** Tests (Vitest unit, Playwright E2E, coverage 60%+)
- **Bloque I:** Gaps criticos: G1 (Stripe IDs reales), G2 (stagekit.app), G6 (env.ts)

---

## FASE 9 — Deploy Produccion
> **Objetivo:** Todo en produccion con CI/CD.

1. **GitHub Actions:** lint + typecheck + test en cada PR
2. **Vercel:** proyecto por app, region mad1
3. **Dominios:**
   - alexendros.me → apps/alexendros-me (estatico, ya desplegado en FASE 3.9)
   - alexendros.pro → apps/alexendros-pro
   - stagekit.app → apps/stagekit
4. **Stripe:** modo Live, webhooks registrados
5. **Monitoring:** Sentry, PostHog EU, Better Uptime
6. **turbo-ignore** para deploys selectivos

---

## Orden de Ejecucion

```
FASE 0 (Scaffolding + ui-ux-pro-max)
  |
  ├── FASE 1 (brand/config)          ← paralela con FASE 4
  |     |
  |     FASE 2 (ui)
  |           |
  |           FASE 3 (alexendros.me)  ← PRIORIDAD: testeo branding
  |                 |                    deploy a produccion
  |                 |
  FASE 4 (db)      | branding validado
  |                 ↓
  FASE 5 (stripe/email)
        |
        FASE 6 (alexendros.pro)       ← hub completo, aplica branding de .me
              |
              FASE 7 (stagekit MVP)
              |     |
              |     FASE 7.5 (n8n workflows)  ← 28 automatizaciones:
              |           |                      onboarding, engagement,
              |           |                      dunning, churn, operativo
              |           |
                    FASE 8 (hardening)
                          |
                          FASE 9 (deploy produccion .pro + stagekit)
```

**Flujo clave:** El branding se valida primero en alexendros.me (estatico, rapido) y luego se aplica a alexendros.pro (complejo, con backend). Esto permite iterar la identidad visual sin tocar logica de negocio.

---

## Regla UI/UX transversal

**En TODAS las fases que generen interfaz (3, 6, 7):**
```bash
# Antes de disenar cualquier pagina o componente:
# 1. Ejecutar skill ui-ux-pro-max
# 2. Consumir tokens de packages/brand
# 3. Usar componentes de packages/ui (shadcn)
# 4. Verificar contraste WCAG AA en dark mode
# 5. Test de 5 segundos en paginas de marketing
```

---

## Verificacion

### Tras FASE 0:
- `pnpm install` sin errores
- `pnpm turbo build` exitoso
- CLAUDE.md, agentes, skills en su sitio
- ui-ux-pro-max skill instalado

### Tras FASE 3 (alexendros.me):
- `pnpm dev --filter=alexendros-me` sirve en localhost
- `pnpm turbo build --filter=alexendros-me` genera export estatico
- Lighthouse Performance > 90 (estatico = trivial)
- JSON-LD Person validado
- Test de 5 segundos superado
- Textos legales accesibles
- Deploy en Vercel con alexendros.me funcionando
- **Branding consolidado y listo para replicar**

### Tras FASE 6 (alexendros.pro):
- Auth funcional (registro, login, Google OAuth)
- Dashboard accesible tras login
- Waitlist capturando emails por Kit
- Stripe checkout funcional en modo test
- Branding consistente con alexendros.me

### Tras FASE 7 (StageKit):
- Registro → onboarding → perfil publicado (E2E)
- Checkout Pro con card test 4242
- Booking request anonimo → artista lo recibe

### Tras FASE 7.5 (n8n workflows):
- W-01 welcome sequence dispara tras checkout test → 4 emails programados
- W-08 trial progress envia email dia 3 a trial activo
- W-11/12/13 dunning sequence completa con card declinada (4000 0000 0000 0341)
- W-18 cancelacion: encuesta motivo + oferta descuento generada
- W-23 booking → email al artista + lead creado en CRM
- W-27 invoice.paid → factura PDF enviada
- Todos los workflows registran en AuditLog

### Tras FASE 9:
- 3 dominios activos con SSL
- CWV en verde en todos
- npm audit limpio
- Checklist Hub en GREEN LIGHT
