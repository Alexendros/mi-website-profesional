# 07 — Compliance Legal

## RGPD / LOPDGDD

```yaml
marco_normativo:
  - Reglamento (UE) 2016/679 (RGPD) — vigente 25/05/2018
  - LO 3/2018 LOPDGDD — BOE 06/12/2018 (transpone RGPD a ES)
  - Guía de Cookies AEPD 2023

obligaciones_implementadas:
  base_legal: Art. 6.1.b RGPD (contrato) + 6.1.a (consentimiento para marketing)
  transparencia: Aviso legal + Política privacidad en /legal
  cookies:
    - Banner consentimiento granular (analíticas, marketing)
    - PostHog DESACTIVADO hasta consentimiento
    - Stripe y Supabase: cookies necesarias (exentas)
  derechos_arco:
    - /api/account/delete → cascade DELETE todas las tablas
    - /api/account/export → dump JSON datos del usuario
  dpa_terceros:
    - Stripe: SCC firmadas (Art. 46 RGPD, transferencia EEUU)
    - Supabase: DPA disponible (región EU West)
    - Sentry: datos anonimizados antes de enviar
    - Vercel: GDPR compliant, región EU disponible
    - PostHog: región EU (eu.posthog.com), sin transferencia a EEUU
    - Resend: DPA disponible, procesamiento email transaccional

retención_datos:
  usuarios_inactivos: 3 años desde último login (Art. 5.1.e RGPD)
  datos_fiscales: 5 años (Art. 30 LGT ES + Art. 30 Código de Comercio)
  logs_acceso: 1 año máx (LSSI Art. 12)
  datos_post_baja: 90 días antes de anonimización (ver workflow W-17)
  audit_logs: 5 años (trazabilidad fiscal y legal)
```

## PCI DSS v4.0

```yaml
nivel: SAQ-A (redirigimos a Stripe Hosted Payment)
obligaciones:
  - TLS 1.2+ en todas las rutas (Vercel gestiona)
  - No almacenar datos de tarjeta (Stripe tokeniza)
  - Acceso Stripe Dashboard: MFA obligatorio
  - Webhook verificación: HMAC-SHA256 (implementado en doc/04)
  - Revisión anual de accesos a Stripe
```

## PSD2 / SCA

```yaml
directiva: 2015/2366/UE (PSD2), transpuesta ES via RD-ley 19/2018
requerimiento: 3DS2 para pagos > 30€ en UE
implementacion: Stripe gestiona automáticamente con PaymentIntent
```

---

## Textos legales obligatorios

### Aviso Legal (`/legal/aviso-legal`) — Art. 10 LSSI-CE (Ley 34/2002)

```
Contenido obligatorio:
- Nombre completo del titular: Alejandro Domingo Agustí
- NIF: [completar]
- Domicilio: [completar]
- Email de contacto: contacto@alexendros.me
- Registro Mercantil: N/A (persona física, actividad profesional)
- Actividad: Desarrollo de software y servicios digitales
- Colegio profesional: N/A
```

### Política de Privacidad (`/legal/privacidad`) — Art. 13 RGPD

```
Secciones obligatorias:
1. Identidad del responsable (nombre, NIF, dirección, email)
2. Delegado de Protección de Datos: N/A (< 250 empleados, tratamiento no masivo)
3. Finalidades del tratamiento:
   - Gestión de cuenta y prestación del servicio (Art. 6.1.b)
   - Envío de comunicaciones comerciales (Art. 6.1.a — consentimiento)
   - Facturación y cumplimiento fiscal (Art. 6.1.c)
   - Seguridad y prevención de fraude (Art. 6.1.f — interés legítimo)
4. Destinatarios: Stripe (pagos), Supabase (DB), Resend (email), Vercel (hosting)
5. Transferencias internacionales: SCCs con proveedores EEUU (Stripe, Vercel)
6. Plazo de conservación (ver tabla retención_datos)
7. Derechos: acceso, rectificación, supresión, portabilidad, oposición, limitación
8. Reclamación ante AEPD (aepd.es)
```

### Política de Cookies (`/legal/cookies`) — Guía AEPD 2023

**Inventario de cookies:**

| Cookie | Proveedor | Tipo | Duración | Finalidad | Requiere consentimiento |
|--------|-----------|------|----------|-----------|------------------------|
| `sb-*` | Supabase | Necesaria | Sesión | Autenticación SSR | ❌ Exenta |
| `__stripe_*` | Stripe | Necesaria | Sesión | Prevención fraude | ❌ Exenta |
| `ph_*` | PostHog | Analítica | 1 año | Métricas de uso | ✅ Sí |
| `cookie-consent` | Propia | Necesaria | 1 año | Preferencias cookies | ❌ Exenta |

**Implementación del banner:**
- Bloqueo real de scripts hasta consentimiento (no solo visual)
- Opciones granulares: necesarias (siempre activas), analíticas, marketing
- Botón "Rechazar todas" igual de visible que "Aceptar"
- Enlace a política de cookies completa

### Términos y Condiciones (`/legal/terminos`) — Ley 34/2002 + Ley 7/1998 CGC

```
Secciones obligatorias:
1. Descripción del servicio: plataforma Alexendros (servicios digitales por suscripción)
2. Planes y precios: Free / Pro / Agency (referencia a pricing page)
3. Trial: 14 días sin tarjeta, auto-conversión a Free
4. Facturación: mensual, mediante Stripe
5. SLA: 99.5% uptime mensual (excluyendo mantenimiento programado)
   - Respuesta soporte: < 48h hábiles
   - Compensación por incumplimiento: crédito proporcional al downtime
6. Cancelación: en cualquier momento desde dashboard. Efectiva al final del periodo pagado.
7. Reembolsos: no aplica por periodos ya consumidos. Setup fee no reembolsable.
8. Suspensión por impago: tras 14 días de mora, downgrade a Free (ver workflows W-11..W-17)
9. Eliminación de datos: 90 días tras suspensión definitiva (con aviso previo)
10. Propiedad intelectual: contenido del usuario es suyo. Plataforma y código son de Alexendros.
11. Ley aplicable: Derecho español
12. Jurisdicción: Juzgados y Tribunales de Valencia
13. Modificaciones: aviso por email 30 días antes de cambios sustanciales
```

---

## Estrategia de backup y recuperación

```yaml
backup_db:
  proveedor: Supabase (automático)
  frecuencia: diaria
  retención: 30 días (plan Pro Supabase)
  tipo: Point-in-time recovery (PITR)
  restore: desde Dashboard Supabase → Backups → Restore

backup_storage:
  proveedor: Supabase Storage
  frecuencia: replicación automática
  política: archivos de usuario (fotos, riders, logos) se mantienen mientras la cuenta esté activa

backup_código:
  proveedor: GitHub
  política: repo privado, branch protection en main, PRs obligatorios

procedimiento_de_restore:
  1. Identificar punto de fallo (hora exacta)
  2. Restaurar DB desde PITR en Supabase Dashboard
  3. Verificar integridad: prisma studio + queries de test
  4. Notificar usuarios afectados si hay pérdida de datos
  5. Registrar incidente en AuditLog + Notion
```

---

## Procedimiento de incidentes

```
1. DETECTAR — Alerta Better Uptime / Sentry / usuario
2. EVALUAR — Impacto: ¿cuántos usuarios? ¿datos comprometidos?
3. CONTENER — Si breach de datos: revocar tokens, bloquear acceso
4. NOTIFICAR — Si breach RGPD: AEPD en < 72h (Art. 33), usuarios afectados (Art. 34)
5. RESOLVER — Fix + deploy + verificar
6. POSTMORTEM — Documentar en Notion: causa raíz, timeline, acciones preventivas
```

---

> ⚠️ **IMPORTANTE:** Todos los textos legales deben ser revisados por abogado antes del lanzamiento público. Este documento es una referencia técnica de implementación, no constituye asesoramiento jurídico.
