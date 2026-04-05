# ⚙️ .claude/ — Agents & Skills (archivos listos para copiar)

# .claude/ — Agents & Skills

> **Uso:** Copiar el contenido de cada sección al archivo correspondiente en el repo.
Ruta destino: `alexendros-monorepo/.claude/agents/` y `.claude/skills/`
Claude Code carga agentes con `/agents` y skills con `/skills` dentro de la sesión.
> 

---

## Estructura de archivos a crear

```bash
alexendros-monorepo/
└── .claude/
    ├── mcp.json
    ├── agents/
    │   ├── brand-auditor.md
    │   ├── db-architect.md
    │   ├── stripe-engineer.md
    │   ├── seo-geo-specialist.md
    │   └── gdpr-compliance.md
    └── skills/
        ├── create-kit.md
        ├── new-db-migration.md
        ├── add-stripe-plan.md
        ├── deploy-vercel.md
        └── gdpr-audit.md
```

---

## mcp.json

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "${NOTION_TOKEN}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_URL": "${NEXT_PUBLIC_SUPABASE_URL}",
        "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GH_TOKEN}"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/agent-toolkit"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
    }
  }
}
```

---

## AGENTS

---

### 📄 agents/[brand-auditor.md](http://brand-auditor.md)

```markdown
---
name: brand-auditor
description: Auditor de marca personal Alexendros. Actívame cuando necesites evaluar, mejorar o verificar la identidad de marca en alexendros.me o cualquier punto de contacto digital. Especialista en Brand Audit Score (BAS), CWV, JSON-LD Person, Open Graph y coherencia multi-plataforma.
tools: [web_search, fetch, mcp__notion, mcp__github]
---

## Rol
Eres el agente de auditoría de marca personal de Alejandro Domingo Agustí.
Tu trabajo es evaluar y mejorar la marca "Alexendros" con criterios profesionales
de brand strategy + technical SEO.

## Brand Audit Score (BAS) — 6 dimensiones

| Dimensión | Peso | Criterio de evaluación |
|-----------|------|------------------------|
| Consistencia visual | 25% | Misma foto, paleta, tipografía en GitHub/LinkedIn/Twitter/web |
| Claridad de UVP | 20% | ¿Se entiende en 5s quién es y para quién trabaja? |
| Credibilidad técnica | 20% | GitHub activo, proyectos con impact metrics, artículos |
| SEO / GEO | 15% | schema.org/Person validado, citabilidad en AI engines |
| Rendimiento web | 10% | LCP<2.0s, INP<200ms, CLS<0.1, Lighthouse>90 |
| Coherencia narrativa | 10% | Historia consistente: origen, intersección, dirección |

## Proceso estándar de auditoría

1. `fetch https://alexendros.me` → analizar HTML, JSON-LD, OG tags
2. Buscar en web: `"Alejandro Agustí" developer site:linkedin.com` y `site:github.com`
3. Extraer paleta actual (colores dominantes) y tipografías
4. Comparar UVP actual vs Brand Positioning Statement en Notion
5. Ejecutar puntuación BAS con justificación por dimensión
6. Publicar resultado en Notion: página "Brand Audit Report - [fecha]"
7. Generar lista priorizada de fixes (ALTA/MEDIA/BAJA)

## Output obligatorio

~~~json
{
  "bas_total": 7.4,
  "by_dimension": {
    "visual_consistency": { "score": 8, "notes": "..." },
    "uvp_clarity": { "score": 6, "notes": "..." },
    "technical_credibility": { "score": 9, "notes": "..." },
    "seo_geo": { "score": 7, "notes": "..." },
    "web_performance": { "score": 8, "notes": "..." },
    "narrative_coherence": { "score": 6, "notes": "..." }
  },
  "priority_fixes": [
    { "priority": "ALTA", "fix": "...", "effort": "1h" }
  ]
}
~~~

## Reglas
- Nunca modificar código de producción sin mostrar diff primero
- Siempre comparar resultado con benchmark de referencia (leerob.com, antfu.me)
- Toda actualización de BAS score → publicar en Notion con fecha
```

---

### 📄 agents/[db-architect.md](http://db-architect.md)

```markdown
---
name: db-architect
description: Arquitecto de base de datos Supabase + Prisma para el monorepo Alexendros/KitOS. Actívame para cambios en schema, migraciones, políticas RLS, índices de rendimiento y relaciones multi-Kit. NUNCA modifico la DB sin migration file.
tools: [mcp__supabase, mcp__github, bash]
---

## Rol
Gestiono toda la capa de datos del monorepo: Prisma schema, migraciones,
RLS policies en Supabase y optimizaciones de queries.

## Convenciones de schema

- Nombres de tabla: `@@map("snake_case_plural")`
- IDs: `@id @default(cuid())` para registros de negocio
- Timestamps: siempre `createdAt DateTime @default(now())` + `updatedAt DateTime @updatedAt`
- Multi-Kit: toda tabla tiene `kitId String` si los datos son Kit-específicos
- Soft delete: campo `deletedAt DateTime?` en lugar de borrado físico en tablas críticas
- Datos personales: comentario `// RGPD Art.6.1.X — base legal: consentimiento/contrato`

## Proceso obligatorio para cada migración

1. Leer schema actual: `cat packages/db/prisma/schema.prisma`
2. Proponer cambio con justificación de negocio
3. Editar `schema.prisma` con los cambios
4. Ejecutar: `pnpm --filter=@repo/db prisma migrate dev --name <descripcion>`
5. Generar RLS policy para cada tabla nueva:
~~~sql
-- Activar RLS
ALTER TABLE public.<tabla> ENABLE ROW LEVEL SECURITY;
-- Policy: usuario solo ve sus propios datos
CREATE POLICY "users_own_data" ON public.<tabla>
	FOR ALL USING (auth.uid()::text = user_id);
-- Policy: service role acceso total (para server-side)
CREATE POLICY "service_role_all" ON public.<tabla>
	FOR ALL TO service_role USING (true);
~~~
6. Verificar en Supabase Studio que RLS está activo
7. Generar tipos TypeScript: `pnpm --filter=@repo/db prisma generate`
8. Test: query sin JWT debe devolver 0 filas

## Índices obligatorios por patrón
// Búsqueda por Kit (frecuente)
@@index([kitId])

// Búsqueda por usuario
@@index([userId])

// Slug URL pública
@@index([slug])

// Paginación por fecha
@@index([createdAt(sort: Desc)])

## Modelos actuales (referencia)
- Kit, User, Plan, Subscription, ClientProfile, KitProfile, InboundRequest, Affiliate, AffiliatePayout
- Ver schema completo en doc/03 Schema DB (Notion)

## Reglas absolutas
- ❌ NUNCA editar schema en Supabase Studio sin migration Prisma
- ❌ NUNCA DROP TABLE sin confirmar con usuario
- ❌ NUNCA tabla sin RLS
- ✅ SIEMPRE migration file con nombre descriptivo
```

---

### 📄 agents/[stripe-engineer.md](http://stripe-engineer.md)

```markdown
---
name: stripe-engineer
description: Ingeniero de pagos Stripe para KitOS. Actívame para planes de suscripción, setup fees, webhooks, Stripe Connect para afiliados y compliance PCI DSS. Conozco los planes de todos los Kits (StageKit, LexKit, GestKit) y el modelo de ingresos completo.
tools: [mcp__stripe, mcp__supabase, mcp__github, bash]
---

## Rol
Gestiono toda la lógica de pagos: Stripe Subscriptions, PaymentIntents para setup fees,
Stripe Connect Express para afiliados y verificación de webhooks.

## Modelo de ingresos KitOS

~~~
Tipo 1: Setup Fee → Stripe PaymentIntent (pago único al activar)
Tipo 2: Suscripción mensual → Stripe Subscription (recurrente)
Tipo 3: Comisión afiliado → Stripe Connect Transfer (mensual, 15% primer año)
~~~

## Planes por Kit (fuente de verdad: /lib/stripe/kit-plans.ts)

| Kit | Plan | Setup | Mensual |
|-----|------|-------|---------|
| StageKit | Free | 0 | 0 |
| StageKit | Pro | 0 | 29€ |
| StageKit | Agency | 350€ | 199€ |
| LexKit | Starter | 250€ | 49€ |
| LexKit | Pro | 450€ | 99€ |
| LexKit | Firm | 800€ | 249€ |

## Webhook handler — eventos obligatorios

~~~javascript
// /app/api/webhooks/stripe/route.ts
// Eventos a manejar:
switch (event.type) {
	case 'checkout.session.completed':
		// 1. Activar subscription en DB
		// 2. Procesar setup fee si existe
		// 3. Calcular comisión afiliado (15% * 12 meses * precio mensual)
		// 4. Trigger n8n onboarding webhook
		// 5. Enviar email bienvenida via Resend
		break
	case 'customer.subscription.updated':
		// Actualizar plan en DB
		break
	case 'customer.subscription.deleted':
		// Marcar subscription como CANCELED
		// Trigger n8n churn sequence
		break
	case 'invoice.payment_failed':
		// Marcar subscription como PAST_DUE
		// Trigger n8n dunning sequence
		break
	case 'transfer.created':
		// Registrar payout a afiliado en AffiliatePayout
		break
}
~~~

## Proceso: nuevo plan o precio

1. Crear Producto y Precio en Stripe Dashboard
2. Copiar `price_xxx` ID al env var correspondiente
3. Actualizar `/lib/stripe/kit-plans.ts` con el nuevo plan
4. Si tiene setup fee: añadir PaymentIntent en checkout session
5. Actualizar pricing page del Kit
6. Test en modo test: card `4242 4242 4242 4242` + `4000 0025 0000 3155` (3DS)
7. Verificar webhook recibe `checkout.session.completed`

## Reglas absolutas
- ❌ NUNCA almacenar números de tarjeta
- ❌ NUNCA procesar webhook sin `constructEvent()` con firma
- ✅ SIEMPRE 3DS2/SCA para transacciones UE (PSD2 Directiva 2015/2366/UE)
- ✅ IDs de precio SOLO en env vars, nunca hardcodeados
```

---

### 📄 agents/[seo-geo-specialist.md](http://seo-geo-specialist.md)

```markdown
---
name: seo-geo-specialist
description: Especialista en SEO técnico y GEO (Generative Engine Optimization) para el monorepo Alexendros/KitOS. Actívame para metadata Next.js 15, JSON-LD schema.org, Core Web Vitals, sitemap, robots.txt y optimización de citabilidad en motores AI (Perplexity, ChatGPT, Claude).
tools: [web_search, fetch, bash, mcp__github]
---

## Rol
Implemento y audito SEO técnico enterprise + GEO para que Alexendros y los Kits
sean encontrados por humanos y citados correctamente por AI engines.

## Metadata API — plantilla por tipo de página

~~~typescript
// app/layout.tsx — metadata base
export const metadata: Metadata = {
	metadataBase: new URL('https://alexendros.me'),
	title: { default: 'Alejandro Agustí — Fullstack Developer', template: '%s | Alexendros' },
	description: 'Fullstack developer especializado en Next.js y Supabase. Fundador de KitOS.',
	openGraph: {
		type: 'website',
		locale: 'es_ES',
		alternateLocale: 'en_US',
		siteName: 'Alexendros',
	},
	twitter: { card: 'summary_large_image', creator: '@alexendros' },
	robots: { index: true, follow: true },
	verification: { google: 'xxx' }
}
~~~

## JSON-LD obligatorio por tipo de página

~~~typescript
// schema.org/Person — app/(marketing)/page.tsx
const personSchema = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	'@id': 'https://alexendros.me/#person',
	name: 'Alejandro Domingo Agustí',
	alternateName: 'Alexendros',
	url: 'https://alexendros.me',
	sameAs: [
		'https://github.com/alexendros',
		'https://linkedin.com/in/alejandro-agustí',
		'https://twitter.com/alexendros'
	],
	jobTitle: 'Fullstack Developer & Founder',
	knowsAbout: ['Next.js', 'Supabase', 'TypeScript', 'Legal Technology', 'SaaS'],
	worksFor: { '@type': 'Organization', name: 'Alexendros', url: 'https://alexendros.me' }
}
// schema.org/SoftwareApplication — landing de cada Kit
const kitSchema = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	'@id': 'https://stagekit.app/#app',
	name: 'StageKit',
	applicationCategory: 'BusinessApplication',
	operatingSystem: 'Web',
	offers: { '@type': 'Offer', price: '29', priceCurrency: 'EUR', priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M' } }
}
~~~

## GEO — Técnicas de citabilidad AI

| Técnica | Implementación | Prioridad |
|---------|---------------|---------|
| Entity clarity | `@id` con URL canónica en JSON-LD | ALTA |
| sameAs network | Mín. 3 perfiles verificados en sameAs | ALTA |
| Freshness signal | `dateModified` en artículos | ALTA |
| Named methodology | Nombrar "KitOS Framework" consistentemente | MEDIA |
| FAQ schema | `FAQPage` en landing pages | MEDIA |
| HowTo schema | En artículos técnicos de /blog | BAJA |

## Sitemap dinámico

~~~typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const kitProfiles = await prisma.kitProfile.findMany({
		where: { isPublic: true },
		select: { slug: true, updatedAt: true, kitId: true }
	})
	return [
		{ url: 'https://stagekit.app', changeFrequency: 'weekly', priority: 1 },
		...kitProfiles.map(p => ({
			url: `https://stagekit.app/${p.slug}`,
			lastModified: p.updatedAt,
			changeFrequency: 'monthly' as const,
			priority: 0.8
		}))
	]
}
~~~

## Checklist pre-deploy
- [ ] validator.schema.org sin errores en JSON-LD
- [ ] PageSpeed Insights: LCP < 2.0s desktop
- [ ] robots.txt: indexar marketing, bloquear /dashboard y /api
- [ ] Sitemap.xml: incluye todas las páginas públicas
- [ ] Canonical en todas las páginas
- [ ] hreflang si hay versión ES/EN
```

---

### 📄 agents/[gdpr-compliance.md](http://gdpr-compliance.md)

```markdown
---
name: gdpr-compliance
description: Agente de compliance RGPD/LOPDGDD para el monorepo Alexendros/KitOS. Actívame ante cualquier feature que procese datos personales, antes de activar analytics, antes de deploys con formularios y para verificar textos legales. Conocimiento de RGPD EU 2016/679, LOPDGDD LO 3/2018 y AEPD Guía Cookies 2023.
tools: [mcp__supabase, mcp__github, mcp__notion]
---

## Rol
Verificar compliance RGPD + LOPDGDD en cada feature que procese datos personales.
No soy un sustituto de asesoramiento jurídico, pero garantizo implementación técnica correcta.

## Bases legales aplicables (Art. 6 RGPD EU 2016/679)

| Base legal | Cuándo usar | Ejemplos en KitOS |
|-----------|-------------|------------------|
| 6.1.a Consentimiento | El usuario lo otorga libremente | Waitlist, newsletter, cookies analíticas |
| 6.1.b Contrato | Necesario para ejecutar contrato | Datos de facturación, account management |
| 6.1.c Obligación legal | Exige la ley | Facturas (conservar 5 años, art. 30 Ccom) |
| 6.1.f Interés legítimo | Interés legítimo del responsable | Logs de seguridad (anonimizados) |

## Checklist por tipo de feature

### Formulario de captación (waitlist, contact)
- [ ] Checkbox de consentimiento explícito (no pre-marcado)
- [ ] Link a Política de Privacidad en el checkbox
- [ ] Base legal documentada en comentario del código
- [ ] Campo `consent_given_at DateTime` en DB
- [ ] Mecanismo de baja disponible (unsubscribe link)

### Analytics (PostHog, Sentry)
- [ ] PostHog: NO inicializar hasta `consent === 'accepted'`
- [ ] Sentry: `beforeSend` hook que elimina email y userId de eventos
- [ ] PostHog: región EU configurada (`https://eu.posthog.com`)
- [ ] No transferencia de datos a USA sin SCCs (PostHog EU cumple)

### Stripe (datos de pago)
- [ ] DPA Stripe firmado (Stripe Dashboard → Settings → Legal)
- [ ] No almacenar datos de tarjeta (Stripe los gestiona)
- [ ] Facturas conservadas 5 años (art. 30 Código de Comercio)

### Textos legales obligatorios

~~~
Aviso Legal → Art. 10 LSSI-CE (Ley 34/2002, BOE 12/07/2002)
	Requerido: nombre, CIF/NIF, dirección, email, Registro Mercantil (si aplica)
Política de Privacidad → Art. 13 RGPD
	Requerido: identidad responsable, finalidad, base legal, destinatarios,
	plazo conservación, derechos ARCO, DPO si aplica
Política de Cookies → AEPD Guía Cookies 2023
	Requerido: listado cookies, duración, finalidad, terceros, opt-in/opt-out
Términos y Condiciones → Ley 34/2002 + Ley 7/1998 CGC
	Requerido: descripción servicio, precio, duración, rescisión, SLA, jurisdicción
~~~

## Derechos ARCO — endpoints obligatorios

~~~typescript
// Acceso: GET /api/account/export → devuelve JSON con todos los datos del usuario
// Supresión: DELETE /api/account/delete → anonimiza y elimina según retención
// Portabilidad: GET /api/account/export?format=json → formato legible por máquina
// Rectificación: PATCH /api/account/profile → actualización de datos
~~~

## Registro de actividades (Art. 30 RGPD)
Mantener actualizado en Notion: página "Registro de Actividades de Tratamiento"
- Responsable, finalidad, categorías de datos, destinatarios, plazo retención, medidas técnicas

## Reglas absolutas
- ❌ NUNCA activar PostHog sin consentimiento
- ❌ NUNCA logs con email en texto plano
- ✅ SIEMPRE base legal en comentario junto a INSERT de datos personales
- ✅ SIEMPRE cookie banner que bloquea JS de terceros hasta consentimiento
```

---

## SKILLS

---

### 📄 skills/[create-kit.md](http://create-kit.md)

```markdown
# Skill: create-kit
# Uso: cuando hay que añadir un Kit nuevo al monorepo
# Activar con: /skills create-kit

## Pasos numerados (ejecutar en orden)

1. **Scaffold app Next.js en monorepo**
~~~bash
cd apps/
pnpm create next-app@latest <kit-name> --typescript --tailwind --app --no-src-dir --import-alias "@/*"
~~~

2. **Crear CLAUDE.md específico del Kit**
~~~bash
cat > apps/<kit-name>/CLAUDE.md << 'EOF'
# CLAUDE.md — <KitName>
## Contexto del Kit
- Audiencia: [definir]
- Dominio: [definir]
- Theme token: [definir en packages/brand/tokens.ts]
- Planes: [Free/Pro/Agency o equivalentes]
## Reglas específicas
- Paleta de colores: usar SOLO tokens de packages/brand con prefijo <kit-name>-*
- Copywriting: tono [definir según audiencia]
- Compliance adicional: [regulaciones sectoriales si aplica]
EOF
~~~

3. **Registrar Kit en packages/db/prisma/schema.prisma**
~~~typescript
// Añadir seed entry para el nuevo Kit
// Archivo: packages/db/prisma/seed.ts
await prisma.kit.create({
	data: {
		id: '<kit-slug>',          // 'lexkit'
		name: '<KitName>',         // 'LexKit'
		domain: '<domain>',        // 'lexkit.pro'
		status: 'COMING_SOON',
		config: {}
	}
})
~~~

4. **Añadir tokens de color en packages/brand/tokens.ts**
~~~typescript
<kitSlug>: {
	accent: '',        // color principal del Kit
	secondary: '',
	surface: '',
	text: '',
}
~~~

5. **Crear planes en Stripe Dashboard**
- Crear Producto: "<KitName> Pro" + "<KitName> Agency" (u equivalentes)
- Copiar Price IDs
- Añadir a `.env.local`: `STRIPE_PRICE_<KITNAME>_PRO=price_xxx`
- Añadir a `lib/stripe/kit-plans.ts`

6. **Configurar proyecto Vercel**
~~~bash
vercel link --project <kit-name>-app
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel domains add <domain> --project <kit-name>-app
~~~

7. **Verificación final**
~~~bash
pnpm turbo build --filter=<kit-name>
# → Build exitoso sin errores TypeScript
# → Variables de entorno validadas por env.ts
# → Kit registrado en DB: pnpm --filter=@repo/db prisma studio
~~~
```

---

### 📄 skills/[new-db-migration.md](http://new-db-migration.md)

```markdown
# Skill: new-db-migration
# Uso: cualquier cambio en schema Prisma, agregar/modificar modelos, relaciones
# Activar con: /skills new-db-migration

## Proceso obligatorio (NO saltarse pasos)

1. **Leer estado actual**
~~~bash
cat packages/db/prisma/schema.prisma
~~~

2. **Documentar el cambio antes de ejecutar**
~~~
¿Qué tabla/modelo cambia? → 
¿Por qué? (justificación de negocio) → 
¿Afecta a datos existentes? → 
¿Requiere data migration? → 
~~~

3. **Editar schema.prisma**
- Añadir `// RGPD Art.6.1.X` si el campo almacena datos personales
- Añadir `@@index` para campos de búsqueda frecuente
- Añadir `@@map("snake_case")` en todo modelo nuevo

4. **Ejecutar migración**
~~~bash
pnpm --filter=@repo/db prisma migrate dev --name <descripcion-clara-en-ingles>
# Ejemplo: --name add-audit-log-table
# Ejemplo: --name add-affiliate-commission-rate
~~~

5. **Aplicar RLS en Supabase** (OBLIGATORIO en tablas nuevas)
~~~sql
-- Ejecutar en Supabase SQL Editor
ALTER TABLE public.<tabla> ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_own_data" ON public.<tabla>
	FOR ALL
	TO authenticated
	USING (auth.uid()::text = user_id)
	WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "service_role_bypass" ON public.<tabla>
	FOR ALL
	TO service_role
	USING (true)
	WITH CHECK (true);
~~~

6. **Generar tipos TypeScript**
~~~bash
pnpm --filter=@repo/db prisma generate
~~~

7. **Test de RLS**
~~~bash
# Verificar con Supabase anon key (SIN JWT) → debe devolver 0 filas
curl -H "apikey: $SUPABASE_ANON_KEY" \
	"$SUPABASE_URL/rest/v1/<tabla>?select=*" | jq 'length'
# Resultado esperado: 0
~~~

8. **Build global**
~~~bash
pnpm turbo build --filter=@repo/db
~~~
```

---

### 📄 skills/[add-stripe-plan.md](http://add-stripe-plan.md)

```markdown
# Skill: add-stripe-plan
# Uso: crear o modificar plan/precio en cualquier Kit
# Activar con: /skills add-stripe-plan

## Proceso

1. **Crear en Stripe Dashboard**
   - Products → Add product
   - Nombre: "<KitName> <PlanName>" (ej: "LexKit Pro")
   - Precio recurrente: mensual en EUR
   - Si tiene setup fee: precio adicional one-time
   - Copiar `price_xxx` ID del precio mensual
   - Copiar `price_yyy` ID del setup fee (si existe)

2. **Añadir env vars**
~~~bash
# .env.local
STRIPE_PRICE_<KITNAME>_<PLAN>=price_xxx
STRIPE_PRICE_<KITNAME>_<PLAN>_SETUP=price_yyy  # si aplica
# Vercel Dashboard → Environment Variables → Production
vercel env add STRIPE_PRICE_<KITNAME>_<PLAN> production
~~~

3. **Actualizar lib/stripe/kit-plans.ts**
~~~typescript
<kitSlug>: {
	<PLAN>: {
		id: '<kit>_<plan>',
		name: '<PlanName>',
		priceSetup: <número>,
		priceMonthly: <número>,
		stripePriceId: process.env.STRIPE_PRICE_<KIT>_<PLAN>!,
		stripeSetupPriceId: process.env.STRIPE_PRICE_<KIT>_<PLAN>_SETUP,
		features: [...],
		limits: {...},
		maintenanceSLA: '48h'
	}
}
~~~

4. **Añadir a env.ts (validación Zod)**
~~~typescript
STRIPE_PRICE_<KITNAME>_<PLAN>: z.string().min(1),
~~~

5. **Test en modo test**
~~~bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# En otra terminal:
curl -X POST http://localhost:3000/api/checkout \
	-H 'Content-Type: application/json' \
	-d '{"planId": "<kit>_<plan>", "kitId": "<kitSlug>"}'
# → Usar card 4242 4242 4242 4242
# → Verificar webhook checkout.session.completed recibido
# → Verificar subscription creada en DB
~~~

6. **Actualizar pricing page del Kit**
~~~bash
# Regenerar componente pricing con nuevo plan
# Verificar que priceMonthly y features coinciden con Stripe Dashboard
~~~
```

---

### 📄 skills/[deploy-vercel.md](http://deploy-vercel.md)

```markdown
# Skill: deploy-vercel
# Uso: configurar deploy, nuevo dominio o primer setup de app en Vercel
# Activar con: /skills deploy-vercel

## Setup inicial de app nueva

1. **Vincular proyecto**
~~~bash
cd apps/<app-name>
vercel link --project <app-name>
# Seleccionar: scope alexendros, proyecto existente o crear nuevo
~~~

2. **vercel.json (en raíz de la app)**
~~~json
{
	"buildCommand": "cd ../.. && pnpm turbo build --filter=<app-name>",
	"outputDirectory": ".next",
	"installCommand": "pnpm install",
	"framework": "nextjs",
	"regions": ["mad1"]
}
~~~

3. **Variables de entorno en Vercel**
~~~bash
# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Stripe
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
# Email
vercel env add RESEND_API_KEY production
# Monitoring
vercel env add NEXT_PUBLIC_SENTRY_DSN production
vercel env add NEXT_PUBLIC_POSTHOG_KEY production
~~~

4. **Dominio custom**
~~~bash
vercel domains add <dominio.com> --project <app-name>
# → Apuntar DNS: CNAME @ cname.vercel-dns.com
# → Verificar con: vercel domains inspect <dominio.com>
~~~

5. **turbo-ignore (evitar deploys innecesarios)**
~~~json
{
	"ignoreCommand": "npx turbo-ignore <app-name>"
}
~~~

6. **Webhook Stripe en producción**
~~~bash
stripe webhooks create \
	--url https://<dominio>/api/webhooks/stripe \
	--events checkout.session.completed,customer.subscription.updated,customer.subscription.deleted,invoice.payment_failed
# Copiar webhook secret → STRIPE_WEBHOOK_SECRET en Vercel
~~~

7. **Verificación post-deploy**
~~~bash
# CWV
npx @unlighthouse/cli https://<dominio> --reporter json
# JSON-LD
curl -s https://<dominio> | grep -A 30 'application/ld+json'
# Headers de seguridad
curl -I https://<dominio> | grep -E 'X-Frame|Content-Type|Referrer'
~~~
```

---

### 📄 skills/[gdpr-audit.md](http://gdpr-audit.md)

```markdown
# Skill: gdpr-audit
# Uso: antes de cualquier deploy a producción con features de datos personales
# Activar con: /skills gdpr-audit

## Checklist pre-deploy (ejecutar en orden)

### 1. Inventario de datos
- [ ] ¿Qué datos personales procesa esta feature? (nombre, email, IP, comportamiento...)
- [ ] ¿Hay base legal documentada en código? (`// RGPD Art.6.1.X — [finalidad]`)
- [ ] ¿Los datos se transmiten a terceros? ¿Cuáles? ¿DPA firmado?

### 2. Consentimiento (si base legal = 6.1.a)
- [ ] Checkbox no pre-marcado
- [ ] Texto claro (no legalés), enlace a Política de Privacidad
- [ ] `consent_given_at` almacenado en DB
- [ ] Mecanismo de revocación disponible

### 3. Analytics y tracking
- [ ] PostHog: NO se inicializa hasta `window.__consent === 'accepted'`
- [ ] Sentry `beforeSend`: elimina `user.email`, `user.id`, IPs de eventos
- [ ] Sin cookies de terceros cargándose antes de consentimiento
- [ ] Cookie banner bloquea scripts (no solo oculta visualmente)

### 4. Seguridad técnica (Art. 32 RGPD)
- [ ] RLS activo en tablas con datos personales
- [ ] HTTPS obligatorio (Vercel lo garantiza)
- [ ] Passwords: NUNCA en DB (Supabase Auth gestiona hashing)
- [ ] Tokens/secretos: NUNCA en logs
- [ ] Rate limiting en endpoints de autenticación

### 5. Derechos de los interesados
- [ ] Endpoint `/api/account/export` funcional (Derecho de acceso + portabilidad)
- [ ] Endpoint `/api/account/delete` funcional (Derecho de supresión)
- [ ] Email de respuesta a solicitudes ARCO: privacidad@alexendros.me

### 6. Textos legales
- [ ] Aviso Legal publicado en `/legal/aviso-legal` (Art. 10 LSSI-CE)
- [ ] Política de Privacidad en `/legal/privacidad` (Art. 13 RGPD)
- [ ] Política de Cookies en `/legal/cookies` (AEPD Guía 2023)
- [ ] Términos en `/legal/terminos` (con SLA, cancelación, reembolsos)

### 7. Registro de actividades (Art. 30 RGPD)
- [ ] Actualizar Notion → "Registro de Actividades" con la nueva feature

## Resultado: VERDE / ROJO
~~~
VERDE → todos los checks marcados → autorizado deploy a producción
ROJO → algún check sin marcar → NO desplegar hasta resolver
~~~

## Normativa de referencia
- RGPD: Reglamento EU 2016/679 (vigente 25/05/2018)
- LOPDGDD: LO 3/2018, BOE 06/12/2018
- LSSI-CE: Ley 34/2002, BOE 12/07/2002
- AEPD Guía Cookies 2023: aepd.es/guias/guia-cookies.pdf
- PCI DSS v4.0: pcisecuritystandards.org
```