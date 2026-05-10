# Fase 7 — StageKit MVP

- Estado: PENDIENTE
- Prerrequisito: Fase 6 (Hub)
- Duracion estimada: 3 semanas
- Dominio: stagekit.app
- Theme token: dark-acid
- Target: artistas de musica electronica (techno, tech-house)

## Objetivo

MVP de StageKit: kit de presencia digital para DJs/productores con perfil publico, booking request, EPK digital y suscripcion mensual.

## Componentes

### Kit Profile (publico)
- [ ] `app/[slug]/page.tsx` — perfil publico del artista (SSG + ISR)
- [ ] Secciones: bio, mixes (SoundCloud embed), galeria, rider tecnico, contacto booking
- [ ] JSON-LD: `personJsonLd` + `musicGroupJsonLd` desde `@repo/seo`
- [ ] OG image dinamica con foto + nombre artista

### Booking Request
- [ ] `app/[slug]/booking/page.tsx` — formulario de solicitud
- [ ] Server Action: crear `BookingRequest` en DB + email al artista
- [ ] Rate limiting: 5 solicitudes/IP/hora
- [ ] Notificacion email al artista via Resend

### Dashboard de artista (tras auth)
- [ ] `/dashboard/kit/page.tsx` — editar perfil kit
- [ ] `/dashboard/bookings/page.tsx` — ver solicitudes recibidas
- [ ] `/dashboard/analytics/page.tsx` — views del perfil (PostHog + consent)

### Landing stagekit.app
- [ ] Hero con headline artistas
- [ ] Social proof: EPK sample, numero de artistas
- [ ] Pricing: Starter / Pro / Agency con toggle mensual/anual
- [ ] CTA: "Crear mi kit gratis" (trial 14 dias)

### Suscripcion
- [ ] Planes: `STRIPE_PRICE_STAGEKIT_STARTER_*`, `STRIPE_PRICE_STAGEKIT_PRO_*`, `STRIPE_PRICE_STAGEKIT_AGENCY_*`
- [ ] Trial 14 dias activo
- [ ] Limite de features por plan (un kit en Starter, ilimitados en Agency)
