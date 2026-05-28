#!/usr/bin/env bash
# Fase 4 · DB / Prisma / RLS — Supabase self-hosted Dokploy (ADR-0003)
source "$(dirname "$0")/_lib.sh"

ROOT="$(audit_repo_root "$(dirname "$0")")" || exit 1
cd "$ROOT"

SCHEMA="packages/db/prisma/schema.prisma"
[[ -f "$SCHEMA" ]] || { audit_fail "$SCHEMA ausente"; audit_finish 4; exit $?; }

EXPECTED_MODELS=(
  User Kit Plan Price Subscription ClientProfile KitProfile
  InboundRequest Affiliate AffiliatePayout AuditLog
  DigitalRegistration ConsentRecord Lead
)

# 1. ≥ 13 modelos (objetivo del ADR-0003)
models=$(grep -cE '^model[[:space:]]+[A-Z]' "$SCHEMA" || true)
if (( models >= 13 )); then
  audit_ok "modelos Prisma: $models (≥ 13)"
else
  audit_fail "modelos Prisma: $models (esperado ≥ 13)"
fi

# 1b. Lista nominativa
for m in "${EXPECTED_MODELS[@]}"; do
  if grep -qE "^model[[:space:]]+$m[[:space:]]*\\{" "$SCHEMA"; then
    audit_ok "modelo $m presente"
  else
    audit_fail "modelo $m ausente"
  fi
done

# 2. Timestamps obligatorios en todos los modelos (salvo append-only ConsentRecord/DigitalRegistration que no llevan updatedAt)
missing_ts=$(awk '/^model[[:space:]]+/{m=$2; has_c=0; has_u=0; next}
                  /createdAt/{has_c=1}
                  /updatedAt/{has_u=1}
                  /^}/{
                    if(m!=""){
                      if(m=="AuditLog" || m=="DigitalRegistration" || m=="ConsentRecord"){
                        if(!has_c) print m
                      } else {
                        if(!has_c||!has_u) print m
                      }
                      m=""
                    }
                  }' "$SCHEMA" || true)
if [[ -z "$missing_ts" ]]; then
  audit_ok "todos los modelos tienen timestamps según patrón (append-only: solo createdAt)"
else
  audit_warn "modelos sin timestamps: $(echo "$missing_ts" | tr '\n' ' ')"
fi

# 3. @@map snake_case
unmapped=$(grep -cE '^model[[:space:]]+' "$SCHEMA" || true)
mapped=$(grep -cE '@@map\("[a-z_]+"\)' "$SCHEMA" || true)
if (( mapped >= unmapped )); then
  audit_ok "@@map snake_case presente en todos los modelos ($mapped)"
else
  audit_warn "@@map sólo en $mapped/$unmapped modelos"
fi

# 4. .env.local con DATABASE_URL/DIRECT_URL apuntando al self-hosted
if [[ -f .env.local ]]; then
  if grep -qE '^DATABASE_URL=.*supabase\.alexendros\.pro' .env.local; then
    audit_ok "DATABASE_URL apunta a supabase.alexendros.pro"
  else
    audit_fail "DATABASE_URL no apunta a la instancia self-hosted (ADR-0003)"
  fi
  if grep -qE '^DIRECT_URL=.*supabase\.alexendros\.pro' .env.local; then
    audit_ok "DIRECT_URL apunta a supabase.alexendros.pro"
  else
    audit_fail "DIRECT_URL ausente o no apunta al self-hosted"
  fi
  if grep -qE '^DATABASE_URL=.*pgbouncer=true' .env.local && grep -qE '^DATABASE_URL=.*connection_limit=1' .env.local; then
    audit_ok "DATABASE_URL usa pgbouncer=true&connection_limit=1 (CM-02)"
  else
    audit_fail "DATABASE_URL debe incluir pgbouncer=true&connection_limit=1 para serverless"
  fi
fi

# 5. Migraciones generadas por prisma
MIG_DIR="packages/db/prisma/migrations"
if [[ -d "$MIG_DIR" ]]; then
  n=$(find "$MIG_DIR" -maxdepth 1 -mindepth 1 -type d | wc -l)
  (( n > 0 )) && audit_ok "$n migración(es) Prisma" || audit_fail "directorio migrations/ vacío"
else
  audit_warn "$MIG_DIR ausente (ejecutar prisma migrate dev --name 0001_init)"
fi

# 5b. SQL bruto en packages/db/prisma/sql/
for sql in 0003_auth_user_sync 0004_rls_policies 0005_indices_partials; do
  if [[ -f "packages/db/prisma/sql/${sql}.sql" ]]; then
    audit_ok "sql/${sql}.sql presente"
  else
    audit_fail "sql/${sql}.sql ausente"
  fi
done

# 6. Anotaciones RGPD en schema
rls_hits=$(grep -cE 'RGPD|Art\.[[:space:]]*6\.1' "$SCHEMA" || true)
if (( rls_hits >= 6 )); then
  audit_ok "anotaciones RGPD en schema: $rls_hits"
else
  audit_warn "anotaciones RGPD en schema escasas ($rls_hits)"
fi

# 7. Seed determinista
SEED="packages/db/prisma/seed.ts"
if [[ -f "$SEED" ]]; then
  audit_ok "seed.ts presente"
  # Heurística: ningún email real (.com/.es) salvo el dominio test alexendros.test
  if grep -qE "[a-zA-Z0-9._-]+@(?!alexendros\\.test)([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})" "$SEED" 2>/dev/null; then
    audit_warn "seed contiene emails que parecen reales — revisar"
  else
    audit_ok "seed sin emails sospechosos"
  fi
else
  audit_warn "seed.ts ausente"
fi

# 8. Factory clientes Supabase
for f in packages/db/src/supabase.ts packages/db/src/prisma.ts apps/alexendros-pro/lib/supabase/server.ts apps/alexendros-pro/lib/supabase/client.ts apps/alexendros-pro/lib/supabase/middleware.ts apps/alexendros-pro/proxy.ts; do
  [[ -f "$f" ]] && audit_ok "$f presente" || audit_fail "$f ausente"
done

# 8b. CP-01: no getSession() en el código (solo getUser())
if grep -RIn 'auth\.getSession()' apps packages 2>/dev/null | head -n1 >/dev/null; then
  audit_fail "uso de auth.getSession() detectado — usar getUser() (CP-01)"
else
  audit_ok "sin auth.getSession() (CP-01 cumplido)"
fi

# 8c. CP-03: SUPABASE_SERVICE_ROLE_KEY nunca con prefijo NEXT_PUBLIC_
if grep -RIn 'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY' . 2>/dev/null | head -n1 >/dev/null; then
  audit_fail "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY detectado — fuga service_role (CP-03)"
else
  audit_ok "service_role no expuesto al cliente (CP-03)"
fi

# 9. Endpoint self-hosted vivo (si curl + URL disponibles)
if command -v curl >/dev/null 2>&1; then
  url="${SUPABASE_PUBLIC_URL:-https://supabase.alexendros.pro}"
  if curl -fsS --max-time 5 "$url/auth/v1/health" >/dev/null 2>&1; then
    audit_ok "$url/auth/v1/health responde"
  else
    audit_warn "$url/auth/v1/health no responde (¿desplegado en Dokploy?)"
  fi
fi

# 10. RLS remota — sólo si psql + DIRECT_URL disponibles
if command -v psql >/dev/null 2>&1 && [[ -f .env.local ]]; then
  # shellcheck disable=SC1091
  set -a; source .env.local; set +a
  if [[ -n "${DIRECT_URL:-}" ]]; then
    bad_tables=$(psql "$DIRECT_URL" -tAc \
      "select tablename from pg_tables where schemaname='public' and rowsecurity=false and tablename not in ('_prisma_migrations')" \
      2>/dev/null || true)
    if [[ -z "$bad_tables" ]]; then
      audit_ok "RLS activa en todas las tablas public.*"
    else
      audit_fail "tablas sin RLS: $(echo "$bad_tables" | tr '\n' ' ')"
    fi
    n_pol=$(psql "$DIRECT_URL" -tAc \
      "select count(*) from pg_policies where schemaname='public'" 2>/dev/null || echo 0)
    if (( n_pol >= 18 )); then
      audit_ok "policies RLS: $n_pol (≥ 18)"
    else
      audit_warn "policies RLS: $n_pol (esperado ≥ 18)"
    fi
  else
    audit_warn "DIRECT_URL no definido — saltando verificación remota RLS"
  fi
else
  audit_info "psql ausente o sin .env.local — saltando verificación remota"
fi

audit_finish 4
