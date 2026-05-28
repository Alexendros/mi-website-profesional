#!/usr/bin/env bash
# Orquestador — corre todos los scripts/audit/*.sh y emite tabla resumen.
# Devuelve 0 si todos PASS, 1 si algún FAIL, 2 si sólo WARN.
set -Eeuo pipefail
IFS=$'\n\t'

HERE="$(dirname "$0")"
declare -A RES
declare -a ORDER=(00-preflight 10-stack-versions 20-db-schema 30-stripe-funnel 40-hub 50-seo-cwv 60-n8n 70-security)

worst=0
for name in "${ORDER[@]}"; do
  script="$HERE/${name}.sh"
  if [[ ! -x "$script" && ! -f "$script" ]]; then
    RES[$name]="MISS"
    continue
  fi
  set +e
  out="$(bash "$script" 2>&1)"
  rc=$?
  set -e
  case $rc in
    0) RES[$name]="PASS" ;;
    2) RES[$name]="WARN"; (( worst < 2 )) && worst=2 ;;
    *) RES[$name]="FAIL"; worst=1 ;;
  esac
  printf '\n===== %s (rc=%d) =====\n%s\n' "$name" "$rc" "$out"
done

printf '\n\n============= RESUMEN =============\n'
printf '%-22s  %s\n' "fase" "estado"
printf '%-22s  %s\n' "----" "------"
for name in "${ORDER[@]}"; do
  printf '%-22s  %s\n' "$name" "${RES[$name]:-?}"
done
printf '===================================\n'
printf 'GLOBAL: %s\n' "$( [[ $worst -eq 0 ]] && echo PASS || ( [[ $worst -eq 2 ]] && echo WARN || echo FAIL ) )"
exit "$worst"
