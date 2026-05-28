# Supabase self-hosted sobre Dokploy

Endpoint público: `supabase.alexendros.pro`
Stack: `supabase/supabase` upstream + override propio + Dokploy compose service.

## Resumen

| Componente | Imagen / Servicio | Puerto interno | Expuesto |
|---|---|---|---|
| Postgres | `supabase/postgres` | 5432 | TCP firewall IP-allowlist |
| Supavisor | `supabase/supavisor` | 6543 | Traefik TCP TLS-passthrough |
| GoTrue (Auth) | `supabase/gotrue` | 9999 | vía Kong `/auth/v1` |
| PostgREST | `postgrest/postgrest` | 3000 | vía Kong `/rest/v1` |
| Realtime | `supabase/realtime` | 4000 | vía Kong `/realtime/v1` |
| Storage | `supabase/storage-api` | 5000 | vía Kong `/storage/v1` |
| imgproxy | `darthsim/imgproxy` | 5001 | interno |
| meta | `supabase/postgres-meta` | 8080 | interno |
| Kong | `kong:2.x` | 8000 | Traefik HTTPS `supabase.alexendros.pro` |
| Studio | `supabase/studio` | 3000 | Traefik HTTPS `studio.supabase.alexendros.pro` (basic-auth) |

## Despliegue paso a paso

1. **Generar JWTs** desde el portátil del operador:
   ```bash
   pnpm dlx tsx infra/dokploy/supabase/scripts/gen-jwt.ts > /tmp/sb-keys.json
   ```
   El script imprime `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY`. **No commitear.**

2. **Generar password Postgres y Studio**:
   ```bash
   openssl rand -base64 32     # POSTGRES_PASSWORD
   openssl rand -base64 32     # DASHBOARD_PASSWORD
   ```

3. **Crear DNS** según `infra/dokploy/PREFLIGHT.md` y esperar propagación (≤ 1 h).

4. **Dokploy UI**:
   - Project: `alexendros`
   - Crear Compose Service `supabase`:
     - Source: GitHub `supabase/supabase`, branch `master`, ref pinneado (ver `infra/dokploy/VERSION`)
     - Subpath: `docker/`
     - Compose file: `docker-compose.yml` + override montado como volumen secundario
   - Adjuntar `compose.override.yml` (este directorio) vía "Custom compose extension".
   - Inyectar las variables del Environment del compose (lista abajo).
   - Adjuntar `kong.yml` como volumen montado en `/var/lib/kong/kong.yml` para el servicio `kong`.

5. **Variables (en Dokploy UI → Environment, no en git)**:
   ```env
   POSTGRES_PASSWORD=<openssl 32 chars>
   JWT_SECRET=<64 chars>
   ANON_KEY=<JWT firmado role=anon>
   SERVICE_ROLE_KEY=<JWT firmado role=service_role>
   DASHBOARD_USERNAME=admin
   DASHBOARD_PASSWORD=<openssl 32 chars>
   SITE_URL=https://alexendros.pro
   ADDITIONAL_REDIRECT_URLS=https://alexendros.pro/auth/callback,https://stagekit.app/auth/callback,http://localhost:3000/auth/callback
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=465
   SMTP_USER=resend
   SMTP_PASS=<RESEND_API_KEY>
   SMTP_ADMIN_EMAIL=noreply@alexendros.pro
   SMTP_SENDER_NAME=Alexendros
   GOTRUE_DISABLE_SIGNUP=false
   GOTRUE_MAILER_AUTOCONFIRM=false
   GOTRUE_RATE_LIMIT_EMAIL_SENT=10
   GOTRUE_EXTERNAL_GOOGLE_ENABLED=true
   GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID=
   GOTRUE_EXTERNAL_GOOGLE_SECRET=
   GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI=https://supabase.alexendros.pro/auth/v1/callback
   GOTRUE_EXTERNAL_GITHUB_ENABLED=true
   GOTRUE_EXTERNAL_GITHUB_CLIENT_ID=
   GOTRUE_EXTERNAL_GITHUB_SECRET=
   GOTRUE_EXTERNAL_GITHUB_REDIRECT_URI=https://supabase.alexendros.pro/auth/v1/callback
   GOTRUE_EXTERNAL_APPLE_ENABLED=true
   GOTRUE_EXTERNAL_APPLE_CLIENT_ID=<Services ID Apple>
   GOTRUE_EXTERNAL_APPLE_SECRET=<JWT client secret, generado en cron 6 meses>
   GOTRUE_EXTERNAL_APPLE_REDIRECT_URI=https://supabase.alexendros.pro/auth/v1/callback
   ```

6. **Deploy** desde Dokploy. Esperar a que los 11 contenedores estén `healthy`.

7. **Configurar `db.supabase.alexendros.pro:6543`** (TCP router Traefik):
   - En Dokploy, marcar servicio `supavisor` como expuesto vía TCP entrypoint `postgres` (puerto 6543) con regla `HostSNI(\`db.supabase.alexendros.pro\`)` y TLS passthrough.
   - Si el entrypoint TCP `postgres` no existe, crearlo desde Traefik static config en Dokploy.

8. **Firewall** (puerto 5432 directo): `! sudo ufw allow from <IP_OP_1>,<IP_OP_2> to any port 5432 proto tcp` y `! sudo ufw deny 5432`.

9. **Smoke**:
   ```bash
   curl -fsSL https://supabase.alexendros.pro/auth/v1/health
   curl -fsS https://studio.supabase.alexendros.pro/ -o /dev/null -w '%{http_code}\n'   # 401
   psql "postgresql://postgres:<pwd>@db.supabase.alexendros.pro:5432/postgres?sslmode=require" -c 'select 1'
   ```

## OAuth providers — guía detallada en docs

Ver `infra/dokploy/supabase/OAUTH.md` (siguiente entregable). Apple requiere Developer Program (99 USD/año).

## Backups

`scripts/backup.sh` corre por systemd timer diario y sube cifrado a Object Storage. Ver `RUNBOOK-rotate-jwt.md` para rotaciones.

## Riesgos

Ver ADR-0003 §Consecuencias. Resumen: sin PITR nativo, SLA acoplado al VPS, rotación obligatoria de JWT Apple cada 6 meses.
