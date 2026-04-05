# ALEXENDROS × KITOS — Hub

> **Plataforma multi-producto de kits digitales temáticos** — marca personal enterprise ([alexendros.me](http://alexendros.me))
> 

> Stack: Next.js 15 · Supabase · Stripe · Vercel · shadcn/ui
> 

> Última actualización: 2026-04-05
> 

## Concepto de plataforma: KitOS

**KitOS** es la plataforma de venta, afiliación y suscripción de Alexendros.

Cada **Kit** es un producto digital temático con presentación y contenidos propios pero arquitectura idéntica.

El cliente contrata: **producto + mantenimiento + incidencias + actualizaciones** — modelo SaaS con soporte incluido.

### Kits activos y en roadmap

| Kit | Ámbito | Dominio | Estado |
| --- | --- | --- | --- |
| **StageKit** | Artistas música electrónica (techno, tech-house) | [stagekit.app](http://stagekit.app) | 🟢 MVP activo |
| **LexKit** | Abogados y sociedades profesionales | [lexkit.pro](http://lexkit.pro) | 🔵 Roadmap Q3 2026 |
| **GestKit** | Gestores, asesorías, consultoras | [gestkit.pro](http://gestkit.pro) | 🔵 Roadmap Q4 2026 |
| *(+ futuro)* | Cualquier nicho profesional | [nicho].kit | 🔲 Plantilla base |

### Modelo de ingresos KitOS

```
Kit = Producto digital (setup único, pago inicial)
    + Suscripción mensual (mantenimiento + updates + soporte de incidencias)
    + Afiliación (comisión por referido entre profesionales del mismo ámbito)
```

---

## Índice de documentos

| # | Documento | Rol en el proyecto | Para Claude Code |
| --- | --- | --- | --- |
| 00 | [**CLAUDE.md**](http://CLAUDE.md) | Instrucciones maestras de sesión | ✅ Leer primero |
| 01 | **Stack & Arquitectura** | Decisiones técnicas y justificación | ✅ Contexto técnico |
| 02 | **Design System** | Tokens, shadcn config, UUPM | ✅ Antes de generar UI |
| 03 | **Schema DB** | Prisma + Supabase RLS | ✅ Antes de tocar DB |
| 04 | **Pagos & Suscripciones** | Stripe plans, webhooks, compliance | ✅ Antes de tocar pagos |
| 05 | **Marketing / UVP / MVP** | Posicionamiento, funnel, pricing | 📖 Contexto de negocio |
| 06 | **Fases de Implementación** | Roadmap técnico semana a semana | ✅ Planificación de tareas |
| 07 | **Compliance Legal** | GDPR · LOPDGDD · PCI DSS | ✅ Verificación legal |
| 08 | **Templates de Cliente** | EPK, website, booking — reproducibles | ✅ Generación de entregables |
| 09 | **CRM Clientes** | Pipeline comercial | 📖 Gestión comercial |

---

## Estado del proyecto

- **Fase actual:** Setup inicial · Semana 0
- **MVP target:** Semana 6
- **Deploy:** Vercel (producción) · Supabase (db + auth)
- **Dominio principal:** [alexendros.me](http://alexendros.me)
- **Producto:** [stagekit.app](http://stagekit.app) (pendiente registro)

---

## Regla de oro para Claude Code

```jsx
Antes de cualquier tarea → leer CLAUDE.md
Antes de generar UI → identificar Kit activo → aplicar theme del Kit
Antes de modificar DB → verificar RLS + tenant_id
Antes de tocar pagos → verificar compliance Stripe + plan del Kit
Al crear un Kit nuevo → copiar KitTemplate, NO tocar core
```

[00 — [CLAUDE.md](http://CLAUDE.md)](00%20%E2%80%94%20CLAUDE%20md%203397ded224cb8113ae50ccc3d6265c64.md)

[01 — Stack & Arquitectura](01%20%E2%80%94%20Stack%20&%20Arquitectura%203397ded224cb818e8155e8e7e38625e5.md)

[02 — Design System](02%20%E2%80%94%20Design%20System%203397ded224cb81d393a4e45142d06851.md)

[03 — Schema DB](03%20%E2%80%94%20Schema%20DB%203397ded224cb81faa699eb57d2765596.md)

[04 — Pagos & Suscripciones](04%20%E2%80%94%20Pagos%20&%20Suscripciones%203397ded224cb81839fe9d02c1c8257fb.md)

[05 — Marketing / UVP / MVP](05%20%E2%80%94%20Marketing%20UVP%20MVP%203397ded224cb813baeadf81627fa1007.md)

[06 — Fases de Implementación](06%20%E2%80%94%20Fases%20de%20Implementaci%C3%B3n%203397ded224cb8168af36e213506a9447.md)

[07 — Compliance Legal](07%20%E2%80%94%20Compliance%20Legal%203397ded224cb81aebd7dcca3d7476017.md)

[08 — Templates de Cliente](08%20%E2%80%94%20Templates%20de%20Cliente%203397ded224cb81049241e18fcf9e119b.md)

[09 — CRM Clientes](09%20%E2%80%94%20CRM%20Clientes%203397ded224cb818c9f53c2bfb9f81cbd.md)

[✅ CHECKLIST — Auditoría Pre-Producción](%E2%9C%85%20CHECKLIST%20%E2%80%94%20Auditor%C3%ADa%20Pre-Producci%C3%B3n%203397ded224cb81f79b08d5f2673bc9e5.md)

[PRE-FASE — Plan Maestro de Marca Personal Alexendros](PRE-FASE%20%E2%80%94%20Plan%20Maestro%20de%20Marca%20Personal%20Alexendr%203397ded224cb8189a9bae5bd222bb618.md)

[⚙️ .claude/ — Agents & Skills (archivos listos para copiar)](%E2%9A%99%EF%B8%8F%20claude%20%E2%80%94%20Agents%20&%20Skills%20(archivos%20listos%20para%20%203397ded224cb81578018eb4e1c555682.md)