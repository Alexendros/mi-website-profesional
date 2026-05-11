# Runbook: Restauración de base de datos

- Versión: 1.0 · 2026-05-10
- Tiempo estimado: 30-90 min (dependiendo del escenario)

---

## Escenarios cubiertos

1. **Migración fallida** — `prisma migrate dev` dejó DB en estado inconsistente
2. **Datos corruptos** — error en lógica de negocio que modificó datos incorrectamente
3. **Eliminación accidental** — `DROP TABLE` o `DELETE` sin WHERE
4. **Supabase outage** — servicio no disponible

---

## Escenario 1: Migración fallida

Supabase no tiene transacciones DDL automáticas. Si `prisma migrate dev` falla a mitad:

```bash
# 1. Ver estado actual
pnpm --filter=@repo/db prisma migrate status

# 2. Si hay una migración "failed":
pnpm --filter=@repo/db prisma migrate resolve --rolled-back <migration_name>
# Esto marca la migración como revertida en _prisma_migrations

# 3. Corregir el schema.prisma y volver a intentar
pnpm --filter=@repo/db prisma migrate dev --name fix_<descripcion>
```

Si la migración dejó tablas en estado inconsistente:
```bash
# Conectar con DIRECT_URL (no pooler) para DDL
# Supabase Dashboard → SQL Editor → revertir cambios manualmente
# Luego resolver la migración en Prisma
```

---

## Escenario 2: Restaurar desde backup Supabase

Supabase Pro tiene Point-in-Time Recovery. Para el plan gratuito, hay backups diarios:

1. Supabase Dashboard → Project → Settings → Backups
2. Seleccionar backup point → "Restore"

> **Atención**: la restauración reemplaza TODA la base de datos. Exportar datos recientes primero si es posible.

```bash
# Exportar datos actuales antes de restaurar (si el servicio está parcialmente operativo)
pg_dump "$DIRECT_URL" --no-owner --no-acl -f backup_pre_restore_$(date +%Y%m%d_%H%M).sql
```

---

## Escenario 3: Eliminación accidental

```bash
# Si es reciente y hay logs de Supabase con el query original:
# Supabase Dashboard → Logs → Postgres Logs

# Restaurar desde backup del día anterior (Escenario 2)
# O reconstruir datos desde audit logs si están implementados

# Si la tabla no existe pero el schema sí:
pnpm --filter=@repo/db prisma migrate deploy
# Recreará la estructura (sin datos)
```

---

## Escenario 4: Supabase outage

1. Verificar estado: https://status.supabase.com
2. Si es outage regional (eu-west-1 Frankfurt):
   - Vercel continuará sirviendo páginas cacheadas (ISR)
   - Las rutas que requieren DB retornarán error — es esperado
   - No hay failover automático en MVP
3. Cuando el servicio restaure, verificar que las conexiones de pool se restablecen:
   ```bash
   # Hacer una query de prueba via tRPC playground o curl
   curl -X POST https://alexendros.pro/api/trpc/health.check
   ```

---

## Verificación post-restauración

```bash
# 1. Comprobar integridad de Prisma
pnpm --filter=@repo/db prisma migrate status
# Expected: "All migrations have been applied"

# 2. Comprobar conteo de registros clave
# En Supabase Dashboard → Table Editor → verificar filas en tablas críticas

# 3. Login de prueba en alexendros.pro
# 4. Crear una suscripción de prueba en Stripe Test Mode
# 5. Verificar que el webhook se procesa correctamente
```

---

## Contacto soporte

- Supabase Support: https://supabase.com/support
- Estado servicio: https://status.supabase.com
- Slack comunidad Supabase: #help-postgres
