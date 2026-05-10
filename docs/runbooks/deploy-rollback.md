# Runbook: Rollback de deploy

- Versión: 1.0 · 2026-05-10
- Tiempo estimado: 2-5 min (Vercel instant rollback) / 15-30 min (rollback con migración)

---

## Cuándo hacer rollback

- Sentry muestra spike de errores 5xx post-deploy
- LCP > 4s o CLS > 0.25 en producción (Lighthouse CI regresión)
- Auth inaccesible post-deploy
- Webhooks Stripe fallando masivamente
- Errores de conexión DB en logs

---

## Rollback instantáneo en Vercel (sin migración de DB)

```bash
# Opción 1: via CLI
vercel rollback [deployment-url]
# Vercel lista las últimas deployments con 'vercel ls'

# Opción 2: via Dashboard
# Vercel Dashboard → Deployments → [deployment anterior] → "Promote to Production"
```

Este método es seguro cuando el rollback NO involucra un cambio de schema de DB.

---

## Rollback con migración de DB involucrada

> **Regla**: las migraciones de Prisma son **forward-only** por defecto.
> No hay `prisma migrate down` automático.

### Evaluación rápida (< 5 min)

1. ¿La migración añadió columnas nuevas? → Rollback de app es seguro (columna ignorada por código viejo)
2. ¿La migración eliminó o renombró columnas? → Rollback de app puede causar errores de query
3. ¿La migración modificó datos? → Rollback es complejo — evaluar caso por caso

### Si el rollback es seguro (caso 1)

```bash
# 1. Rollback de la app en Vercel (ver arriba)
# 2. La migración queda aplicada en DB — marcarla como "sin uso" por la versión anterior
# 3. Planificar migration de limpieza cuando re-deploy sea estable
```

### Si el rollback es complejo (casos 2 y 3)

```bash
# 1. Evaluar si el fix-forward es más rápido que el rollback
# Para 1 dev, casi siempre lo es.

# 2. Si se decide rollback de schema:
# Escribir una nueva migration que revierta el cambio
# NUNCA editar migraciones existentes en _prisma_migrations

# Ejemplo: si la migration borró una columna:
pnpm --filter=@repo/db prisma migrate dev --name rollback_drop_column_X
# En el migration SQL: ALTER TABLE "User" ADD COLUMN "X" TEXT;

# 3. Redeploy con la nueva migration + código anterior
```

---

## Fix-forward (alternativa preferida al rollback)

Para la mayoría de bugs post-deploy, un fix-forward es más rápido y menos arriesgado:

```bash
# 1. Identificar el commit del bug con 'git log --oneline -10'
# 2. Hacer el fix en una rama
git checkout -b fix/post-deploy-YYYY-MM-DD
# 3. Commit + push → CI/CD crea PR
# 4. Merge y deploy inmediato a producción
# Vercel despliega en ~2-3 min desde merge a main
```

---

## Post-rollback

1. Verificar en Sentry que los errores 5xx han cesado
2. Verificar que Stripe webhooks llegan y se procesan
3. Hacer un login de prueba
4. Crear issue/ticket con el bug detectado
5. Si el rollback fue por regresión de rendimiento: re-ejecutar Lighthouse CI manualmente
