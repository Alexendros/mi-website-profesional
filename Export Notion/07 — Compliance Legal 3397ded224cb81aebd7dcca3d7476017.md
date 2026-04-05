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

retención_datos:
  usuarios_inactivos: 3 años desde último login (Art. 5.1.e)
  datos_fiscales: 5 años (Art. 30 LGT ES)
  logs_acceso: 1 año máx (LSSI Art. 12)
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

## Textos legales obligatorios

```
/legal/privacidad    — Política de Privacidad (Art. 13 RGPD)
/legal/cookies       — Política de Cookies (Guía AEPD)
/legal/terminos      — Términos y Condiciones (incl. condiciones SaaS)
/legal/aviso-legal   — Aviso Legal (LSSI Art. 10)
```

> ⚠️ Estos textos deben ser revisados por abogado antes de lanzamiento.
>