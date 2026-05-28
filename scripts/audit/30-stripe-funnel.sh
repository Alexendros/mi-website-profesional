#!/usr/bin/env bash
# Fase 5 · Stripe · planes, webhook, idempotencia, contratos
source "$(dirname "$0")/_lib.sh"

ROOT="$(audit_repo_root "$(dirname "$0")")" || exit 1
cd "$ROOT"

# 1. Fuente de verdad de planes
PLANS="apps/alexendros-pro/lib/stripe/kit-plans.ts"
[[ -f "$PLANS" ]] || PLANS="packages/stripe/src/kit-plans.ts"
if [[ -f "$PLANS" ]]; then
  audit_ok "kit-plans.ts encontrado en $PLANS"
  if grep -qE 'process\.env\.STRIPE_PRICE_' "$PLANS"; then
    audit_ok "planes referenciados por env (STRIPE_PRICE_*)"
  else
    audit_fail "planes parecen hardcodeados — sólo deben referenciarse env vars"
  fi
else
  audit_fail "kit-plans.ts ausente"
fi

# 2. Webhook handler
WH=$(find apps/alexendros-pro/app/api/webhooks -type f -name 'route.*' 2>/dev/null | head -n1 || true)
if [[ -n "$WH" ]]; then
  audit_ok "webhook handler: $WH"
  grep -q 'constructEvent' "$WH" && audit_ok "verificación de firma (constructEvent)" \
    || audit_fail "webhook sin verificación de firma"
  grep -qE 'idempotencyKey|idempotency_key|seen_event|processed_at' "$WH" \
    && audit_ok "marca de idempotencia detectada" \
    || audit_warn "no se detecta marca de idempotencia (riesgo de doble procesado)"
  for ev in checkout.session.completed customer.subscription.updated invoice.payment_failed transfer.created; do
    grep -q "$ev" "$WH" && audit_ok "evento manejado: $ev" \
      || audit_fail "evento NO manejado: $ev"
  done
else
  audit_fail "no hay route handler de webhooks Stripe en apps/alexendros-pro/app/api/webhooks/"
fi

# 3. Plantillas Resend / React Email post-checkout
TEMPLATES_DIR="packages/email/src"
if [[ -d "$TEMPLATES_DIR" ]]; then
  n=$(find "$TEMPLATES_DIR" -type f \( -name '*.tsx' -o -name '*.ts' \) | wc -l)
  if (( n >= 4 )); then
    audit_ok "plantillas email: $n"
  else
    audit_warn "sólo $n plantillas — esperado ≥ 4 (bienvenida, contrato, onboarding, calendario)"
  fi
else
  audit_fail "packages/email/src ausente"
fi

# 4. Página /precios y /contratar
[[ -f apps/alexendros-pro/app/precios/page.tsx ]] && audit_ok "/precios presente" \
  || audit_warn "/precios ausente"
[[ -d apps/alexendros-pro/app/contratar ]] && audit_ok "/contratar/[plan] presente" \
  || audit_warn "/contratar/[plan] ausente"

# 5. Consent record en webhook o página
if grep -RIlE 'ConsentRecord' apps/alexendros-pro packages/db 2>/dev/null | head -n1 >/dev/null; then
  audit_ok "ConsentRecord referenciado en código"
else
  audit_warn "ConsentRecord no referenciado — exigido por Art. 7 RGPD"
fi

# 6. Variables Stripe en .env.local
if [[ -f .env.local ]]; then
  for k in STRIPE_SECRET_KEY NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY STRIPE_WEBHOOK_SECRET; do
    grep -q "^$k=" .env.local && audit_ok "$k en .env.local" || audit_fail "$k ausente"
  done
fi

audit_finish 5
