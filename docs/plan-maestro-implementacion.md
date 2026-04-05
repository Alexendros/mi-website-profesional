# Plan Maestro: ALEXENDROS x KitOS — Monorepo

## Contexto

Implementar desde cero el monorepo `alexendros-monorepo` documentado en Notion (13 docs del Hub).

**Arquitectura de dominios (CAMBIO CLAVE):**
- **alexendros.me** = Landing page profesional de marca personal. SIN backend. Estatica. Sirve como campo de pruebas de branding/UI antes de aplicarlo a .pro. Redirige a alexendros.pro para productos y servicios.
- **alexendros.pro** = Hub KitOS completo. CON backend (auth, DB, pagos, dashboard). Aqui vive toda la logica de negocio: venta de kits, suscripciones, afiliados, CRM. La arquitectura y diseno del sitio deben estar preparados para multiples productos y servicios.
- **stagekit.app** (y futuros kits) = Apps individuales por Kit, desplegadas desde el monorepo.

**Flujo de branding:** Disenar y validar identidad visual en alexendros.me (rapido, sin backend) → una vez consolidado, aplicar el sistema de diseno a alexendros.pro y los kits.

**UI/UX:** Integrar skill `ui-ux-pro-max` en el flujo de desarrollo de toda interfaz.

**Stack:** Next.js 15 App Router, TypeScript strict, Tailwind v4, shadcn/ui, Supabase, Prisma 5, Stripe, Resend, Turborepo, pnpm, Vercel (mad1).

**Estado actual:** Repo con commit inicial + Export Notion en GitHub (github.com/alexendros/alexendros-monorepo). Node v24.14.1, pnpm 2.9.3.

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
   └── skills/  (5: create-kit, new-db-migration, add-stripe-plan, deploy-vercel, gdpr-audit)
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
  - Subtitulo: "Fullstack developer. Fundador de KitOS. Background en derecho. Madrid."
  - CTA primario: "Explorar KitOS" → enlace a alexendros.pro
  - CTA secundario: "Contactar" → seccion contacto o mailto
- **About breve:** Bio 150 palabras (PF-0)
- **Proyectos destacados:** KitOS card con link a alexendros.pro (PF-3)
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
   - Templates React Email: bienvenida, booking, upgrade, trial, payment failed
   - Resend client factory

---

## FASE 6 — apps/alexendros-pro (Hub KitOS — App Completa)
> **Objetivo:** alexendros.pro como hub completo: catalogo de Kits, auth, dashboard, pagos, waitlist. Arquitectura preparada para multiples productos y servicios.
> **Prerequisito:** FASES 3 (branding validado en .me) + FASES 4-5 (db, stripe, email)
> **REGLA UI:** Ejecutar `/ui-ux-pro-max` antes de generar interfaz. Aplicar tokens de brand validados en .me.

### 6.1 — Scaffold Next.js 15 (CON server-side)
- App Router, TypeScript, Tailwind
- Conectar a TODOS los packages: brand, ui, db, stripe, email
- Middleware Supabase SSR protegiendo /(dashboard)
- next.config.ts con headers seguridad

### 6.2 — Landing publica (marketing)
- Hero: que es KitOS, UVP
- Catalogo de Kits disponibles (StageKit activo, LexKit/GestKit waitlist)
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

## FASE 8 — Hardening Pre-Produccion
> **Objetivo:** Checklist de Auditoria Pre-Produccion completo.
> **Prerequisito:** FASES 6-7

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
                    |
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

### Tras FASE 9:
- 3 dominios activos con SSL
- CWV en verde en todos
- npm audit limpio
- Checklist Hub en GREEN LIGHT
