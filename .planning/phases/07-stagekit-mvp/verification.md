# Fase 7 — Criterios de verificacion

## Kit Profile
- [ ] URL `stagekit.app/@slug` carga perfil publico
- [ ] OG image generada dinamicamente con foto del artista
- [ ] JSON-LD `MusicGroup` o `Person` valido (Google Rich Results Test)
- [ ] Lighthouse Performance >= 90 en perfil publico

## Booking
- [ ] Formulario de booking envia y crea `BookingRequest` en DB
- [ ] Email notificacion llega al artista en < 30s
- [ ] 6a solicitud desde misma IP en < 1h → 429

## Suscripcion
- [ ] Trial 14 dias se activa correctamente
- [ ] Plan Starter: limite a 1 kit activo
- [ ] Upgrade de plan funciona via Stripe Billing Portal

## Seguridad
- [ ] RLS: artista solo ve sus propios bookings y analytics
- [ ] Booking form: CSRF protegido (Server Action nativo Next.js 16)
- [ ] Rate limiting booking: 5 req/IP/hora

## Performance (Lighthouse en perfil publico)
- [ ] LCP < 2.5s mobile
- [ ] CLS < 0.1
