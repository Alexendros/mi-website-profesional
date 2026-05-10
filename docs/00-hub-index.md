# Alexendros — Hub de documentación

> **Monorepo de aplicaciones verticales** — plataforma SaaS Alexendros × KitOS
>
> Stack: Next.js **16** · Node **24** · Supabase · Stripe · Vercel · shadcn/ui · Vergina Imperial v0.2.2
>
> Última actualización: 2026-05-10

> **Nota 2026-04-23**: el concepto paraguas anterior quedó retirado; contenido archivado en `.archive/kitos-pre-reformulacion-2026-04-23/`. Pendiente reformular el relato de producto.

## Aplicaciones del monorepo

| App | Ámbito | Dominio | Estado |
| --- | --- | --- | --- |
| **alexendros-pro** | Sitio de marca personal y hub | alexendros.pro | 🟡 En construcción |
| **StageKit** | Artistas música electrónica (techno, tech-house) | stagekit.app | 🟢 MVP activo |
| *(otras apps)* | Verticales futuros | TBD | 🔲 Por definir |

### Modelo de ingresos (pendiente reformular)

```
Producto digital (setup único, pago inicial)
  + Suscripción mensual (mantenimiento + updates + soporte)
  + Afiliación (comisión por referido)
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
| 12 | [Correo & Email](12-correo-email.md) | Configuración Proton Mail Bridge, Resend, templates transaccionales | ✅ Antes de tocar email |

### Plan maestro y pre-fase

| Documento | Descripción |
| --- | --- |
| [Plan Maestro de Implementación](plan-maestro-implementacion.md) | 10 fases + FASE 7.5 (n8n), verificación, diagrama de ejecución |
| [PF-0 — Biografía y Posicionamiento](pf-0-biografia-posicionamiento.md) | Identidad de marca, biografía profesional |
| [PF-1 — Experiencia Profesional](pf-1-experiencia-profesional.md) | Trayectoria y credenciales |
| [PF-2 — Formación](pf-2-formacion.md) | Formación académica y certificaciones |
| [PF-3 — Repositorios y Proyectos](pf-3-repositorios-proyectos.md) | Portfolio técnico |
| [PF — Plan Maestro de Marca](pf-plan-maestro-marca.md) | Estrategia de marca personal Alexendros |

*(PF-4 — definición de producto paraguas — archivado el 2026-04-23 en `.archive/kitos-pre-reformulacion-2026-04-23/`; pendiente reformular.)*

---

## Estado del proyecto

- **Fase actual:** Fase 4 (Mayo 2026) — Base de Datos · pendiente credenciales Supabase EU
- **MVP target:** Semana 14 desde inicio de Fase 0
- **Deploy:** Vercel (producción, región mad1) · Supabase (eu-west-1)
- **Dominio principal:** alexendros.pro
- **Hermana standalone:** alexendros.me (extraída 2026-04-11 a `~/Apps/alexendrosme/`)
- **Producto MVP:** stagekit.app (Fase 7, roadmap Q3 2026)
- **Automatización:** n8n self-hosted (Hostinger VPS)
- **Cuaderno activo:** `~/.claude/cuadernos/meta__alexendrospro_Monorepo-hub-y-kitos/`

---

## Regla de oro para Claude Code

```
Antes de cualquier tarea → leer CLAUDE.md
Antes de generar UI → identificar app activa → aplicar theme de la app
Antes de modificar DB → verificar RLS + tenant_id
Antes de tocar pagos → verificar compliance Stripe + plan de la app
Al crear una app nueva → copiar plantilla base, NO tocar core
```
