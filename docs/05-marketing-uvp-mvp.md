# 05 — Marketing / UVP / MVP

## UVP por Kit

### 🎵 StageKit (activo)

**Headline primario:**

> **"Tu música ya suena como tier A. Ahora que tu carrera también lo haga."**
> 

**Headline B/test:**

> **"El EPK que cierra bookings en Berliner Techno Club. No el PDF que abren una vez."**
> 

**Subline:**

> StageKit convierte tu perfil de artista en una máquina de generación de bookings — sin agencia, sin 15% de comisión, sin esperar.
> 

**Propuesta de mantenimiento:**

> Tu carrera evoluciona. StageKit también: actualizaciones, soporte de incidencias y mejoras incluidas en tu suscripción.
> 

---

### ⚖️ LexKit (Roadmap Q3 2026)

**Headline primario:**

> **"Tu despacho merece una presencia digital que esté a la altura de tus honorarios."**
> 

**Headline B/test:**

> **"El cliente te busca en Google. Si no te encuentra, te sustituye."**
> 

**Subline:**

> LexKit crea la ficha profesional de tu despacho, optimizada para captar consultas en tu área de práctica — con agenda online, formulario de contacto cualificado y SEO local.
> 

**Propuesta de mantenimiento:**

> La normativa cambia. Tu web también: actualizaciones legales, nuevas áreas de práctica y soporte técnico continuo incluidos.
> 

**Nota de compliance deontológico:**

> LexKit cumple Estatuto General Abogacía (RD 135/2021, BOE 27/02/2021): sin promesas de resultado, sin comparativas con competidores, con identificación del despacho y Colegio de adscripción.
> 

---

### 📊 GestKit (Roadmap Q4 2026)

**Headline primario:**

> **"Tus clientes no necesitan un gestor más. Necesitan al gestor que siempre les responde."**
> 

**Headline B/test:**

> **"Cada día que no tienes presencia digital, tu competencia te roba un cliente."**
> 

**Subline:**

> GestKit construye tu ficha de asesoría con servicios, precios orientativos y formulario de contacto cualificado — para que el cliente llegue informado, no a preguntar lo básico.
> 

**Propuesta de mantenimiento:**

> Cambios fiscales, nuevas circulares de la AEAT, actualización de servicios: tu web se actualiza contigo.
> 

---

## Jobs-to-be-Done (JTBD) — Framework de priorización

| # | Job | Momento de activación | Dolor actual | Solución StageKit | Prioridad MVP |
| --- | --- | --- | --- | --- | --- |
| J1 | Crear EPK profesional en < 5 min | Oferta de booking inesperada | PDF de 2019 / Linktree | Editor guiado + plantillas pro | ✅ Bloquea lanzamiento |
| J2 | Gestionar fechas sin double booking | Agenda apretada | WhatsApp + notas | Calendario de bookings integrado | ✅ Bloquea lanzamiento |
| J3 | Cobrar anticipos y fees | Primera gira | Transferencia manual / riesgo impago | Stripe integrado en formulario booking | ⭐ Fase 2 |
| J4 | Visibilidad ante promotores internacionales | Querer escalar a Europa | No encuentran al artista | Perfil público indexado + RA/Spotify link | ⭐ Fase 2 |

---

## MVP — Scope mínimo lanzable

### Incluido en MVP (Semanas 1-6)

```
✅ Auth (Supabase) — email + Google OAuth
✅ Onboarding 3 pasos: perfil artista → géneros → primer EPK
✅ EPK builder (template único) con preview público y slug único
✅ Formulario de booking embebible (para que promotores contacten)
✅ Dashboard básico: EPK views + booking requests recibidos
✅ Suscripción Stripe: Free + Pro (trial 14 días sin tarjeta)
✅ Emails transaccionales: bienvenida, booking recibido, upgrade
```

### Excluido del MVP (Fases posteriores)

```
❌ Calendario de disponibilidad público
❌ Cobro de anticipos via Stripe
❌ Multi-artista (plan Agency)
❌ API pública
❌ White-label
❌ Integración Resident Advisor
❌ Tokenización de productos digitales (servicio bajo demanda)
❌ Contratos automatizados via Afiladocs (integración n8n)
```

---

## Servicios transversales KitOS (todos los Kits)

| Servicio | Tipo | Incluido en plan | Descripción |
|---------|------|-----------------|-------------|
| **Dossier de presencia digital** | Entregable | Pro/Agency | Manual profesional de ecosistema digital: plataformas, plantillas de publicación, almacenamiento, suite Proton.me |
| **Brand Manual profesional** | Entregable/servicio | Agency (incluido) / Pro (bajo demanda) | Manual de identidad de marca con logo, paleta, tipografía, aplicaciones — estándares ISO/PMS/WCAG |
| **Tokenización digital** | Bajo demanda | Facturado aparte | Registro en SafeCreative/blockchain de productos digitales con hash verificable y certificado |
| **Contratos Afiladocs** | Automatizado | Pro/Agency (contrato base incluido) | Contratos generados desde afiladocs.com con merge de datos del cliente y firma electrónica |

---

## Funnel de adquisición

```
Conciencia (TOFU)
  └→ Instagram Reels: "Tu EPK en 5 minutos"
  └→ TikTok: before/after EPK pdf vs StageKit
  └→ SEO: "cómo hacer un EPK para DJ" (long-tail ES)
  └→ Comunidades: foros RA, grupos FB techno ES, Discord Mambo

Consideración (MOFU)
  └→ Free trial sin tarjeta (14 días)
  └→ Template gallery pública (FOMO)
  └→ EPKs públicos de artistas = SEO + social proof

Conversión (BOFU)
  └→ "Tu trial termina en 3 días" → email + in-app banner
  └→ Caso de uso: "Nala Sinephro usó StageKit para su booking en Fabric"
  └→ Garantia: si no recibes un booking en 30 días → mes gratis

Retención
  └→ Weekly digest: views de tu EPK esta semana
  └→ Notificación nueva booking request
  └→ Tips: "Artistas con bio bilingüe reciben 3x más bookings"
```

---

## North Star Metrics por Kit

| Kit | North Star | Razón |
| --- | --- | --- |
| **StageKit** | Booking requests recibidos / semana | Si llegan bookings, el artista no se va |
| **LexKit** | Consultas cualificadas recibidas / mes | Si llegan clientes potenciales, el abogado renueva |
| **GestKit** | Leads con servicio identificado / mes | Si el lead llega informado, convierte mejor |

**MRR es consecuencia, no causa.** Optimizar la North Star de cada Kit es la estrategia de retención.

## Modelo de afiliación por nicho

```
StageKit: afiliados = managers, bookings agencies, promotores
LexKit:   afiliados = colegios de abogados, plataformas legaltech, asociaciones
GestKit:  afiliados = colegios de gestores, academias de oposiciones, softwares de gestión

Comisión estándar: 15% del primer año de suscripción del referido
Pago: mensual via Stripe Connect Express
Cookie de tracking: 90 días
```