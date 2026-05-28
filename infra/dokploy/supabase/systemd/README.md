# Instalación del backup nocturno en el VPS

Estos archivos los aplica el operador en el VPS con `sudo` (Claude no invoca sudo directamente).

## Pasos

1. **Copiar el script al VPS**:
   ```bash
   scp infra/dokploy/supabase/scripts/backup.sh vps:/tmp/supabase-backup.sh
   ssh vps
   # En el VPS:
   ! sudo install -m 0755 /tmp/supabase-backup.sh /opt/alexendros/supabase-backup.sh
   ```

2. **Crear `/etc/default/supabase-backup`** (chmod 600 root):
   ```bash
   ! sudo tee /etc/default/supabase-backup >/dev/null <<'EOF'
   RESTIC_REPOSITORY=s3:s3.hostinger.com/alexendros-backups
   RESTIC_PASSWORD_FILE=/etc/alexendros/restic.pass
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   POSTGRES_CONTAINER=alexendros-supabase-db-1
   POSTGRES_USER=postgres
   POSTGRES_DB=postgres
   RETENTION_DAILY=7
   RETENTION_WEEKLY=4
   RETENTION_MONTHLY=12
   EOF
   ! sudo chmod 600 /etc/default/supabase-backup
   ! sudo chown root:root /etc/default/supabase-backup
   ```

3. **Crear `/etc/alexendros/restic.pass`** (32+ chars aleatorios, chmod 600 root):
   ```bash
   ! sudo mkdir -p /etc/alexendros
   openssl rand -base64 48 | ! sudo tee /etc/alexendros/restic.pass >/dev/null
   ! sudo chmod 600 /etc/alexendros/restic.pass
   ```

4. **Inicializar el repositorio restic** (una sola vez):
   ```bash
   ! sudo env $(cat /etc/default/supabase-backup | xargs) restic init
   ```

5. **Instalar units systemd**:
   ```bash
   ! sudo install -m 0644 infra/dokploy/supabase/systemd/supabase-backup.service /etc/systemd/system/
   ! sudo install -m 0644 infra/dokploy/supabase/systemd/supabase-backup.timer /etc/systemd/system/
   ! sudo systemctl daemon-reload
   ! sudo systemctl enable --now supabase-backup.timer
   ```

6. **Probar manualmente**:
   ```bash
   ! sudo systemctl start supabase-backup.service
   journalctl -u supabase-backup.service -e | tail -50
   ```

7. **Verificar 3 noches**:
   ```bash
   ! sudo env $(cat /etc/default/supabase-backup | xargs) restic snapshots --last 5
   ```

## Restore probado (obligatorio antes de cerrar Fase 4)

En VPS staging o carpeta scratch:

```bash
! sudo env $(cat /etc/default/supabase-backup | xargs) restic restore latest --target /tmp/restore
# Carga el dump en una BBDD aislada para verificar integridad
psql "$STAGING_DIRECT_URL" -f /tmp/restore/supabase-dump-*.sql
psql "$STAGING_DIRECT_URL" -c "select count(*) from public.kits"
```

Adjuntar evidencia (logs, fecha y rc=0) a `docs/runbooks/cierre-fase-4.md`.
