# ALEXENDROS × KitOS — Hub

> **Plataforma multi-producto de kits digitales temáticos** — marca personal enterprise (alexendros.me)
>
> Stack: Next.js 15 · Supabase · Stripe · Vercel · shadcn/ui
>
> Última actualización: 2026-04-05

## Concepto de plataforma: KitOS

**KitOS** es la plataforma de venta, afiliación y suscripción de Alexendros.

Cada **Kit** es un producto digital temático con presentación y contenidos propios pero arquitectura idéntica.

El cliente contrata: **producto + mantenimiento + incidencias + actualizaciones** — modelo SaaS con soporte incluido.

### Kits activos y en roadmap

| Kit | Ámbito | Dominio | Estado |
| --- | --- | --- | --- |
| **StageKit** | Artistas música electrónica (techno, tech-house) | stagekit.app | 🟢 MVP activo |
| **LexKit** | Abogados y sociedades profesionales | lexkit.pro | 🔵 Roadmap Q3 2026 |
| **GestKit** | Gestores, asesorías, consultoras | gestkit.pro | 🔵 Roadmap Q4 2026 |
| *(+ futuro)* | Cualquier nicho profesional | [nicho].kit | 🔲 Plantilla base |

### Modelo de ingresos KitOS

```
Kit = Producto digital (setup único, pago inicial)
    + Suscripción mensual (mantenimiento + updates + soporte de incidencias)
    + Afiliación (comisión 15% mensual por referido, 12 meses)
```

---

## Índice de documentos

### Documentación técnica principal

| # | Documento | Descripción | Para Claude Code |
| --- | --- | --- | --- |
| 00 | [CLAUDE.md](00-claude-md.md) | Instrucciones maestras de sesión, reglas, env vars, agentes y skills | ✅ Leer primero |
| 01 | [Stack & Arquitectura](01-stack-arquitectura.md) | Decisiones técnicas, rate limiting, monitoring, respuesta a incidentes | ✅ Contexto técnico |
| 02 | [Design System](02-design-system.md) | Tokens CSS oklch, shadcn config, temas por Kit | ✅ Antes de generar UI |
| 03 | [Schema DB](03-schema-db.md) | 11 modelos Prisma + RLS por tabla (@@map correctos) | ✅ Antes de tocar DB |
| 04 | [Pagos & Suscripciones](04-pagos-suscripciones.md) | Stripe plans, 5 webhooks, afiliados, trial 14d | ✅ Antes de tocar pagos |
| 05 | [Marketing / UVP / MVP](05-marketing-uvp-mvp.md) | Posicionamiento, funnel, pricing, servicios transversales | 📖 Contexto de negocio |
| 06 | [Fases de Implementación](06-fases-implementacion.md) | Roadmap 14 semanas alineado con plan maestro | ✅ Planificación de tareas |
| 07 | [Compliance Legal](07-compliance-legal.md) | RGPD/LOPDGDD, PCI DSS, PSD2, textos legales, backup, incidentes | ✅ Verificación legal |
| 08 | [Templates de Cliente](08-templates-cliente.md) | Kit profiles, dossier digital, tokenización, contratos Afiladocs, email templates | ✅ Generación de entregables |
| 09 | [CRM Clientes](09-crm-clientes.md) | Pipeline comercial, modelo de datos, canales, automatizaciones n8n | 📖 Gestión comercial |
| 10 | [Checklist Pre-Producción](10-checklist-pre-produccion.md) | Auditoría de 9 bloques (A-I) antes del deploy | ✅ Verificación pre-deploy |
| 11 | [Agents & Skills](11-agents-skills.md) | 5 agentes + 6 skills con flujos de subagentes paralelos | ✅ Referencia de agentes |

### Plan maestro y pre-fase

| Documento | Descripción |
| --- | --- |
| [Plan Maestro de Implementación](plan-maestro-implementacion.md) | 10 fases + FASE 7.5 (n8n), verificación, diagrama de ejecución |
| [PF-0 — Biografía y Posicionamiento](pf-0-biografia-posicionamiento.md) | Identidad de marca, biografía profesional |
| [PF-1 — Experiencia Profesional](pf-1-experiencia-profesional.md) | Trayectoria y credenciales |
| [PF-2 — Formación](pf-2-formacion.md) | Formación académica y certificaciones |
| [PF-3 — Repositorios y Proyectos](pf-3-repositorios-proyectos.md) | Portfolio técnico |
| [PF-4 — KitOS Producto](pf-4-kitos-producto.md) | Definición de producto KitOS |
| [PF — Plan Maestro de Marca](pf-plan-maestro-marca.md) | Estrategia de marca personal Alexendros |

---

## Estado del proyecto

- **Fase actual:** PRE-FASE (Abril 2026) — Brand Audit & Reposicionamiento
- **MVP target:** Semana 14 desde inicio de Fase 0
- **Deploy:** Vercel (producción, región mad1) · Supabase (eu-west-1)
- **Dominio principal:** alexendros.me
- **Producto MVP:** stagekit.app (pendiente registro)
- **Automatización:** n8n self-hosted (Hostinger VPS)

---

## Regla de oro para Claude Code

```
Antes de cualquier tarea → leer CLAUDE.md
Antes de generar UI → identificar Kit activo → aplicar theme del Kit
Antes de modificar DB → verificar RLS + tenant_id
Antes de tocar pagos → verificar compliance Stripe + plan del Kit
Al crear un Kit nuevo → copiar KitTemplate, NO tocar core
```
