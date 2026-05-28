#!/usr/bin/env bash
# Backup nocturno Postgres Supabase self-hosted → Hostinger Object Storage (S3 compat)
# vía restic con cifrado AES-256.
#
# Ejecutar desde systemd timer en el VPS:
#   /etc/systemd/system/supabase-backup.service  (ExecStart=/opt/alexendros/backup.sh)
#   /etc/systemd/system/supabase-backup.timer    (OnCalendar=*-*-* 03:00:00)
#
# El operador despliega y habilita con `! sudo systemctl enable --now supabase-backup.timer`.

set -Eeuo pipefail
IFS=$'\n\t'

# --- Configuración (variables esperadas en /etc/default/supabase-backup) -----
# RESTIC_REPOSITORY=s3:s3.hostinger.com/alexendros-backups
# RESTIC_PASSWORD_FILE=/etc/alexendros/restic.pass     (chmod 600 root)
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# POSTGRES_CONTAINER=supabase-db-1
# POSTGRES_USER=postgres
# POSTGRES_DB=postgres
# RETENTION_DAILY=7
# RETENTION_WEEKLY=4
# RETENTION_MONTHLY=12

# shellcheck disable=SC1091
source /etc/default/supabase-backup

LOG_TAG="supabase-backup"
log() { logger -t "$LOG_TAG" -- "$*"; printf '[%s] %s\n' "$(date -Iseconds)" "$*"; }

trap 'log "FAIL: backup abortado en línea $LINENO"' ERR

log "INICIO backup Postgres"

# 1. Snapshot lógico dentro del contenedor
TMP_DUMP="$(mktemp -t supabase-dump-XXXXXX.sql)"
trap 'rm -f "$TMP_DUMP"' EXIT

docker exec -i "$POSTGRES_CONTAINER" \
  pg_dump --format=custom --no-owner --no-privileges \
  -U "$POSTGRES_USER" "$POSTGRES_DB" >"$TMP_DUMP"

# pipefail: capturamos rc del pg_dump aunque ya esté redirigido al fichero
rc="${PIPESTATUS[0]}"
if [[ "$rc" -ne 0 ]]; then
  log "FAIL: pg_dump rc=$rc"
  exit "$rc"
fi
log "pg_dump ok ($(wc -c <"$TMP_DUMP") bytes)"

# 2. Subir a restic
restic backup "$TMP_DUMP" --tag postgres --tag supabase
log "restic backup ok"

# 3. Retención
restic forget \
  --keep-daily "$RETENTION_DAILY" \
  --keep-weekly "$RETENTION_WEEKLY" \
  --keep-monthly "$RETENTION_MONTHLY" \
  --prune
log "restic forget+prune ok"

# 4. Verificación rápida
restic check --read-data-subset=1/10
log "restic check ok (1/10)"

log "FIN backup OK"
