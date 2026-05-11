# Threat Model — alexendros.pro (STRIDE + LINDDUN)

- Fecha: 2026-05-10
- Versión: 1.0
- Revisar: trimestral o tras cambios de arquitectura significativos
- Marco: STRIDE (amenazas técnicas) + LINDDUN (amenazas de privacidad)

---

## Contexto del sistema

**alexendros.pro** es un hub SaaS multi-producto (KitOS) que procesa:
- Autenticación de usuarios via Supabase Auth SSR
- Suscripciones Stripe + transferencias Connect Express (dinero real)
- Datos personales de clientes (nombre, email, datos de empresa) — RGPD Art. 6.1.b
- Analytics PostHog con consentimiento explícito AEPD 2023
- Contenido generado por usuarios (perfiles Kit)

**Activos críticos:**
| Activo | Clasificación |
|--------|---------------|
| Claves Stripe (secret + webhook secret) | Crítico |
| SUPABASE_SERVICE_ROLE_KEY | Crítico |
| Datos personales clientes (PII) | Alto |
| Tokens JWT de sesión | Alto |
| DATABASE_URL / DIRECT_URL | Alto |
| Código fuente monorepo | Medio |
| Logs de aplicación | Medio |

---

## Adversarios (A1–A8)

| ID | Perfil | Motivación | Capacidad |
|----|--------|-----------|-----------|
| A1 | Script kiddie | Oportunista, monetización rápida | Baja — usa herramientas públicas |
| A2 | Competidor SaaS | Inteligencia de negocio, disrupción | Media — recursos moderados |
| A3 | Cliente malicioso | Acceso no autorizado a otros clientes, chargeback fraud | Media — conoce el sistema desde dentro |
| A4 | Afiliado fraudulento | Manipular comisiones Connect Express | Media — acceso legítimo al flujo de pagos |
| A5 | Atacante OSINT | Phishing dirigido a Alexendros/operador | Media — ingeniería social |
| A6 | Bot scraper | Extracción masiva de datos/precios | Baja-Media — automatización |
| A7 | Insider malicioso | Exfiltración o sabotaje (futuro empleado/contratista) | Alta — acceso privilegiado |
| A8 | APT financiero | Compromiso de cuenta Stripe/credenciales bancarias | Alta — persistencia, sigilo |

---

## STRIDE — Análisis de amenazas técnicas

### S — Spoofing (Suplantación de identidad)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| S-01 | Sesión JWT forjada o robada | A1, A3 | Supabase Auth / cookies | `getUser()` (no `getSession()`) — verifica contra Supabase; HttpOnly + SameSite=Strict |
| S-02 | Webhook Stripe falso | A1, A4 | `/api/webhooks/stripe` | `stripe.webhooks.constructEvent()` obligatorio antes de procesar |
| S-03 | CSRF en Server Actions | A1, A2 | Next.js Server Actions | Origin check nativo Next.js 16; SameSite=Strict en cookies de sesión |
| S-04 | Phishing de credenciales operador | A5, A8 | GitHub / Vercel / Stripe dashboard | MFA obligatorio en todas las cuentas de servicio |
| S-05 | Account takeover via password reset | A3 | Supabase Auth | Rate limiting en `/api/auth/*`; email de alerta en cambio de contraseña |

### T — Tampering (Manipulación de datos)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| T-01 | Bypass de RLS para leer datos de otros clientes | A3 | Supabase PostgreSQL | RLS en TODAS las tablas; tests de RLS en CI (`vitest` con `supabaseAdmin` + user_session) |
| T-02 | SQL injection via Prisma | A1, A3 | Prisma queries | Prisma usa prepared statements por defecto; nunca interpolación manual |
| T-03 | Manipulación de precio de suscripción en checkout | A3, A4 | Stripe Checkout | `price_id` solo desde `process.env` (nunca cliente); verificar en webhook |
| T-04 | Modificación de metadatos de afiliado para inflar comisiones | A4 | Stripe Connect Express | Calcular comisiones server-side; nunca confiar en datos del cliente |
| T-05 | XSS en contenido de perfil Kit | A3 | Next.js rendering | React escapa JSX por defecto; sanitizar si se usa `dangerouslySetInnerHTML` (prohibido sin revisión) |

### R — Repudiation (Repudio)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| R-01 | Cliente niega haber dado consentimiento de cookies | A3 | AEPD ConsentLog | `ConsentLog` en DB con `user_id`, `consent_at`, `consent_version`, `ip_hash` |
| R-02 | Afiliado niega haber realizado referido fraudulento | A4 | Stripe Connect / DB | Audit log de transferencias con metadata de referido; immutable append |
| R-03 | Usuario niega cambio de plan/cancellation | A3 | Stripe subscriptions | Webhooks Stripe son fuente de verdad; audit trail en `SubscriptionLog` |

### I — Information Disclosure (Divulgación de información)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| I-01 | Variables de entorno en logs/error pages | A1, A6 | Next.js error handling | `NODE_ENV=production`; Sentry anonimiza PII antes de enviar |
| I-02 | Exfiltración de `SUPABASE_SERVICE_ROLE_KEY` | A7, A8 | Vercel env vars | Rotación trimestral; acceso a Vercel dashboard con MFA |
| I-03 | Enumeración de usuarios via timing attack | A1, A2 | `/api/auth/*` | Respuestas de tiempo constante en auth flows (bcrypt timing) |
| I-04 | Datos de clientes expuestos en respuestas tRPC sin autorización | A3 | tRPC procedures | Middleware de autenticación en todos los procedures; input validation Zod |
| I-05 | Scraping masivo de precios/contenido público | A6 | Next.js pages | Rate limiting en rutas públicas si necesario; `robots.txt` para bots legítimos |
| I-06 | Stack trace visible en producción | A1 | API error handlers | `onError` en tRPC filtra errores en producción; Next.js oculta stack en prod |

### D — Denial of Service (Denegación de servicio)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| D-01 | Flood de endpoints tRPC | A1, A2 | `/api/trpc/*` | Upstash Redis rate limiting (sliding window, 100 req/min por IP) |
| D-02 | Flood de auth endpoints | A1 | `/api/auth/*` | Rate limiting más estricto (10 req/min por IP) |
| D-03 | Webhook replay attack Stripe | A1 | `/api/webhooks/stripe` | `stripe.webhooks.constructEvent()` valida timestamp (±5min tolerancia) |
| D-04 | Agotamiento de conexiones Prisma/Supabase | A1 | Prisma connection pool | PgBouncer via `DATABASE_URL` pooler (port 6543); límite de conexiones configurado |

### E — Elevation of Privilege (Escalada de privilegios)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| E-01 | Acceso a rutas de admin sin rol adecuado | A3 | tRPC procedures / Next.js middleware | Verificar `user.role` en procedure middleware; nunca confiar en claims del cliente |
| E-02 | Uso de `supabaseAdmin` desde código cliente | A3, A7 | `packages/db` | `supabaseAdmin` solo en Server Components/Actions; lint rule para detectar imports cliente |
| E-03 | Prototype pollution via body parsing | A1 | tRPC / Next.js | Next.js 16 usa `undici` para body parsing; Zod valida schema estrictamente |
| E-04 | IDOR: acceder a recurso de otro tenant por ID | A3 | Supabase RLS + Prisma | RLS como capa de seguridad de DB; validar `user_id` en queries Prisma también |

---

## LINDDUN — Análisis de amenazas de privacidad

### L — Linkability (Vinculación)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| LN-01 | Correlación de identidad real con perfil Kit público | A2, A6 | Kit Profile pages | Datos mínimos en perfil público; opción de pseudónimo |
| LN-02 | Fingerprinting via PostHog sin consentimiento | A6 | PostHog SDK | Bloquear inicialización hasta `consent_given=1` (ADR-0006) |

### I — Identifiability (Identificabilidad)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| ID-01 | Emails en logs de Sentry | A7 | Sentry DSN | `beforeSend` hook: mascarar `email` con `***@domain` antes de enviar |
| ID-02 | IP literal en `ConsentLog` | interno | ConsentLog table | Almacenar `ip_hash` (SHA-256 + salt) — nunca IP literal (RGPD Art. 25) |

### N — Non-repudiation (No repudio — amenaza privacidad)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| NR-01 | Audit log inmutable impide borrado legítimo (derecho al olvido) | usuario | ConsentLog / AuditLog | Implementar `right_to_erasure` flow: anonimizar (no borrar) registros de audit |

### D — Detectability (Detectabilidad)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| DT-01 | Inferir existencia de cuenta por timing de respuesta | A2, A3 | Auth endpoints | Respuesta de tiempo constante (incluso si usuario no existe) |

### D — Disclosure (Divulgación no deseada)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| DI-01 | Datos de subscripción (plan, precio) visibles en HTML | A2 | SSR rendering | No renderizar datos financieros en HTML público; behind auth |

### U — Unawareness (Desconocimiento)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| U-01 | Usuario desconoce qué datos se recogen | usuario | Política de privacidad | Política clara (Art. 13 RGPD); enlace en footer y en onboarding |
| U-02 | Usuario no puede revocar consentimiento analytics | usuario | ConsentLog | Endpoint `/api/consent` con método DELETE; UI accesible en settings |

### N — Non-compliance (Incumplimiento)

| ID | Amenaza | Adversario | Componente | Mitigación |
|----|---------|-----------|-----------|-----------|
| NC-01 | Activar analytics antes de consentimiento | – | PostHog init | Guard estricto en `<AnalyticsProvider>`; E2E test verifica orden de inicialización |
| NC-02 | Retener datos más allá de la necesidad | – | DB / Backups | Política de retención definida; purga automática via n8n workflow |

---

## Controles transversales

| Control | Estado | Responsable |
|---------|--------|------------|
| MFA en GitHub / Vercel / Stripe / Supabase | Obligatorio | Alexendros |
| Rotación trimestral de secretos | Planificado (runbook) | Alexendros |
| `pnpm audit --audit-level=high` en CI | Implementado | CI/CD |
| Dependabot / Renovate para CVE | Pendiente habilitar | Alexendros |
| HTTPS/TLS en todos los endpoints | Vercel gestiona | Vercel |
| CSP via `vercel.json` headers | Implementado | vercel.json |
| HSTS + X-Frame-Options | Implementado | vercel.json |
| Rate limiting tRPC + auth | Planificado (Upstash) | Phase 6 |
| Tests RLS en CI | Planificado | Phase 4 |
| Política de retención de datos | Pendiente documentar | Phase 7 |

---

## Revisión y mantenimiento

Este documento debe actualizarse cuando:
- Se añade un nuevo endpoint de API o tRPC procedure
- Se incorpora un nuevo proveedor de datos (analytics, email, pagos)
- Se añade un nuevo tipo de dato personal recogido
- Tras cualquier incidente de seguridad (ver runbook `incident-response.md`)
- Revisión trimestral programada

Referencia cruzada: `docs/adr/0006-cookie-banner-bloqueante-aepd.md` · `docs/runbooks/` · `docs/07-compliance-legal.md`
