# Registro de Actividades de Tratamiento (RoPA)

> RGPD Art. 30 · LOPDGDD LO 3/2018.
> Responsable del tratamiento: **Alejandro Domingo Agustí** (Alexendros).
> Contacto DPO: privacidad@alexendros.pro.
>
> Este documento es la fuente de verdad. Toda nueva operación con datos
> personales debe registrarse antes de pasar a producción.

## Cómo leer este registro

| Campo | Descripción |
|---|---|
| ID | Identificador estable del tratamiento. |
| Finalidad | Para qué se trata el dato. |
| Base legal | RGPD Art. 6.1.a/b/c/d/e/f. |
| Categorías de datos | Tipo de PII implicada. |
| Categorías de interesados | A quién pertenecen los datos. |
| Destinatarios | Encargados del tratamiento (Art. 28). |
| Transferencias | Países fuera del EEE, garantías. |
| Plazos | Conservación máxima. |
| Medidas técnicas | Cifrado, RLS, seudonimización. |

---

## T-001 · Autenticación de usuarios (Supabase self-hosted)

- **Finalidad**: identificación y autenticación del usuario para acceder al hub `alexendros.pro` y kits asociados (StageKit, LexKit, GestKit).
- **Base legal**: Art. 6.1.b (ejecución del contrato de servicio).
- **Categorías de datos**: email, hash de IP (SHA-256 con salt servidor), user-agent, identificadores de OAuth providers (Google, GitHub, Apple).
- **Categorías de interesados**: clientes del servicio, afiliados, prospectos registrados.
- **Destinatarios (encargados)**:
  - **Hostinger International, Ltd.** (alojamiento del VPS y, por tanto, de la base Postgres y servicios Supabase). DPA: pendiente firmar y archivar fuera de git. Categoría: encargado del tratamiento (Art. 28).
  - **Resend** (envío de correos transaccionales — magic link, verificación, password reset). DPA disponible en resend.com/legal.
  - **Apple Inc.** (Sign in with Apple): transferencia internacional EE. UU., amparada por Cláusulas Contractuales Tipo + Data Privacy Framework (decisión adecuación 2023/1795).
  - **Google LLC** (Google OAuth): transferencia internacional, idem.
  - **GitHub, Inc.** (GitHub OAuth): transferencia internacional, idem.
- **Transferencias internacionales**: ver "destinatarios" arriba (los OAuth providers). Postgres y GoTrue corren en VPS Hostinger EU (Frankfurt/Lituania) — sin transferencia.
- **Plazo de conservación**: mientras la cuenta esté activa + 6 años desde la baja (obligaciones contables / posibles reclamaciones contractuales).
- **Medidas técnicas y organizativas**:
  - Postgres TLS in-transit + cifrado de volúmenes Dokploy.
  - RLS habilitada en todas las tablas public.*.
  - `SUPABASE_SERVICE_ROLE_KEY` exclusivamente server-side (CP-03).
  - JWT rotation runbook 12 meses.
  - Backups cifrados con `restic` a Object Storage Hostinger.

## T-002 · Gestión de suscripciones y pagos

- **Finalidad**: cobrar las suscripciones a los kits y gestionar el ciclo de vida (alta, renovación, reintento, baja).
- **Base legal**: Art. 6.1.b (ejecución del contrato) + Art. 6.1.c (obligaciones fiscales).
- **Categorías de datos**: nombre, email, dirección de facturación, ID fiscal, importes, identificadores Stripe.
- **Categorías de interesados**: clientes con suscripción activa.
- **Destinatarios**:
  - **Stripe Payments Europe, Ltd.** (procesador de pagos): PCI DSS SAQ-A. Datos de tarjeta nunca pasan por nuestra infraestructura.
  - **Hostinger** (almacenamiento de los datos derivados de la suscripción en Postgres).
- **Transferencias internacionales**: Stripe (Irlanda + EE. UU.), cubierto por DPF + SCCs.
- **Plazo**: 6 años desde la última factura (LGT y Código de Comercio).
- **Medidas**: webhook firmado (`constructEvent`), idempotencia (`AuditLog.stripeEventId @unique`), 3DS2/SCA obligatorio.

## T-003 · Formularios de contacto entrantes (`InboundRequest`)

- **Finalidad**: permitir a un visitante anónimo contactar con un `KitProfile` publicado (booking, consulta).
- **Base legal**: Art. 6.1.a (consentimiento explícito al enviar) + Art. 6.1.f (interés legítimo del receptor para responder).
- **Categorías de datos**: nombre opcional, email, mensaje, hash de IP, user-agent.
- **Destinatarios**: Hostinger (almacenamiento).
- **Plazo**: 24 meses desde la creación, o hasta solicitud de supresión.
- **Medidas**: rate-limit Kong, hash IP, captcha en frontend.

## T-004 · Captación de leads y atribución (`Lead`)

- **Finalidad**: contactar prospectos y atribuir adquisición.
- **Base legal**: Art. 6.1.a (consentimiento doble opt-in registrado en `ConsentRecord`).
- **Categorías de datos**: email, nombre, UTMs, referrer, landing path.
- **Plazo**: 24 meses sin actividad → purga; si convierte a cuenta, pasa a T-001.

## T-005 · Registros de consentimiento (`ConsentRecord`)

- **Finalidad**: carga de la prueba del consentimiento conforme Art. 7 RGPD.
- **Base legal**: Art. 6.1.c (obligación legal — demostrabilidad).
- **Datos**: usuario o lead, propósito, base legal, versión y hash del texto, hash de IP, user-agent.
- **Plazo**: 6 años desde la revocación (mínimo para acreditar diligencia).
- **Append-only**: prohibido UPDATE/DELETE; revocación se modela como nueva fila.

## T-006 · Firma electrónica simple (`DigitalRegistration`)

- **Finalidad**: registrar la firma simple de contratos y DPAs (eIDAS Reg. 910/2014 nivel simple).
- **Base legal**: Art. 6.1.b.
- **Datos**: usuario, tipo y versión del documento, hash SHA-256 del PDF firmado, hash IP, user-agent.
- **Plazo**: 6 años desde la finalización del contrato.

## T-007 · Audit log operativo (`AuditLog`)

- **Finalidad**: trazabilidad de operaciones críticas (cambios de suscripción, webhooks Stripe, mutaciones admin).
- **Base legal**: Art. 6.1.f (interés legítimo de seguridad y fraude).
- **Datos**: usuario actor (si aplica), acción, entidad, metadatos, hash IP, evento Stripe.
- **Plazo**: 12 meses.

---

## Rotación de claves y otros eventos

| Fecha | Evento | Operador |
|---|---|---|
| 2026-05-28 | Apertura del registro tras adopción ADR-0003 (Supabase self-hosted) | Alejandro Domingo |
| | | |
