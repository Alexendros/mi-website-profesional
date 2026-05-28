#!/usr/bin/env bash
# Fase 8 · Hardening, secretos, dependencias, headers
source "$(dirname "$0")/_lib.sh"

ROOT="$(audit_repo_root "$(dirname "$0")")" || exit 1
cd "$ROOT"

# 1. gitleaks
if command -v gitleaks >/dev/null 2>&1; then
  if gitleaks detect --no-banner --redact -s "$ROOT" >/dev/null 2>&1; then
    audit_ok "gitleaks: sin secretos en el repo"
  else
    audit_fail "gitleaks detectó posibles secretos"
  fi
else
  audit_warn "gitleaks no instalado — instalar con pacman/brew o usar action upstream"
fi

# 2. npm/pnpm audit (high)
if command -v pnpm >/dev/null 2>&1; then
  out="$(pnpm audit --audit-level=high --prod 2>&1 || true)"
  if echo "$out" | grep -qE 'high|critical'; then
    audit_fail "pnpm audit reporta vulnerabilidades high/critical"
  else
    audit_ok "pnpm audit: sin high/critical"
  fi
else
  audit_warn "pnpm ausente"
fi

# 3. Semgrep OWASP
if command -v semgrep >/dev/null 2>&1; then
  if semgrep --error --quiet --config p/owasp-top-ten >/dev/null 2>&1; then
    audit_ok "Semgrep p/owasp-top-ten: sin findings críticos"
  else
    audit_fail "Semgrep encontró issues OWASP"
  fi
else
  audit_warn "semgrep no instalado"
fi

# 4. CSP sin unsafe-inline en vercel.json
VJ="apps/alexendros-pro/vercel.json"
if [[ -f "$VJ" ]]; then
  if grep -q 'unsafe-inline' "$VJ"; then
    audit_fail "CSP contiene unsafe-inline en $VJ"
  else
    audit_ok "CSP sin unsafe-inline"
  fi
  for h in Content-Security-Policy Strict-Transport-Security X-Content-Type-Options Referrer-Policy Permissions-Policy; do
    grep -q "$h" "$VJ" && audit_ok "header $h configurado" || audit_warn "header $h ausente"
  done
else
  audit_warn "$VJ ausente"
fi

# 5. RoPA y páginas legales
for f in docs/legal/ropa.md apps/alexendros-pro/app/aviso-legal/page.tsx apps/alexendros-pro/app/privacidad/page.tsx apps/alexendros-pro/app/cookies/page.tsx apps/alexendros-pro/app/terminos/page.tsx; do
  [[ -f "$f" ]] && audit_ok "$f presente" || audit_warn "$f ausente"
done

# 6. Pre-commit hooks
if [[ -f .husky/pre-commit ]] || [[ -f .githooks/pre-commit ]] || [[ -f .pre-commit-config.yaml ]]; then
  audit_ok "pre-commit hook configurado"
else
  audit_warn "sin pre-commit hooks (recomendado: gitleaks + lint-staged)"
fi

audit_finish 8
