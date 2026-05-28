#!/usr/bin/env bash
# Fase 7.5 · n8n self-hosted (Hostinger VPS)
source "$(dirname "$0")/_lib.sh"

ROOT="$(audit_repo_root "$(dirname "$0")")" || exit 1
cd "$ROOT"

# 1. Variables n8n
if [[ -f .env.local ]]; then
  grep -q '^N8N_BASE_URL=' .env.local && audit_ok "N8N_BASE_URL" || audit_fail "N8N_BASE_URL ausente"
  grep -q '^N8N_WEBHOOK_SECRET=' .env.local && audit_ok "N8N_WEBHOOK_SECRET" || audit_fail "N8N_WEBHOOK_SECRET ausente"
fi

# 2. Healthcheck remoto si tenemos URL y curl
if command -v curl >/dev/null 2>&1 && [[ -f .env.local ]]; then
  url=$(grep -E '^N8N_BASE_URL=' .env.local | cut -d= -f2- | tr -d '"' || true)
  if [[ -n "$url" ]]; then
    if curl -fsS --max-time 5 "$url/healthz" >/dev/null 2>&1; then
      audit_ok "n8n /healthz responde 200"
    else
      audit_fail "n8n $url/healthz no responde"
    fi
  fi
else
  audit_warn "curl o N8N_BASE_URL ausentes — healthcheck no ejecutado"
fi

# 3. Workflows exportados en repo
WF_DIR="infra/n8n/workflows"
if [[ -d "$WF_DIR" ]]; then
  n=$(find "$WF_DIR" -name '*.json' | wc -l)
  if (( n >= 10 )); then
    audit_ok "$n workflows exportados"
  else
    audit_warn "sólo $n workflows exportados — esperado ≥ 10"
  fi
else
  audit_warn "$WF_DIR ausente — exportar workflows para versionarlos"
fi

audit_finish 7.5
