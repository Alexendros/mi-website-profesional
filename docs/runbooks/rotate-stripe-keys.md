# Runbook: Rotación de claves Stripe

- Versión: 1.0 · 2026-05-10
- Frecuencia recomendada: trimestral o inmediatamente tras sospecha de compromiso
- Tiempo estimado: 20-30 min

---

## Pre-requisitos

- Acceso a Stripe Dashboard con MFA
- Acceso a Vercel Dashboard (o CLI `vercel`)
- Deploy window disponible (la rotación requiere redeploy)

---

## Paso 1: Generar nueva Secret Key

1. Stripe Dashboard → Developers → API Keys
2. Clic en "Roll key" (no "Create") — esto invalida la anterior gradualmente
3. Copiar nueva `sk_live_...`

> Stripe tiene un período de gracia (~24h) en el que ambas claves funcionan.
> Úsalo para el redeploy antes de que expire la anterior.

## Paso 2: Actualizar en Vercel

```bash
# Método CLI
vercel env rm STRIPE_SECRET_KEY production
vercel env add STRIPE_SECRET_KEY production
# Introducir nuevo valor cuando pregunte

# O via Vercel Dashboard → Project → Settings → Environment Variables
```

## Paso 3: Rotar Webhook Secret

El webhook secret es independiente de la API key. Rotar si se sospecha compromiso del endpoint:

1. Stripe Dashboard → Developers → Webhooks → [endpoint]
2. "Reveal" → copiar valor actual para comparar con `.env`
3. "Roll" para generar nuevo → copiar `whsec_...`
4. Actualizar `STRIPE_WEBHOOK_SECRET` en Vercel

## Paso 4: Redeploy

```bash
vercel --prod
# O hacer push a main para triggear CI/CD
```

## Paso 5: Verificar

```bash
# Stripe CLI — verificar que webhooks llegan correctamente
stripe listen --forward-to https://alexendros.pro/api/webhooks/stripe

# Hacer un checkout de prueba en Stripe Test Mode para confirmar
```

## Paso 6: Documentar

- Registrar fecha de rotación en el postmortem si fue por incidente
- Actualizar `~/.claude/projects/-var-home-soyalexendros/memory/` con fecha de próxima rotación

---

## Si la rotación es de emergencia (clave comprometida)

1. **No uses "Roll"** — usa "Delete" y crea una nueva desde cero
2. Contacta a Stripe Support si hay transacciones sospechosas
3. Revisar eventos Stripe de las últimas 48h para detectar uso no autorizado
4. Completar postmortem con `threat-model.md` referenciado (I-02)
