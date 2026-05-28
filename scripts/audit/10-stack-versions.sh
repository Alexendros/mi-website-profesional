#!/usr/bin/env bash
# Fase 0/6 · Versiones del stack vs canon (CLAUDE.md Version Matrix)
source "$(dirname "$0")/_lib.sh"

ROOT="$(audit_repo_root "$(dirname "$0")")" || exit 1
cd "$ROOT"

APP_PKG="apps/alexendros-pro/package.json"
[[ -f "$APP_PKG" ]] || { audit_fail "no existe $APP_PKG"; audit_finish 0; exit $?; }

check() {
  local dep="$1" min="$2" label="${3:-$1}"
  local v
  v="$(audit_pkg_version "$APP_PKG" "$dep")"
  if [[ -z "$v" ]]; then
    audit_fail "$label no instalado en alexendros-pro"
    return
  fi
  # Limpia caret/tilde/rangos
  v_clean="${v//[^0-9.]/}"
  if audit_semver_ge "$v_clean" "$min"; then
    audit_ok "$label $v (≥ $min)"
  else
    audit_fail "$label $v < $min (canon)"
  fi
}

# Canon CLAUDE.md
check next                "16.2.0" "Next.js"
check react               "19.2.0" "React"
check tailwindcss         "4.1.0"  "Tailwind CSS"
check typescript          "5.1.0"  "TypeScript"

# Esperados Fase 5/6 — si no existen es FAIL bloqueante para esas fases
for dep in "@supabase/ssr" "@supabase/supabase-js" "@trpc/server" "@trpc/client" "@tanstack/react-query" "stripe" "resend" "@react-email/components" "@upstash/ratelimit" "@upstash/redis" "@sentry/nextjs"; do
  v="$(audit_pkg_version "$APP_PKG" "$dep")"
  if [[ -n "$v" ]]; then
    audit_ok "$dep $v presente"
  else
    audit_warn "$dep ausente (requerido para Fases 5-8)"
  fi
done

# Prisma se vive en packages/db
DB_PKG="packages/db/package.json"
if [[ -f "$DB_PKG" ]]; then
  v="$(audit_pkg_version "$DB_PKG" "prisma")"
  [[ -n "$v" ]] && audit_ok "prisma $v en @repo/db" || audit_fail "prisma ausente en @repo/db"
  v="$(audit_pkg_version "$DB_PKG" "@prisma/client")"
  [[ -n "$v" ]] && audit_ok "@prisma/client $v en @repo/db" || audit_fail "@prisma/client ausente en @repo/db"
else
  audit_fail "packages/db/package.json ausente"
fi

# proxy.ts vs middleware.ts (Next 16)
if [[ -f apps/alexendros-pro/proxy.ts || -f apps/alexendros-pro/src/proxy.ts ]]; then
  audit_ok "proxy.ts presente (Next 16)"
elif [[ -f apps/alexendros-pro/middleware.ts || -f apps/alexendros-pro/src/middleware.ts ]]; then
  audit_warn "middleware.ts presente — renombrar a proxy.ts (Next 16)"
fi

audit_finish 0
