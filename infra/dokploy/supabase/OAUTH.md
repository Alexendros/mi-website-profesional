# OAuth providers — guía de configuración

> Acciones humanas fuera del repo. Una vez completadas, pegar los valores en
> Dokploy UI → Environment del Compose Service `supabase`.

Redirect URI común a todos los providers:

```
https://supabase.alexendros.pro/auth/v1/callback
```

## Google

1. https://console.cloud.google.com → Project "alexendros-prod" (crear si no existe).
2. APIs & Services → OAuth consent screen → External, audiencia EU. Rellenar dominio, política de privacidad, contacto DPO.
3. APIs & Services → Credentials → Create credentials → OAuth client ID → Web application.
4. Authorized redirect URI: `https://supabase.alexendros.pro/auth/v1/callback`.
5. Copiar `client_id` y `client_secret`.
6. Pegar en Dokploy:
   - `GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID=...`
   - `GOTRUE_EXTERNAL_GOOGLE_SECRET=...`
   - `GOTRUE_EXTERNAL_GOOGLE_ENABLED=true`
7. Redeploy `supabase`.

## GitHub

1. https://github.com/settings/developers → New OAuth App.
2. Homepage URL: `https://alexendros.pro`.
3. Authorization callback URL: `https://supabase.alexendros.pro/auth/v1/callback`.
4. Generar Client secret.
5. Pegar en Dokploy: `GOTRUE_EXTERNAL_GITHUB_CLIENT_ID/SECRET`, `GOTRUE_EXTERNAL_GITHUB_ENABLED=true`.

## Apple (Sign in with Apple)

> Coste 99 USD/año (Developer Program). Registrar el coste y la decisión en `docs/legal/ropa.md`.
> El JWT client secret caduca a los 6 meses como máximo — rotar cada ~150 días con cron.

1. https://developer.apple.com → Account → Membership → Enroll (Individual o Organization).
2. Certificates, IDs & Profiles → Identifiers → "+" → **App IDs** → App. Marcar capability "Sign In with Apple".
3. Identifiers → "+" → **Services IDs**. Será el `client_id` para GoTrue. Configurar dominios:
   - Primary App ID: el creado en paso 2.
   - Domains: `alexendros.pro`, `supabase.alexendros.pro`.
   - Return URL: `https://supabase.alexendros.pro/auth/v1/callback`.
4. Keys → "+" → Marcar "Sign In with Apple", asociar al primary App ID. Descargar `.p8` **una sola vez**. Anotar **Key ID** (10 chars) y **Team ID** (10 chars, visible en Membership).
5. Generar JWT client secret:
   ```bash
   APPLE_TEAM_ID=XXXXXXXXXX \
   APPLE_KEY_ID=KEY1234567 \
   APPLE_SERVICES_ID=com.alexendros.signin \
   APPLE_PRIVATE_KEY_PATH=~/secure/AuthKey_KEY1234567.p8 \
   pnpm dlx tsx infra/dokploy/supabase/scripts/gen-apple-secret.ts
   ```
6. Pegar en Dokploy:
   - `GOTRUE_EXTERNAL_APPLE_CLIENT_ID=com.alexendros.signin` (Services ID)
   - `GOTRUE_EXTERNAL_APPLE_SECRET=<JWT generado>`
   - `GOTRUE_EXTERNAL_APPLE_ENABLED=true`
7. Programar rotación:
   ```bash
   # En el VPS (ejemplo cron operador)
   0 4 1 */5 * /opt/alexendros/rotate-apple-secret.sh
   ```

## Smoke por provider

Tras cada redeploy, abrir incógnito:

- `https://alexendros.pro/login` → "Continuar con Google" → completa flujo → vuelve a `/auth/callback` con `code=...&state=...` → sesión activa.
- Repetir con GitHub y Apple.

Si Apple devuelve `invalid_client`: el JWT está caducado o el Services ID/Team ID no coincide.
