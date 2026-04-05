# PF-4 — KitOS — Producto SaaS Lanzado

> **URL:** [https://alexendros.pro](https://alexendros.pro)
> 

> **Estado:** 🟢 LANZADO — Abril 2026
> 

> **Propósito de esta página:** Documentación pública de KitOS para la web de marca personal,
> 

> pitch decks, práctica de SEO/GEO y fuente de verdad para el agente `brand-auditor`.
> 

---

## 1. Qué es KitOS

**Una frase:**

> KitOS es una plataforma SaaS de kits digitales verticalizados: cada Kit es un producto
> 

> llave en mano para un sector específico, construido sobre infraestructura compartida.
> 

**Para quién:**

Profesionales y pymes de sectores con necesidades digitales específicas que los productos

genéricos no cubren bien: música electrónica, despachos de abogados, gestorías.

**Por qué existe:**

Los sectores verticales tienen flujos únicos (booking de artistas, expedientes jurídicos,

gestión de cuotas) que Notion o Trello no resuelven y un software a medida cuesta

10× más. KitOS ocupa ese espacio intermedio.

---

## 2. Kits en producción y roadmap

| Kit | Sector | Estado | URL | Acceso |
| --- | --- | --- | --- | --- |
| KitOS Hub | Plataforma | 🟢 Producción | [alexendros.pro](http://alexendros.pro) | Público |
| StageKit | Artistas música electrónica | 🟡 MVP activo | [stagekit.app](http://stagekit.app) (TBD) | Beta |
| LexKit | Despachos de abogados | 🔵 Roadmap Q3 2026 | [lexkit.pro](http://lexkit.pro) (TBD) | Waitlist |
| GestKit | Gestorías y asesorías | 🔵 Roadmap Q4 2026 | [gestkit.pro](http://gestkit.pro) (TBD) | Waitlist |

---

## 3. Modelo de negocio

```
Stream 1: Setup Fee (pago único al activar el Kit)
         → Cubre onboarding, configuración y personalización inicial

Stream 2: Suscripción mensual recurrente
         → Acceso continuo a la plataforma y actualizaciones

Stream 3: Comisiones de afiliados
         → 15% del primer año de ingresos por cliente referido
         → Gestionado con Stripe Connect Express
```

### Planes por Kit (StageKit — referencia)

| Plan | Setup | /mes | Límites principales |
| --- | --- | --- | --- |
| Free | 0 | 0 | Perfil básico, sin pagos |
| Pro | 0 | 29€ | 1 perfil completo, booking, pagos |
| Agency | 350€ | 199€ | Perfiles ilimitados, white-label |

---

## 4. Arquitectura técnica (resumen ejecutivo)

```
alexendros-monorepo/ (Turborepo)
├── apps/alexendros-pro/   ← Hub KitOS (alexendros.pro)
├── apps/stagekit/         ← Kit 1
├── apps/lexkit/           ← Kit 2 (Q3)
├── apps/gestkit/          ← Kit 3 (Q4)
└── packages/
    ├── brand/     Tokens visuales compartidos
    ├── ui/        Componentes React compartidos
    ├── db/        Prisma + Supabase (fuente única de datos)
    ├── stripe/    Lógica de pagos compartida
    └── email/     Templates React Email

Infra:
├── Vercel (5 proyectos, región mad1)
├── Supabase (DB + Auth + Edge Functions)
└── Hostinger VPS (n8n: CRM, emails, automatizaciones)
```

---

## 5. Decisiones de arquitectura documentadas (ADRs)

| Decisión | Elección | Alternativa descartada | Razón |
| --- | --- | --- | --- |
| Deploy frontend | Vercel (por Kit) | AWS Amplify, Netlify | ISR nativo, mad1, DX superior |
| DB + Auth | Supabase | PlanetScale + NextAuth | Unified: DB + Auth + Edge + Vector |
| ORM | Prisma 5 | Drizzle, Kysely | Madurez, tipos, migraciones |
| Pagos | Stripe | Paddle, LemonSqueezy | Connect para afiliados, PSD2 nativo |
| Automatización | n8n VPS | Zapier, Make | Coste, privacidad datos, control total |
| Monorepo | Turborepo | Nx | Simplicidad, Vercel-native |

---

## 6. Compliance integrado

| Normativa | Implementación |
| --- | --- |
| RGPD Art. 6.1.a (consentimiento) | Waitlist y newsletter: checkbox explícito, `consent_given_at` en DB |
| RGPD Art. 6.1.b (contrato) | Datos de facturación y cuenta |
| LOPDGDD LO 3/2018 | Textos legales en /legal, DPO no requerido (< 250 empleados) |
| PCI DSS v4.0 | Stripe gestiona datos de tarjeta, 0 almacenamiento propio |
| PSD2 / 3DS2 (2015/2366/UE) | Stripe Elements con SCA habilitado para UE |
| LSSI-CE Ley 34/2002 | Aviso legal con identificación completa del titular |

---

## 7. KPIs de lanzamiento (a 90 días)

| KPI | Target | Herramienta de medición |
| --- | --- | --- |
| MRR | > 500€ | Stripe Dashboard |
| Suscriptores activos | > 20 | Supabase |
| Churn mensual | < 5% | PostHog + Stripe |
| NPS (encuesta 30d) | > 40 | Typeform / n8n |
| Lighthouse Performance | > 90 | Vercel Speed Insights |
| LCP [alexendros.pro](http://alexendros.pro) | < 2.0s | PageSpeed Insights |
| Emails waitlist total | > 100 | Resend + Supabase |

---

## 8. Pitch de 30 segundos (para redes y eventos)

```
KitOS es una plataforma SaaS de kits digitales para sectores específicos.
El primer Kit — ya en producción en alexendros.pro — resuelve la gestión
digital de artistas de música electrónica: booking, pagos, portfolio.
Modelo: setup fee + suscripción mensual + afiliados.
Construido en solitario con Next.js 15, Supabase y Stripe.
Próximo: LexKit para despachos de abogados (Q3 2026).
```