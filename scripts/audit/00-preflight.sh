#!/usr/bin/env bash
# Fase 0 · Preflight: toolchain, repo, .env.local
# Devuelve 0 PASS · 1 FAIL · 2 WARN
source "$(dirname "$0")/_lib.sh"

ROOT="$(audit_repo_root "$(dirname "$0")")" || exit 1
cd "$ROOT"

# 1. Node ≥ 20.9
if audit_require_cmd node; then
  node_v="$(node -v | sed 's/^v//')"
  if audit_semver_ge "$node_v" "20.9.0"; then
    audit_ok "Node $node_v (≥ 20.9)"
  else
    audit_fail "Node $node_v < 20.9 (canon Next 16)"
  fi
fi

# 2. pnpm ≥ 10
if audit_require_cmd pnpm; then
  pnpm_v="$(pnpm -v)"
  if audit_semver_ge "$pnpm_v" "10.0.0"; then
    audit_ok "pnpm $pnpm_v"
  else
    audit_warn "pnpm $pnpm_v < 10 (canon repo: 10+)"
  fi
fi

# 3. Turbo ≥ 2
if [[ -f node_modules/.bin/turbo ]]; then
  turbo_v="$(node_modules/.bin/turbo --version 2>/dev/null || echo 0)"
  if audit_semver_ge "$turbo_v" "2.0.0"; then
    audit_ok "turbo $turbo_v"
  else
    audit_warn "turbo $turbo_v (esperado ≥ 2)"
  fi
else
  audit_warn "turbo no instalado localmente (¿faltan deps? pnpm install)"
fi

# 4. Git limpio
if git rev-parse --git-dir >/dev/null 2>&1; then
  branch="$(git rev-parse --abbrev-ref HEAD)"
  audit_info "rama actual: $branch"
  if [[ -n "$(git status --porcelain)" ]]; then
    audit_warn "hay cambios sin commitear"
  else
    audit_ok "working tree limpio"
  fi
  if [[ "$branch" == "main" ]]; then
    audit_warn "estás en main — el canon exige feature branch + PR"
  fi
else
  audit_fail "no es un repo git"
fi

# 5. .env.local presente y .gitignore correcto
if [[ -f .env.local ]]; then
  audit_ok ".env.local presente"
  if git check-ignore -q .env.local 2>/dev/null; then
    audit_ok ".env.local correctamente ignorado por git"
  else
    audit_fail ".env.local NO está en .gitignore — riesgo de secretos"
  fi
  # Heurística: tokens largos
  if grep -E '_TOKEN=|_KEY=|_SECRET=' .env.local | grep -qE '=[A-Za-z0-9._-]{40,}'; then
    audit_info "secretos largos detectados en .env.local (esperado)"
  fi
else
  audit_warn ".env.local ausente — Fases 4-5 bloqueadas hasta que existan credenciales"
fi

# 6. .planning/ presente (legado GSD que debe conservarse)
[[ -d .planning ]] && audit_ok ".planning/ presente (historial)" \
  || audit_warn ".planning/ ausente"

# 7. ROADMAP.md actualizado (heurística: > 50 líneas no scaffold)
if [[ -f ROADMAP.md ]] && (( $(wc -l < ROADMAP.md) > 50 )); then
  audit_ok "ROADMAP.md presente y desarrollado"
else
  audit_warn "ROADMAP.md ausente o scaffold"
fi

audit_finish 0
