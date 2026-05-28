# shellcheck shell=bash
# Helpers compartidos entre scripts/audit/*.sh
# Source desde otros scripts: source "$(dirname "$0")/_lib.sh"

set -Eeuo pipefail
IFS=$'\n\t'

# Códigos de retorno
AUDIT_PASS=0
AUDIT_FAIL=1
AUDIT_WARN=2

# Contadores globales (uno por script)
: "${AUDIT_FAILS:=0}"
: "${AUDIT_WARNS:=0}"
: "${AUDIT_OKS:=0}"

audit_ok()   { printf 'OK:   %s\n'   "$*"; AUDIT_OKS=$((AUDIT_OKS+1)); }
audit_warn() { printf 'WARN: %s\n'   "$*" >&2; AUDIT_WARNS=$((AUDIT_WARNS+1)); }
audit_fail() { printf 'FAIL: %s\n'   "$*" >&2; AUDIT_FAILS=$((AUDIT_FAILS+1)); }
audit_info() { printf 'INFO: %s\n'   "$*"; }

# Devuelve el código de retorno apropiado y emite RESULT.
audit_finish() {
  local fase="${1:-?}"
  if (( AUDIT_FAILS > 0 )); then
    printf 'RESULT: FAIL fase=%s oks=%d warns=%d fails=%d\n' \
      "$fase" "$AUDIT_OKS" "$AUDIT_WARNS" "$AUDIT_FAILS"
    return "$AUDIT_FAIL"
  fi
  if (( AUDIT_WARNS > 0 )); then
    printf 'RESULT: WARN fase=%s oks=%d warns=%d\n' \
      "$fase" "$AUDIT_OKS" "$AUDIT_WARNS"
    return "$AUDIT_WARN"
  fi
  printf 'RESULT: PASS fase=%s oks=%d\n' "$fase" "$AUDIT_OKS"
  return "$AUDIT_PASS"
}

# Resuelve la raíz del repo (busca .git hacia arriba). Si falla, sale 1.
audit_repo_root() {
  local d="${1:-$PWD}"
  while [[ "$d" != "/" ]]; do
    [[ -d "$d/.git" ]] && { printf '%s\n' "$d"; return 0; }
    d="$(dirname "$d")"
  done
  audit_fail "no se encontró raíz git desde $PWD"
  return 1
}

# Comprueba que un comando existe.
audit_require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    audit_fail "comando ausente: $cmd"
    return 1
  fi
  return 0
}

# Compara versiones semver: audit_semver_ge "1.2.3" "1.2.0" → 0 si la primera ≥ segunda.
audit_semver_ge() {
  local a="$1" b="$2"
  # Normaliza a tres dígitos
  local -a A B
  IFS='.' read -r -a A <<<"${a%%[^0-9.]*}"
  IFS='.' read -r -a B <<<"${b%%[^0-9.]*}"
  for i in 0 1 2; do
    local ai="${A[$i]:-0}" bi="${B[$i]:-0}"
    if (( ai > bi )); then return 0; fi
    if (( ai < bi )); then return 1; fi
  done
  return 0
}

# Extrae versión de una dependencia de un package.json sin Node, usando jq si está.
# Si jq no está, fallback grep tolerante.
audit_pkg_version() {
  local pkg_json="$1" dep="$2"
  if command -v jq >/dev/null 2>&1; then
    jq -r --arg d "$dep" \
      '(.dependencies[$d] // .devDependencies[$d] // .peerDependencies[$d] // empty)' \
      "$pkg_json" 2>/dev/null || true
  else
    grep -E "\"$dep\"\\s*:" "$pkg_json" 2>/dev/null \
      | head -n1 \
      | sed -E 's/.*"'"$dep"'"\s*:\s*"([^"]+)".*/\1/' \
      || true
  fi
}
