# SQL bruto aplicable tras migraciones Prisma

`prisma migrate` genera migraciones desde el `schema.prisma`. Las políticas RLS,
los triggers que tocan `auth.users` y los índices parciales no se modelan en
Prisma — los aplicamos como SQL bruto.

## Orden de aplicación

```
0001_init                       (prisma migrate dev)
0002_kits_plans_seed            (prisma migrate dev --create-only + edición)
0003_auth_user_sync.sql         (prisma migrate dev --create-only + cuerpo SQL)
0004_rls_policies.sql           (prisma migrate dev --create-only + cuerpo SQL)
0005_indices_partials.sql       (prisma migrate dev --create-only + cuerpo SQL)
```

Para los pasos 0003-0005, usar el flujo `--create-only`:

```bash
pnpm --filter=@repo/db prisma migrate dev --create-only --name 0003_auth_user_sync
# editar el migration.sql generado y pegar el contenido de sql/0003_auth_user_sync.sql
pnpm --filter=@repo/db prisma migrate dev
```

Repetir para 0004 y 0005. El propósito de mantener una copia en `sql/` es:
1. Diff legible sin abrir el directorio de migraciones.
2. Reaplicar a entornos efímeros (CI/staging) con `psql "$DIRECT_URL" -f`.
3. Auditar via `scripts/audit/20-db-schema.sh`.

## Verificación

```bash
psql "$DIRECT_URL" -c "select count(*) from pg_policies where schemaname='public'"
# esperado: >= 18 (al menos las definidas en 0004)
psql "$DIRECT_URL" -c "select tablename from pg_tables where schemaname='public' and rowsecurity=false"
# esperado: vacío (todas las tablas con RLS habilitada)
```
