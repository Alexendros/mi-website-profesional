<!-- MCEOD:BEGIN v2.0.0 -->
- Versión MCEOD: 2.0.0
- Nivel: L2
- Scope: `/home/alexendros/Repositorios/alexendrospro`
- Fecha consolidación: 2026-05-28T04:48:11Z
- Hereda de: `~/.claude/CLAUDE.md` (L0) y, si existe, del CLAUDE.md de la categoría padre (L1).
- Owners: Alexendros <spiderwebtraveler@gmail.com>

> Cabecera gestionada por MCEOD (entre los marcadores BEGIN/END). El cuerpo del documento, fuera de este bloque, fue generado por `/init` de Claude Code y no se modifica.
<!-- MCEOD:END -->
# CLAUDE.md — alexendrospro

> Extensión de `~/.claude/CLAUDE.md` (canon)
> Aplica SOLO a este repositorio.

## Contexto del proyecto
Monorepo Alexendros/KitOS — hub SaaS multi-kit. Plataforma de kits digitales (StageKit, LexKit, GestKit) con suscripciones Stripe, afiliados, Supabase + Prisma, y despliegue multi-dominio en Vercel.

## Stack y tecnologías
- Turborepo + pnpm workspace
- Next.js 15 App Router · TypeScript strict
- Supabase (PostgreSQL) + Prisma ORM
- Stripe (subscriptions, PaymentIntents, Connect Express para afiliados)
- Tailwind CSS v4 + shadcn/ui
- tRPC para API typesafe
- Vercel multi-proyecto (region mad1)

## Convenciones específicas
- Monorepo: apps/ (kits), packages/ (db, ui, brand, auth, stripe)
- TypeScript strict, prohibido any
- Server Components por defecto
- Prisma schema: @@map("snake_case_plural"), @id @default(cuid()), timestamps obligatorios
- Toda tabla con datos personales: RLS activo + comentario RGPD Art.6.1.X
- IDs de Stripe SOLO en env vars, nunca hardcodeados
- Commits: feature branch + PR
- Multi-Kit: toda tabla tiene kitId si los datos son Kit-específicos

## Agents disponibles (locales)
- seo-geo-specialist: SEO técnico + GEO para motores AI
- stripe-engineer: pagos, webhooks, Stripe Connect

## Skills disponibles (locales)
- add-stripe-plan: crear/modificar planes de suscripción
- create-kit: añadir nuevo Kit al monorepo

## MCPs requeridos
- mcp__stripe (gestión de pagos)
- mcp__supabase (base de datos)
- mcp__github (PRs, issues)
- mcp__notion (documentación, registro de actividades)

## Notas
- Fuente de verdad de planes: lib/stripe/kit-plans.ts
- Webhook Stripe obligatorio: checkout.session.completed, customer.subscription.updated/deleted, invoice.payment_failed, transfer.created
- Comisión afiliado: 15% primer año
