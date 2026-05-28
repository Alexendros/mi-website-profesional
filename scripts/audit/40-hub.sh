#!/usr/bin/env bash
# Fase 6 · Hub alexendros.pro · Next 16, Auth SSR, tRPC, rate limit
source "$(dirname "$0")/_lib.sh"

ROOT="$(audit_repo_root "$(dirname "$0")")" || exit 1
cd "$ROOT"

APP="apps/alexendros-pro"

# 1. Next 16 — versión y patrones
nv="$(audit_pkg_version "$APP/package.json" next)"
nv_clean="${nv//[^0-9.]/}"
if audit_semver_ge "$nv_clean" "16.0.0"; then
  audit_ok "Next.js $nv (≥ 16)"
else
  audit_fail "Next.js $nv < 16 (canon)"
fi

# 2. proxy.ts vs middleware.ts
if [[ -f "$APP/proxy.ts" ]] || [[ -f "$APP/src/proxy.ts" ]]; then
  audit_ok "proxy.ts presente"
elif [[ -f "$APP/middleware.ts" ]] || [[ -f "$APP/src/middleware.ts" ]]; then
  audit_fail "middleware.ts presente — renombrar a proxy.ts en Next 16"
fi

# 3. await params/cookies/headers (heurística)
if grep -RIlE 'cookies\(\)' "$APP/app" 2>/dev/null | xargs -r grep -L 'await cookies()' 2>/dev/null | head -n1 >/dev/null; then
  audit_warn "cookies() sin await detectado (Next 16 lo exige)"
else
  audit_ok "cookies() siempre awaited (o ausente)"
fi

# 4. Supabase SSR cableado
if grep -RIlE '@supabase/ssr' "$APP" >/dev/null 2>&1; then
  audit_ok "@supabase/ssr importado"
  grep -RIlE 'createServerClient' "$APP" >/dev/null 2>&1 \
    && audit_ok "createServerClient usado" \
    || audit_fail "createServerClient no usado"
else
  audit_fail "@supabase/ssr no usado"
fi

# 5. tRPC v11
if grep -RIlE '@trpc/server' "$APP" packages 2>/dev/null | head -n1 >/dev/null; then
  audit_ok "tRPC presente"
  grep -RIlE 'createCallerFactory' "$APP" packages 2>/dev/null | head -n1 >/dev/null \
    && audit_ok "createCallerFactory usado (RSC sin HTTP)" \
    || audit_warn "createCallerFactory no usado"
else
  audit_fail "tRPC no integrado"
fi

# 6. Rate limit Upstash
if grep -RIlE '@upstash/ratelimit' "$APP" packages 2>/dev/null | head -n1 >/dev/null; then
  audit_ok "@upstash/ratelimit presente"
else
  audit_fail "rate limit ausente — obligatorio en /api/auth/* y /api/trpc/*"
fi

# 7. Login + dashboard
[[ -d "$APP/app/(auth)" || -d "$APP/app/login" ]] && audit_ok "rutas de auth presentes" \
  || audit_warn "no se detectan rutas /login o /(auth)"
[[ -d "$APP/app/(app)" || -d "$APP/app/app" || -d "$APP/app/dashboard" ]] \
  && audit_ok "rutas de dashboard presentes" \
  || audit_warn "no se detectan rutas de dashboard autenticado"

# 8. Sentry
grep -RIlE '@sentry/nextjs' "$APP" >/dev/null 2>&1 \
  && audit_ok "Sentry instalado" || audit_warn "Sentry no instalado"

audit_finish 6
