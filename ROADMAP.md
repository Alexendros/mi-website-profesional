# ROADMAP · alexendros-pro

> Plan operacional del monorepo. Vivo. Última revisión: 2026-05-28.
> Objetivo de negocio: web pública atractiva, automatizada y funcional que capte clientes de calidad y derive el tráfico cualificado a un embudo Stripe con onboarding claro y obligaciones contractuales explícitas para el cliente.
>
> Convenciones:
> - `[ ]` pendiente · `[~]` en curso · `[x]` cerrado · `[!]` bloqueado.
> - Cada tarea cita la **skill** y el **agente** que la ejecuta (catálogo en `~/.claude/agents/` y `~/.claude/skills/`).
> - Cada fase tiene **criterios de aceptación verificables** y un **script de auditoría** bajo `scripts/audit/` que devuelve `0` si la fase está cerrada.
> - Referencias normativas: RGPD UE 2016/679 (Arts. 6, 13, 30), LOPDGDD LO 3/2018, PSD2 Directiva 2015/2366/UE, PCI DSS v4.0 SAQ-A, WCAG 2.2 AA, Core Web Vitals (LCP, INP, CLS) según google.com/search/core-web-vitals.

---

## 0. ESTADO ACTUAL (snapshot 2026-05-28)

Resultado de la auditoría (ver `scripts/audit/99-report.sh`):

| Bloque | Estado | Evidencia |
|---|---|---|
| Turborepo + pnpm + TS strict | OK | `turbo.json`, `pnpm-workspace.yaml` |
| Design system (`packages/brand`, `packages/ui`) | OK | 15 componentes shadcn, tokens oklch |
| `apps/alexendros-pro` landing | scaffold | `app/page.tsx` "próximamente", headers CSP/HSTS en `vercel.json` |
| `apps/stagekit` | vacío | sólo `tsconfig.tsbuildinfo` — bloquea CI Playwright |
| `packages/db` (Prisma) | scaffold | solo modelo `User`, sin RLS, sin migraciones, sin credenciales |
| `packages/stripe` | scaffold | sólo singleton cliente, sin planes ni webhooks |
| `packages/email` | vacío | `src/index.ts` sin templates |
| Supabase Auth SSR | no instalado | `@supabase/ssr` ausente |
| tRPC v11 | no instalado | sin router, sin caller factory |
| Next.js | **15.5.18** | divergente del canon CLAUDE.md (16.2) |
| CI (.github/workflows) | parcial | `ci.yml` ejecuta Playwright contra `stagekit` vacío → falla |
| `.env.local` | riesgo | `VERCEL_OIDC_TOKEN` presente — auditar exposición |

Lectura: el monorepo está en **Fase 3.5**. Para llegar al objetivo de negocio hay que completar Fases 4 → 7 (DB, pagos, hub, kit MVP) y endurecer Fases 8 → 9 (automatización n8n, hardening + SEO/GEO).

---

## 1. PRINCIPIOS DE EJECUCIÓN

1. **Una rama por fase**, PRs pequeños, nunca push a `main`. Trabajo aislado en `.claude/worktrees/` por sesión Claude.
2. **Skills antes que improvisar.** Cadena canónica del repo: `/PRODUCTO_brainstorming → /PRODUCTO_especificacion → /APP_maestria → /APP_calidad` + agente `code-reviewer`. Prohibido invocar comandos `gsd-*` (descatalogados).
3. **Verificación antes que confianza.** Cada fase se considera cerrada sólo cuando el script `scripts/audit/N-*.sh` correspondiente retorna `0` con `pipefail` activo.
4. **Compliance no negociable.** Ninguna fase con datos personales se promueve a producción sin `gdpr-audit` aprobado por el agente `gdpr-compliance`.
5. **Targets de rendimiento obligatorios:** LCP < 2.0 s desktop / < 2.5 s mobile, INP < 200 ms, CLS < 0.1, Lighthouse Performance > 90, accesibilidad > 95.
6. **Embudo Stripe = contrato.** El checkout debe terminar entregando al cliente: (a) acceso al kit, (b) acuerdo firmado con obligaciones y SLAs, (c) instrucciones de onboarding y entregables esperados, (d) calendario de hitos.
7. **Trazabilidad.** Cada artefacto generado por un agente queda enlazado en `.planning/STATE.md` con commit, fecha y autor (Claude Opus 4.7 1M + revisor humano).

---

## 2. FASES

### Fase 4 · Supabase self-hosted sobre Dokploy (ADR-0003)
**Objetivo:** instancia Supabase self-hosted productiva en VPS Hostinger EU bajo Dokploy, expuesta en `supabase.alexendros.pro`, con RLS exhaustiva, 13 modelos Prisma y auth SSR funcional. **Supersede ADR-0002.**
**Agente principal:** `db-architect` + orquestador `claude`. **Revisor:** `code-reviewer` + `gdpr-compliance`. **Skills:** `/APP_despliegue`, `/APP_migracion-bd`, `/APP_seguridad`, `/LEGAL_cumplimiento`, `new-db-migration`, `gdpr-audit`.

- [ ] 4.0 **Preflight Dokploy** · `infra/dokploy/PREFLIGHT.md` con 13 checks (país EU del datacenter, recursos ≥ 4 GB RAM / 2 vCPU / 40 GB, Docker ≥ 24, red `dokploy-network`, DNS A/AAAA de `supabase.alexendros.pro`, `studio.supabase.alexendros.pro`, `db.supabase.alexendros.pro`, resolver Traefik `letsencrypt`, NTP, firewall SSH). Skill `/APP_despliegue`. Agente: `claude`. **AC:** todos los obligatorios en verde.
- [ ] 4.1 **Deploy Supabase compose en Dokploy** · `supabase/supabase` upstream + `infra/dokploy/supabase/compose.override.yml` + `kong.yml`. Endpoint `supabase.alexendros.pro` (Kong) + `studio.supabase.alexendros.pro` (Studio detrás de basicAuth + ipAllowList + `X-Robots-Tag: noindex`). Supavisor expuesto como TCP router TLS-passthrough en `db.supabase.alexendros.pro:6543`; Postgres 5432 limitado por firewall a IPs del operador. Secretos generados con `scripts/gen-jwt.ts` + `openssl rand`. SMTP apuntando a Resend. Skill `/APP_despliegue` + `/APP_seguridad`. Agente: `claude` (orquesta) + `code-reviewer`. **AC:** `curl https://supabase.alexendros.pro/auth/v1/health` → 200 `GoTrue`; Studio responde 401 sin basic-auth; Postgres no accesible desde IP no listada.
- [ ] 4.2 **Auth providers** · Acción humana siguiendo `infra/dokploy/supabase/OAUTH.md`: Google Cloud OAuth Web, GitHub OAuth App, Apple Developer Program + Services ID + key `.p8` + JWT client secret (`scripts/gen-apple-secret.ts`, rotación cron 150 días). Magic link y email+password sólo requieren SMTP. Skill `/APP_seguridad`. Agente: `claude`. **AC:** smoke por provider devuelve sesión válida en staging.
- [ ] 4.3 **Schema Prisma + RLS + triggers** · 13 modelos en `packages/db/prisma/schema.prisma` (`User`, `Kit`, `Plan`, `Price`, `Subscription`, `ClientProfile`, `KitProfile`, `InboundRequest`, `Affiliate`, `AffiliatePayout`, `AuditLog`, `DigitalRegistration`, `ConsentRecord` + `Lead`). Migraciones: `0001_init`, `0002_kits_plans_seed`, `0003_auth_user_sync` (trigger `auth.users → public.users` + `current_user_id()`), `0004_rls_policies` (≥ 18 policies con base legal RGPD en comentario), `0005_indices_partials`. Append-only en `audit_log`, `consent_records`, `digital_registrations`. Skill `/APP_migracion-bd` + `new-db-migration`. Agente: `db-architect`. **AC:** `bash scripts/audit/20-db-schema.sh` → 0.
- [ ] 4.4 **Factory Prisma + Supabase SSR + `proxy.ts`** · `packages/db/src/{prisma,supabase}.ts` exportan `prisma`, `createServerSupabase`, `createBrowserSupabase`, `createServiceRoleSupabase` (con guard CP-03). `apps/alexendros-pro/proxy.ts` sustituye `middleware.ts` y llama `updateSession` + `getUser()` (CP-01). `packages/config/src/env.ts` valida vars self-hosted con Zod. CSP en `vercel.json` admite `supabase.alexendros.pro` en `connect-src`/`form-action`/`img-src` + `wss://` para Realtime. Skill `/APP_maestria` + `/APP_seguridad`. Agente: `code-reviewer`. **AC:** typecheck verde, `getUser()` usado en server components, ningún `auth.getSession()`.
- [ ] 4.5 **Seed determinista** · `packages/db/prisma/seed.ts` con 3 Kits (`stagekit`, `lexkit`, `gestkit`), 3 Plans (`free`, `pro`, `agency`), Prices con `STRIPE_PRICE_*` placeholder. Idempotente (upsert). Sin PII real. Skill `new-db-migration`. Agente: `db-architect`. **AC:** `pnpm --filter=@repo/db prisma db seed` corre dos veces sin errores.
- [ ] 4.6 **Verificación E2E** · Playwright `tests/auth-magic-link.spec.ts`: registro → SMTP Mailpit en CI → callback → cookie `sb-*` → query tRPC `auth.me` con `userId`. Smoke manual OAuth de los 4 providers en staging. Skill `/APP_calidad`. Agente: `code-reviewer`. **AC:** test verde en CI; smokes OAuth verdes en staging.
- [ ] 4.7 **ADR-0003 + RoPA + DPA Hostinger** · `docs/adr/0003-supabase-self-hosted-dokploy.md` mergeado, `0002` marcado `superseded`. `docs/legal/ropa.md` con T-001..T-007. DPA Hostinger firmado y archivado fuera de git (`~/Documentos/legal/dpa-hostinger-YYYY-MM-DD.pdf`). Skill `/LEGAL_cumplimiento` + `gdpr-audit`. Agente: `gdpr-compliance`. **AC:** ADR y RoPA mergeados; backup `pg_dump` corre 7 noches seguidas sin error en VPS.

**Criterio de aceptación global Fase 4:** `bash scripts/audit/20-db-schema.sh && bash scripts/audit/00-preflight.sh` retornan 0; ADR-0003 mergeado; `pg_dump` nocturno corre 7 días seguidos; Playwright magic link verde en CI.

### Fase 5 · Pagos, planes y embudo Stripe
**Objetivo:** captura de clientes desde landing → checkout → onboarding documentado, con webhooks idempotentes y obligaciones contractuales entregadas tras pago.
**Agente principal:** `stripe-engineer`. **Skills:** `add-stripe-plan`, `/CREA_integracion` (Stripe MCP). **Revisor:** `code-reviewer`, `gdpr-compliance`.

- [ ] 5.1 `lib/stripe/kit-plans.ts` — única fuente de verdad de planes. IDs sólo desde env (`STRIPE_PRICE_*`). Nunca hardcodeados.
- [ ] 5.2 Catálogo inicial: `pro-monthly`, `pro-annual`, `agency-monthly`, `agency-annual`, addon `priority-support`, addon `compliance-pack`. Crear en Stripe Dashboard + sincronizar.
- [ ] 5.3 Checkout Sessions con `customer_email`, `client_reference_id`, `metadata.kit`, `tax_id_collection`, `automatic_tax: true`, `payment_method_options.card.request_three_d_secure: "any"` (PSD2/SCA).
- [ ] 5.4 Webhook `/api/webhooks/stripe` con verificación de firma (`constructEvent`), idempotency key, cola de reintentos. Eventos: `checkout.session.completed`, `customer.subscription.created/updated/deleted`, `invoice.payment_failed`, `transfer.created`.
- [ ] 5.5 Stripe Connect Express para afiliados (15% primer año), comisiones registradas en tabla `AffiliateLink` y `Transfer`.
- [ ] 5.6 Plantillas React Email post-checkout: bienvenida, contrato firmado (PDF adjunto), checklist de onboarding, calendario de hitos, instrucciones del cliente.
- [ ] 5.7 Página `/precios` con tabla comparativa accesible (WCAG 2.2 AA), microcopy persuasivo orientado al avatar de cliente.
- [ ] 5.8 Página `/contratar/[plan]` redirige a Checkout con consentimiento explícito de Términos + RGPD registrado en `ConsentRecord`.
- **Criterio de aceptación:** `scripts/audit/30-stripe-funnel.sh` → 0 (planes en env, webhook firmado, idempotencia probada en test, mail post-checkout enviado en Resend sandbox, contrato PDF generado, evento registrado en `ConsentRecord`).

### Fase 6 · Hub alexendros.pro (Auth + Dashboard + tRPC)
**Objetivo:** clientes acceden a panel privado donde reciben instrucciones, ven hitos, suben material y firman entregables.
**Agente principal:** `code-reviewer`. **Skills:** `/APP_maestria`, `/APP_seguridad`, `/UX_sistema`. **Apoyo:** `db-architect`, `stripe-engineer`.

- [ ] 6.1 Migrar a **Next.js 16.2**: renombrar `middleware.ts` → `proxy.ts`, awaitar `params`/`cookies()`/`headers()`, segundo argumento en `revalidateTag(tag, 'max')`, Node 20.9+ en Vercel y CI.
- [ ] 6.2 Supabase Auth SSR (`@supabase/ssr`): `createServerClient` en RSC/Route Handlers, `createBrowserClient` en client components. Magic link + OAuth (Google) + email/password con verificación.
- [ ] 6.3 Rate limiting Upstash Redis en `/api/auth/*` y `/api/trpc/*` (10 req/min anon, 60 req/min autenticado).
- [ ] 6.4 tRPC v11: router `auth`, `billing`, `onboarding`, `kits`. `createCallerFactory` para Server Components.
- [ ] 6.5 Dashboard `/app`: estado de suscripción, próximos pagos, descargas, formularios de onboarding, calendario de hitos, mensajería con soporte.
- [ ] 6.6 Página de obligaciones del cliente — qué entrega, en qué formato, con qué frecuencia. Firma electrónica simple registrada en `ConsentRecord`.
- [ ] 6.7 Logs anonimizados a Sentry (email hash + user_id pseudonimizado), PostHog EU con consentimiento previo.
- **Criterio de aceptación:** `scripts/audit/40-hub.sh` → 0 (Next 16 detectado, `proxy.ts` presente, login E2E pasa en Playwright, dashboard renderiza con sesión, rate limit responde 429 al superar umbral, Sentry recibe error de prueba sin PII).

### Fase 7 · Captación, SEO/GEO y landing comercial
**Objetivo:** la home de alexendros.pro convierte. SEO técnico impecable, citabilidad por motores AI, microcopy persuasivo y CTAs hacia el embudo Stripe.
**Agente principal:** `seo-geo-specialist`. **Skills:** `/UX_sistema`, `brand-manual`. **Apoyo:** `brand-auditor`.

- [ ] 7.1 IA-friendly: `llms.txt`, `robots.txt`, sitemap dinámico, JSON-LD `Organization` + `Service` + `Offer` + `FAQPage` + `Person` (autor). OpenGraph y Twitter Cards con `og:image` 1200×630 generadas en build.
- [ ] 7.2 Hero con propuesta de valor, prueba social, vídeo loop ligero, CTA primario `→ /precios`. LCP < 2.0 s desktop.
- [ ] 7.3 Secciones: problema, solución, kits disponibles (`StageKit`/`LexKit`/`GestKit`), testimonios, comparativa, precios, FAQ, contacto, legal.
- [ ] 7.4 Lead magnet: ebook PDF + formulario doble opt-in (Resend + `ConsentRecord`).
- [ ] 7.5 Blog `/recursos` con MDX, autoría declarada (E-E-A-T), schema `Article`.
- [ ] 7.6 Multilenguaje ES → EN diferido (i18n routing preparado, contenido sólo ES en MVP).
- [ ] 7.7 Captura UTM + atribución multi-touch en `Lead` (origen, campaña, contenido).
- **Criterio de aceptación:** `scripts/audit/50-seo-cwv.sh` → 0 (Lighthouse Perf ≥ 90, A11y ≥ 95, SEO = 100, JSON-LD validado, `llms.txt` accesible, sitemap 200, og:image generada).

### Fase 7.5 · Automatización n8n (post-MVP inmediato)
**Objetivo:** el cliente recibe instrucciones, recordatorios y entregables sin intervención manual.
**Agente principal:** `claude` (orquestador) + `stripe-engineer`. **Skills:** `/CREA_integracion`. **Infraestructura:** Hostinger VPS via MCP `hostinger`.

- [ ] 7.5.1 Despliegue n8n en VPS (Docker Compose, 2 GB RAM, healthcheck `/healthz` cada 5 min en Better Uptime).
- [ ] 7.5.2 Workflows W-01..W-10 (onboarding): bienvenida, checklist firmado, recogida de assets, kickoff, entrega 1, revisión, entrega final.
- [ ] 7.5.3 Workflows W-11..W-17 (dunning): aviso pre-impago, reintento, suspensión, recuperación.
- [ ] 7.5.4 Secret `N8N_WEBHOOK_SECRET` firmado HMAC en cada webhook.
- **Criterio de aceptación:** `scripts/audit/60-n8n.sh` → 0 (`/healthz` 200, ≥ 10 workflows activos, último run < 24 h, sin errores en logs).

### Fase 8 · Hardening, seguridad y compliance
**Objetivo:** lista pública sin riesgos legales ni de seguridad.
**Agente principal:** `gdpr-compliance` + `code-reviewer`. **Skills:** `/APP_seguridad`, `/LEGAL_cumplimiento`, `gdpr-audit`.

- [ ] 8.1 Auditoría secretos: rotar `VERCEL_OIDC_TOKEN` si quedó en commit; pre-commit con `gitleaks`.
- [ ] 8.2 CSP estricta sin `unsafe-inline`, HSTS preload, COEP/COOP/CORP coherentes, Permissions-Policy minimal.
- [ ] 8.3 Cookies: banner conforme TJUE C-673/17 + LOPDGDD; PostHog/Sentry sólo tras consentimiento. Registro en `ConsentRecord`.
- [ ] 8.4 Páginas legales: Aviso Legal, Privacidad (Art. 13 RGPD), Cookies, Términos, DPA para clientes B2B, contacto DPO.
- [ ] 8.5 RoPA (Art. 30 RGPD) en `docs/legal/ropa.md`.
- [ ] 8.6 Pentest ligero: ZAP baseline, `npm audit --audit-level=high`, Semgrep ruleset `p/owasp-top-ten`.
- **Criterio de aceptación:** `scripts/audit/70-security.sh` → 0 (`gitleaks` clean, CSP sin `unsafe-inline`, `npm audit` sin highs, Semgrep sin findings críticos, RoPA presente).

### Fase 9 · Lanzamiento, observabilidad y crecimiento
**Objetivo:** salir en producción con dashboards, alertas y plan de iteración.
**Agente principal:** `code-reviewer`. **Skills:** `/APP_despliegue`, `/APP_calidad`.

- [ ] 9.1 Deploy Vercel mad1 con dominio `alexendros.pro`, certificado, redirects `www → apex`.
- [ ] 9.2 PostHog dashboards: funnel landing → checkout → activación, retención semanal, NPS.
- [ ] 9.3 Sentry alertas a email y Slack/Discord con SLA: P1 < 15 min, P2 < 4 h.
- [ ] 9.4 Better Uptime: monitores cada 1 min para `/`, `/precios`, `/api/health`, n8n `/healthz`.
- [ ] 9.5 Plan de contenidos editorial (≥ 1 artículo/semana primer trimestre).
- [ ] 9.6 Revisión post-lanzamiento semanal con `/APP_calidad` + retro en `.planning/STATE.md`.
- **Criterio de aceptación:** `scripts/audit/99-report.sh` → 0 global (todas las fases anteriores en verde + monitores live).

---

## 3. ASIGNACIÓN DE AGENTES Y SKILLS POR FASE

| Fase | Agentes | Skills |
|---|---|---|
| 4 | `db-architect`, `gdpr-compliance`, `code-reviewer` | `/APP_migracion-bd`, `new-db-migration` |
| 5 | `stripe-engineer`, `gdpr-compliance`, `code-reviewer` | `add-stripe-plan`, `/CREA_integracion` |
| 6 | `code-reviewer`, `db-architect`, `stripe-engineer` | `/APP_maestria`, `/APP_seguridad`, `/UX_sistema` |
| 7 | `seo-geo-specialist`, `brand-auditor` | `brand-manual`, `/UX_sistema` |
| 7.5 | orquestador `claude`, `stripe-engineer` | `/CREA_integracion` |
| 8 | `gdpr-compliance`, `code-reviewer` | `gdpr-audit`, `/APP_seguridad`, `/LEGAL_cumplimiento` |
| 9 | `code-reviewer` | `/APP_despliegue`, `/APP_calidad` |

**Paralelización recomendada:** Fase 4 y Fase 5 pueden empezar simultáneamente cuando Supabase esté provisionado (4.1 desbloquea ambas). Fase 7 (SEO/landing) puede progresar en paralelo a 6 (hub) a partir de 6.1 (migración Next 16).

---

## 4. SCRIPTS DE VERIFICACIÓN

Ubicación: `scripts/audit/`. Convenciones:
- Shebang `#!/usr/bin/env bash`, `set -Eeuo pipefail`, `IFS=$'\n\t'`.
- Salida estructurada: `OK:` / `WARN:` / `FAIL:` y código de retorno coherente.
- Tras pipes siempre `set -o pipefail` o `${PIPESTATUS[0]}` (norma del operador).

Inventario:

| Script | Cubre |
|---|---|
| `00-preflight.sh` | versiones de Node, pnpm, Turbo, repo limpio, `.env.local` presente, ramas |
| `10-stack-versions.sh` | Next 16, React 19.2, Tailwind 4.1+, Prisma 5, tRPC v11, Supabase SSR, Stripe |
| `20-db-schema.sh` | modelos Prisma ≥ 11, RLS activa, migraciones limpias, seed sin PII |
| `30-stripe-funnel.sh` | planes definidos, webhook firmado, idempotencia, plantillas Resend |
| `40-hub.sh` | login E2E Playwright, dashboard renderiza, rate limit 429, Sentry sin PII |
| `50-seo-cwv.sh` | Lighthouse, JSON-LD, `llms.txt`, sitemap, og:image |
| `60-n8n.sh` | healthz, workflows activos, último run reciente |
| `70-security.sh` | gitleaks, CSP, `npm audit`, Semgrep, RoPA presente |
| `99-report.sh` | corre todos y emite informe agregado |

Ejecución completa:

```bash
pnpm -w run audit          # equivalente a bash scripts/audit/99-report.sh
```

Cada script imprime al final una línea `RESULT: PASS|FAIL fase=<N>`.

---

## 5. RIESGOS ABIERTOS

1. **`VERCEL_OIDC_TOKEN` en `.env.local`** — confirmar que `.env.local` está en `.gitignore` y rotar si tocó remoto.
2. **`apps/stagekit/` vacío bloquea CI** — quitar del pipeline hasta tener código mínimo, o crear un placeholder Next con un test trivial.
3. **Next 15 → 16** — deuda técnica antes de añadir features de Fase 6; planificar como primer paso de Fase 6 con branch dedicada.
4. **Supabase sin credenciales** — depende de acción humana (crear proyecto + pegar claves). Único bloqueador externo de Fase 4.
5. **Costes infraestructura** — todo free tier excepto VPS Hostinger; revisar tras 500 clientes (Supabase Pro, Resend Pro, Upstash paid).

---

## 6. PROCESO DE ACTUALIZACIÓN DE ESTE DOCUMENTO

- Cada PR que cierra una tarea marca `[x]` y enlaza el commit.
- Cuando una fase queda en verde, mover su bloque a `## Completado` (al final) con fecha.
- Revisiones mayores (cambio de stack, nueva fase) requieren entrada en `.planning/STATE.md` y aprobación humana.

## Completado

- [x] 2026-04-08 · Fase 1 Monorepo Scaffold (Turborepo, TS strict, Zod env).
- [x] 2026-04-08 · Fase 2 Design System (31 tokens oklch, 15 componentes shadcn).
- [x] 2026-04-11 · Fase 3 alexendros.me extraída a `~/Apps/alexendrosme/` (commit `a180d73`).
