# Runbook · Rotar `JWT_SECRET` (Supabase self-hosted)

> Rotación obligatoria cada 12 meses o ante sospecha de compromiso.
> **Efecto**: invalida TODAS las sesiones activas (cookies `sb-*` y refresh tokens).
> Programar ventana de mantenimiento (≤ 10 min) fuera de horas pico.

## Pasos

1. **Aviso**: publicar banner en `alexendros.pro` "Mantenimiento breve, sesiones requerirán login" (T-30 min).
2. **Generar nuevo material**:
   ```bash
   pnpm dlx tsx infra/dokploy/supabase/scripts/gen-jwt.ts > /tmp/sb-keys-new.json
   ```
   Copiar `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY`.
3. **Actualizar Dokploy UI**:
   - Reemplazar `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY` en el Environment del compose `supabase`.
4. **Redeploy desde Dokploy** (Compose Service → Redeploy).
5. **Actualizar Vercel**:
   - Reemplazar `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` en cada Project Vercel afectado (alexendros-pro y futuras apps).
   - Disparar Redeploy de Vercel (no requiere rebuild si sólo cambian env vars; revisar).
6. **Smoke**:
   ```bash
   set -Eeuo pipefail
   curl -fsSL https://supabase.alexendros.pro/auth/v1/health | jq -r .name   # GoTrue
   curl -fsSL https://supabase.alexendros.pro/rest/v1/ -H "apikey: $NEW_ANON" -o /dev/null -w '%{http_code}\n'  # 200
   ```
7. **Verificar app**: login nuevo en alexendros.pro; sesión válida; tRPC `auth.me` responde.
8. **Quitar banner**.
9. **Anotar rotación** en `docs/legal/ropa.md` (registro de actividades).

## Rollback

Si tras la rotación los clientes Vercel devuelven 401 sistemáticos:

1. Restaurar los valores anteriores en Dokploy + Vercel.
2. Redeploy ambos.
3. Investigar: probable JWT firmado con secret antiguo cacheado en algún edge worker. Limpiar cache CDN si aplica.

## Calendario

| Fecha | Operador | Resultado |
|---|---|---|
| YYYY-MM-DD | Alejandro | OK / Rollback |
