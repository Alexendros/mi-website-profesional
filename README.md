<!-- canon-managed: true -->
# mi-website-profesional

> Sitio web profesional de Alexendros.

[![CI](https://github.com/Alexendros/mi-website-profesional/actions/workflows/ci.yml/badge.svg)](https://github.com/Alexendros/mi-website-profesional/actions/workflows/ci.yml)

## Qué es

Aplicación web construida sobre **Next.js 15 (App Router)** y desplegada en
**Vercel**. Sigue el sistema de diseño **Vergina Imperial v0.2.0**.

## Stack

- Next.js 15 (App Router · React Server Components)
- TypeScript estricto
- Tailwind CSS v4 (tokens OKLCH)
- Geist Sans / Geist Mono · iconografía Lucide
- Stripe (checkout productos digitales)
- Resend + React Email (transaccionales)
- Prisma 5 + Supabase (DB)
- pnpm 10 · Node.js 24
- Vitest (unit) · Playwright (E2E)
- Vercel (despliegue) · Hostinger (DNS)

## Instala

```bash
pnpm install
cp .env.example .env.local   # rellena las variables locales
pnpm dev
```

Visita http://localhost:3000.

## Configura

Variables de entorno requeridas en `.env.local`:

```
NEXT_PUBLIC_SITE_URL=https://alexendros.pro
# Añade aquí las variables específicas del proyecto.
```

## Comandos

| Comando | Propósito |
|---------|-----------|
| `pnpm dev` | Servidor de desarrollo. |
| `pnpm build` | Build de producción. |
| `pnpm start` | Servidor productivo local sobre el build. |
| `pnpm lint` | ESLint sin advertencias. |
| `pnpm typecheck` | TypeScript en modo estricto. |
| `pnpm test` | Vitest. |
| `pnpm test:e2e` | Playwright (cuando aplique). |

## Despliegue

- Producción: cada push a `main` dispara despliegue automático en Vercel.
- Previews: cada PR genera un entorno preview independiente.

## Estructura

```
apps/alexendros-pro/  · hub principal (Next.js App Router)
apps/kitos/stagekit/  · StageKit MVP
packages/brand/       · design tokens + logos
packages/ui/          · componentes shadcn/ui compartidos
packages/db/          · Prisma schema + Supabase client
packages/stripe/      · lógica de pagos compartida
packages/email/       · React Email templates
packages/config/      · tsconfig, eslint, env, ratelimit
docs/adr/             · decisiones de arquitectura (MADR 4.0.0)
.github/workflows/    · CI
```

## Documentación

- [`ARCHITECTURE.md`](ARCHITECTURE.md) · arquitectura y trade-offs.
- [`DESIGN.md`](DESIGN.md) · sistema de diseño y consumo de Vergina Imperial.
- [`STYLEGUIDE.md`](STYLEGUIDE.md) · convenciones de estilo y nombres.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) · cómo contribuir.
- [`SECURITY.md`](SECURITY.md) · política de seguridad.
- [`CHANGELOG.md`](CHANGELOG.md) · cambios destacables.

## Licencia

Ver [`LICENSE`](LICENSE) (o `COPYRIGHT.md` si el repositorio es privado).

## Contacto

contacto@alexendros.me
