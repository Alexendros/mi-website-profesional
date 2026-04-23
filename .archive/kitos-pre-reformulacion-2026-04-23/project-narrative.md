# Project narrative · ALEXENDROS × KitOS

> Extraído de `CLAUDE.md` raíz y `.planning/PROJECT.md` el 2026-04-23 durante la retirada de la marca paraguas KitOS.

---

## Project

**ALEXENDROS × KitOS**

Plataforma SaaS multi-producto de kits digitales temáticos para profesionales, construida como Turborepo monorepo. Cada Kit es un producto verticalizado (artistas electrónicos, abogados, gestores) con presentación propia pero arquitectura compartida. El cliente contrata producto + mantenimiento + incidencias + actualizaciones bajo modelo de suscripción. Desarrollado por Alejandro Domingo Agustí (Alexendros) como marca personal enterprise.

**Core Value:** Los profesionales reciben una presencia digital profesional inmediata (Kit Profile publicado en < 5 minutos) que genera oportunidades de negocio medibles (bookings, consultas, leads) — sin necesidad de conocimientos técnicos, con soporte y cumplimiento legal incluidos.

## Constraints

- **Stack**: Next.js 15 + Supabase + Stripe + Vercel — ya decidido, no negociable
- **Legal**: RGPD/LOPDGDD compliance obligatorio antes de deploy público (Art. 6, 13, 30)
- **Pagos**: PCI DSS SAQ-A + PSD2/SCA — Stripe gestiona 100% tarjetas
- **Performance**: LCP < 2.0s desktop, < 2.5s mobile, Lighthouse > 90
- **Seguridad**: RLS en TODAS las tablas, TypeScript strict, 0 `any`, rate limiting en APIs
- **Presupuesto**: Solo developer (1 persona), minimizar costes de infraestructura (free tiers)
- **Timeline**: ~14 semanas desde FASE 0 hasta deploy producción
- **Región**: Vercel mad1, Supabase eu-west-1 (Frankfurt), PostHog EU — datos en Europa
