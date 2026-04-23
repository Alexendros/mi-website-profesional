# 08 — Templates de Cliente

> Templates de entregables, emails transaccionales, contratos y servicios de valor añadido para clientes alexendros.pro.

## Estructura de un template Kit Profile (EPK)

Cada template es un objeto JSON almacenado en el campo `content` del modelo KitProfile (antes EPK).

```tsx
// types/epk.ts
export interface EPKContent {
  template: 'default' | 'minimal' | 'festival' | 'agency';
  sections: {
    hero: {
      photo: string;          // URL Supabase Storage
      stageName: string;
      tagline: string;        // max 120 chars
    };
    bio: {
      short: string;          // max 280 chars (para promotores)
      long: string;           // full bio
      lang: 'es' | 'en' | 'bilingual';
    };
    music: {
      soundcloudUrl?: string;
      spotifyUrl?: string;
      mixcloudUrl?: string;
      featuredTrackEmbed?: string;
    };
    live: {
      genres: string[];
      bpm: { min: number; max: number };
      setDuration: string;    // ej: '60-90 min'
      technicalRiderUrl?: string;
    };
    press: {
      photos: string[];       // URLs Supabase Storage, max 10
      logos: string[];        // artist logo variants
    };
    social: {
      instagram?: string;
      residentAdvisor?: string;
      facebook?: string;
      youtube?: string;
    };
    booking: {
      contactEmail: string;
      fee?: string;           // rango ej: '500-1500 EUR'
      territories: string[];  // ['ES', 'DE', 'NL', 'UK']
    };
  };
}
```

## Template: Propuesta comercial (para clíentes de Alexendros)

```markdown
# Propuesta de Desarrollo Web
## [Nombre del artista/proyecto]

**Preparado por:** Alejandro Domingo Agustí · alexendros.me
**Fecha:** [FECHA]
**Validez:** 30 días

---

### Scope del proyecto

| Entregable | Descripción | Incluido |
|-----------|-------------|----------|
| Diseño UI | Figma mockups + design tokens | ✅ |
| EPK Web | Implementación en StageKit | ✅ |
| Dominio custom | Configuración DNS + SSL | ✅ |
| Email de artista | [artista]@[dominio].com | ✅ |
| SEO inicial | Meta tags, JSON-LD, sitemap | ✅ |
| Analytics | PostHog dashboard privado | ✅ |

### Inversión

| Concepto | Importe |
|----------|---------|
| Setup + diseño | 350 € |
| Suscripción StageKit Pro | 29 €/mes |
| Mantenimiento mensual (opcional) | 99 €/mes |

### Condiciones
- 50% pago inicial para comenzar
- 50% restante en entrega
- Soporte incluido: 30 días post-entrega
```

---

## Dossier de Presencia y Desarrollo Profesional Digital

> Entregable incluido en todos los Kits de alexendros.pro. Documento profesional con diseño cuidado que guía al cliente en su ecosistema digital completo.

### Contenido del dossier

#### 1. Sitios web de contratación y perfil profesional
- **Ficha de plataformas recomendadas** según Kit/sector:
  - StageKit: Resident Advisor, Beatport DJ, SoundCloud, Bandcamp
  - LexKit: abogacia.es, vLex, LinkedIn profesional
  - GestKit: LinkedIn, directorios colegiales, Google Business Profile
- **Checklist de optimización** por plataforma: foto, bio, keywords, enlaces, verificación
- **Plantilla de bio profesional** en 3 longitudes (50, 150, 300 palabras) adaptada al sector

#### 2. Plantillas y flujos de publicaciones
- **Calendario editorial mensual** (plantilla): frecuencia, canales, tipos de contenido
- **Plantillas de publicación** por canal:
  - Instagram: feed (1080×1080), story (1080×1920), carrusel
  - LinkedIn: artículo, post corto, documento PDF
  - Twitter/X: hilo, post único
- **Flujo de creación → aprobación → publicación** (diagrama)
- **Bank de hashtags** sectoriales curados por Kit

#### 3. Esquema de almacenamiento de contenidos y documentación
- **Estructura de carpetas recomendada:**
  ```
  [nombre-profesional]/
  ├── 01-marca/           ← Logo, paleta, fuentes, brand manual
  ├── 02-contenido/
  │   ├── fotos/          ← Organizadas por fecha o evento
  │   ├── videos/
  │   ├── audio/          ← Mixes, tracks, podcasts
  │   └── textos/         ← Bios, press releases, artículos
  ├── 03-legal/           ← Contratos, facturas, licencias
  ├── 04-marketing/       ← Plantillas, calendario, analytics
  └── 05-admin/           ← Riders técnicos, facturas, certificados
  ```
- **Convención de nomenclatura:** `YYYY-MM-DD_tipo_descripcion.ext`
- **Política de backups:** Regla 3-2-1 (3 copias, 2 medios, 1 offsite)

#### 4. Suite de comunicación y privacidad — Proton.me

> **Recomendación oficial alexendros.pro:** [Proton.me](https://pr.tn/ref/Z83EMXB0V8V0) (enlace referido Alexendros)

| Servicio Proton | Uso profesional | Por qué |
|----------------|-----------------|---------|
| **Proton Mail** | Email profesional con dominio custom | Cifrado E2E, cumple RGPD (servidores Suiza), dominio propio incluido en plan Business |
| **Proton Drive** | Almacenamiento de marca y documentación | Cifrado zero-knowledge, compartir enlaces seguros con clientes |
| **Proton Calendar** | Gestión de citas y disponibilidad | Integrable con booking forms, sin tracking de Google |
| **Proton VPN** | Conexión segura en espacios públicos | Protección en coworkings, venues, aeropuertos |
| **Proton Pass** | Gestión de contraseñas y 2FA | Credenciales de plataformas, Stripe, Supabase, redes sociales |

**Planes recomendados:**
- **Profesional individual:** Proton Mail Plus (dominio custom + 15 GB) — desde 3,99 €/mes
- **Despacho/agencia:** Proton Business (multi-usuario + dominio + Drive 500 GB) — desde 6,99 €/usuario/mes

**Integración con alexendros.pro:**
- Email de contacto del Kit Profile → configurar con Proton Mail + dominio del cliente
- Almacenamiento de assets de marca → Proton Drive como backup cifrado
- Compartir documentos con promotores/clientes → enlaces seguros Proton Drive

#### 5. Herramientas complementarias recomendadas
- **Facturación:** Holded, Quaderno o Stripe Invoicing
- **Firma digital:** Autofirma (FNMT) para documentos oficiales en España
- **Agenda online:** Cal.com (open source) o Calendly integrado con booking form

### Formato de entrega
- PDF profesional con diseño de marca (portada, índice, secciones ilustradas)
- Versión interactiva en web (accesible desde dashboard del Kit)
- Plantillas descargables (.fig, .psd, .canva) incluidas como assets

---

## Servicio bajo demanda: Tokenización de productos digitales

> Registro público electrónico en blockchain de productos digitales acuñables con hash verificable. Servicio opcional facturable por unidad o paquete.

### Qué se tokeniza
- EPKs publicados (perfil artístico completo como activo digital verificable)
- Brand Manuals entregados a clientes
- Contratos ejecutados (hash del documento, no contenido)
- Plantillas originales de diseño
- Cualquier producto digital entregable de alexendros.pro

### Flujo de tokenización

```
1. Cliente solicita tokenización → Dashboard alexendros.pro o bajo demanda
2. Generar hash SHA-256 del archivo/producto digital
3. Registrar en plataforma de registro:
   → SafeCreative (registro de propiedad intelectual, certificado con sello temporal)
   → Opcionalmente: Ethereum/Polygon (NFT con metadata IPFS) para prueba en blockchain
4. Emitir certificado de registro con:
   - Hash del archivo
   - Timestamp del registro
   - URL de verificación pública
   - Identificador único del registro
5. Almacenar certificado en perfil del cliente (Dashboard)
6. Notificación por email con certificado adjunto (PDF)
```

### Plataformas de registro (por orden de prioridad)

| Plataforma | Tipo | Ventaja | Coste aprox. |
|-----------|------|---------|-------------|
| **SafeCreative** | Registro PI | Certificado con validez probatoria en España/UE, API REST disponible | Desde 0 € (básico) a 36 €/año (pro) |
| **Blockchain (Polygon)** | Registro descentralizado | Inmutable, verificable globalmente, bajo coste gas | ~0,01 € por tx |
| **IPFS + Filecoin** | Almacenamiento descentralizado | Persistencia del asset, hash verificable | Variable |
| **Registro de la Propiedad Intelectual (OEPM)** | Registro oficial España | Máxima validez jurídica, presunción de autoría | Desde 13,52 € (tasa) |

### Automatización con n8n

```
Trigger: webhook alexendros.pro "tokenization_requested"
  → Paso 1: Descargar asset y calcular SHA-256
  → Paso 2: POST a API SafeCreative (registro)
  → Paso 3: Recibir certificado + ID de registro
  → Paso 4: Guardar en Supabase (tabla: digital_registrations)
  → Paso 5: Generar PDF certificado con React Email
  → Paso 6: Enviar email al cliente via Resend
  → Paso 7: Actualizar dashboard del cliente
```

### Modelo de datos (extensión schema Prisma)

```prisma
model DigitalRegistration {
  id              String   @id @default(cuid())
  userId          String
  kitId           String
  assetType       String   // 'epk' | 'brand_manual' | 'contract' | 'template'
  assetHash       String   // SHA-256
  registryPlatform String  // 'safecreative' | 'polygon' | 'oepm'
  registryId      String   // ID del registro externo
  registryUrl     String?  // URL de verificación pública
  certificateUrl  String?  // URL del PDF certificado en Supabase Storage
  status          String   @default("pending") // pending | registered | failed
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
  kit  Kit  @relation(fields: [kitId], references: [id])

  @@map("digital_registrations")
  @@index([userId])
  @@index([assetHash])
}
```

### Pricing (servicio bajo demanda)

| Modalidad | Precio | Incluye |
|----------|--------|---------|
| Registro unitario (SafeCreative) | 9 € | 1 registro + certificado PDF |
| Pack 5 registros | 35 € | 5 registros + certificados |
| Pack 20 registros | 99 € | 20 registros + certificados + verificación blockchain Polygon |
| Registro OEPM (asistido) | 49 € + tasa oficial | Gestión completa del registro oficial |

---

## Plantillas de contratos — Afiladocs

> Contratos generados automáticamente desde [afiladocs.com](https://afiladocs.com), la plataforma legaltech de Alexendros. Integración nativa con alexendros.pro para servicios que requieren formalización contractual.

### Contratos disponibles por Kit

#### StageKit (artistas música electrónica)
| Contrato | Partes | Cuándo se genera |
|---------|--------|-----------------|
| **Contrato de servicios StageKit** | Alexendros ↔ Artista | Al contratar plan Pro/Agency |
| **Contrato de booking** | Artista ↔ Promotor | Al aceptar booking request (opcional) |
| **Contrato de management/representación** | Artista ↔ Manager | Plan Agency, bajo demanda |
| **Cesión de derechos de imagen** | Artista ↔ Promotor/Festival | Adjunto a booking confirmado |
| **NDA (Acuerdo de confidencialidad)** | Ambas partes | Bajo demanda |

#### LexKit (despachos)
| Contrato | Partes | Cuándo se genera |
|---------|--------|-----------------|
| **Contrato de servicios LexKit** | Alexendros ↔ Despacho | Al contratar plan |
| **Hoja de encargo profesional** | Abogado ↔ Cliente | Al aceptar consulta cualificada |
| **Contrato de colaboración entre letrados** | Despacho ↔ Despacho | Bajo demanda |

#### GestKit (gestorías)
| Contrato | Partes | Cuándo se genera |
|---------|--------|-----------------|
| **Contrato de servicios GestKit** | Alexendros ↔ Gestoría | Al contratar plan |
| **Carta de encargo de asesoría** | Gestor ↔ Cliente | Al aceptar lead cualificado |
| **Contrato de subcontratación** | Gestoría ↔ Colaborador | Bajo demanda |

#### Transversales (todos los Kits)
| Contrato | Uso |
|---------|-----|
| **Contrato de afiliación alexendros.pro** | Al registrarse como afiliado |
| **DPA (Data Processing Agreement)** | Cumplimiento RGPD Art. 28 con procesadores |
| **Términos y Condiciones de uso** | Aceptación al registrarse en la plataforma |

### Integración técnica con Afiladocs

```
Flujo de generación:
1. Evento en alexendros.pro (checkout, booking aceptado, alta afiliado...)
2. Webhook a n8n → llamada a API Afiladocs
3. Afiladocs genera contrato con datos del cliente (merge fields)
4. PDF firmable devuelto → almacenar en Supabase Storage
5. Notificación al cliente con enlace de firma
6. Firma electrónica → contrato ejecutado
7. Hash del contrato → opción de tokenización (ver sección anterior)
```

### Campos de merge (variables inyectadas desde alexendros.pro)

```json
{
  "client_name": "Nombre completo del cliente",
  "client_nif": "NIF/CIF del cliente",
  "client_email": "Email de contacto",
  "client_address": "Dirección fiscal",
  "kit_name": "StageKit | LexKit | GestKit",
  "plan_name": "Free | Pro | Agency",
  "plan_price_monthly": "29",
  "plan_price_setup": "0 | 350",
  "contract_date": "2026-04-05",
  "contract_duration": "12 meses (renovable)",
  "service_scope": "Descripción del servicio contratado",
  "sla_response_time": "48h",
  "jurisdiction": "Juzgados y Tribunales de Valencia"
}
```

### Compliance contractual
- **Ley aplicable:** Derecho español (Código Civil + Ley 34/2002 LSSI-CE)
- **Firma electrónica:** Válida conforme al Reglamento eIDAS (UE 910/2014) y Ley 6/2020 de servicios electrónicos de confianza
- **Protección de datos:** Cláusula RGPD integrada en todos los contratos
- **Jurisdicción:** Juzgados y Tribunales de Valencia (salvo pacto expreso)
- **Idioma:** Castellano como idioma vinculante; versiones en inglés disponibles como cortesía

### Pricing contratos Afiladocs

| Modalidad | Precio | Incluye |
|----------|--------|---------|
| Incluido en plan Pro/Agency | 0 € adicional | Contrato de servicios del Kit + T&C |
| Contrato bajo demanda (booking, NDA...) | 19 € / contrato | Generación + merge + PDF firmable |
| Pack 10 contratos | 149 € | 10 contratos bajo demanda |
| Contrato custom (redacción nueva) | Desde 99 € | Redacción jurídica + plantilla reutilizable |

---

## Email Templates (React Email + Resend)

> Todos los emails usan `packages/email/` con React Email. Diseño dark-first consistente con la marca.

### Templates obligatorios (MVP)

| # | Template | Trigger | Asunto | Variables |
|---|---------|---------|--------|-----------|
| E-01 | **Welcome** | W-01 (checkout.session.completed) | "Bienvenido a {kitName} — tu cuenta está lista" | `userName`, `kitName`, `planName`, `dashboardUrl` |
| E-02 | **Booking received** | W-05 (booking_request_created) | "Nueva solicitud de {requesterName}" | `userName`, `requesterName`, `requesterEmail`, `subject`, `dashboardUrl` |
| E-03 | **Trial ending** | W-08 (cron día 10) | "Tu trial de {kitName} termina en 4 días" | `userName`, `kitName`, `daysLeft`, `features_losing`, `checkoutUrl` |
| E-04 | **Payment failed** | W-11 (invoice.payment_failed) | "No hemos podido procesar tu pago" | `userName`, `planName`, `amount`, `failureReason`, `billingPortalUrl` |
| E-05 | **Upgrade confirmed** | W-10 (subscription.updated, plan upgrade) | "¡Enhorabuena! Ya eres {planName}" | `userName`, `planName`, `newFeatures[]`, `dashboardUrl` |
| E-06 | **Invoice / receipt** | W-27 (invoice.paid) | "Factura {invoiceNumber} — {amount} €" | `userName`, `invoiceNumber`, `amount`, `periodStart`, `periodEnd`, `invoicePdfUrl` |

### Templates post-MVP

| # | Template | Trigger | Asunto |
|---|---------|---------|--------|
| E-07 | **Weekly digest** | W-04 (cron semanal) | "Tu semana en {kitName}: {views} visitas, {bookings} solicitudes" |
| E-08 | **Cancellation survey** | W-18 (cancel_at_period_end) | "Lamentamos que te vayas — ¿nos cuentas por qué?" |
| E-09 | **Win-back** | W-21 (cron 30d post-baja) | "¿Qué tal todo? Tenemos novedades para ti" |
| E-10 | **Tokenization certificate** | W-26 (tokenization_completed) | "Certificado de registro digital — {assetType}" |
| E-11 | **Contract ready** | W-25 (contract_generated) | "Tu contrato está listo para firmar" |
| E-12 | **Data export** | ARCO request | "Tus datos están listos para descargar" |

### Estructura de cada template

```tsx
// packages/email/templates/welcome.tsx
import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  kitName: string;
  planName: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ userName, kitName, planName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#0a0a0f', color: '#f0f0f5', fontFamily: 'Geist, sans-serif' }}>
        <Container>
          <Section>
            <Text>Hola {userName},</Text>
            <Text>Tu cuenta en {kitName} ({planName}) está lista.</Text>
            <Button href={dashboardUrl}>Ir al dashboard</Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

### Reglas de email
- ❌ NUNCA enviar email sin opción de baja (CAN-SPAM / RGPD)
- ❌ NUNCA incluir datos sensibles en el cuerpo del email (enlazar al dashboard)
- ✅ SIEMPRE preview text (primer línea visible en inbox)
- ✅ SIEMPRE link a la política de privacidad en el footer
- ✅ SIEMPRE diseño responsive (mobile-first)