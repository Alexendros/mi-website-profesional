# ADR-0003 · Supabase self-hosted sobre Dokploy

- Fecha: 2026-05-28
- Estado: Aceptado
- Decisor: Alexendros (operador)
- Supersede: [ADR-0002 · Supabase + Prisma 5 como capa de datos](0002-supabase-prisma.md)

## Contexto

ADR-0002 fijó Supabase Cloud (eu-west-1 Frankfurt) como capa gestionada de Auth + Postgres. Tras avanzar con el aprovisionamiento del VPS Hostinger EU y disponer de **Dokploy ya operativo** (Traefik + Docker Compose + Let's Encrypt), revisamos la decisión por:

1. Coste predecible (VPS único compartido con n8n previsto en Fase 7.5) frente a límites de free tier de Supabase Cloud.
2. Control total sobre datos personales: el dato no sale de un entorno bajo nuestro contrato con Hostinger (Art. 28 RGPD, DPA firmable).
3. Independencia frente a cambios de pricing o políticas de Supabase Cloud.
4. Conocimiento operativo: el operador ya gestiona Dokploy, n8n y Traefik en el mismo VPS.

## Decisión

Desplegar **Supabase self-hosted** mediante el `docker-compose.yml` oficial upstream (`supabase/supabase`) como _Compose Service_ dentro de Dokploy. Endpoint público único: `supabase.alexendros.pro` (Kong). Studio en `studio.supabase.alexendros.pro` con basic-auth + IP allowlist. Postgres directo (puerto 5432) expuesto exclusivamente a IPs del operador vía firewall Hostinger; el pooler **Supavisor** (puerto 6543) se expone vía Traefik TCP router con TLS passthrough para conexiones Prisma desde Vercel.

Prisma 5 sigue siendo el ORM. `@supabase/ssr` sigue siendo el cliente de Auth. Cambia únicamente el _runtime_ y la operación.

## Arquitectura

```
┌──────────────────────── Vercel (Next.js 16) ──────────────────────────┐
│  apps/alexendros-pro                                                  │
│    - proxy.ts → updateSession + getUser()                             │
│    - @supabase/ssr (createServerClient / createBrowserClient)         │
│    - Prisma 5 → DATABASE_URL (pooler 6543) / DIRECT_URL (5432)        │
└────────────────────────────────┬──────────────────────────────────────┘
                                 │ HTTPS / TLS pgwire
                                 ▼
┌─────────────────────────── Hostinger VPS EU ──────────────────────────┐
│  Dokploy (Traefik + Docker)                                           │
│   ├── HTTPS supabase.alexendros.pro      → kong:8000                  │
│   │     /auth/v1 (GoTrue) /rest/v1 (PostgREST)                        │
│   │     /realtime/v1 (Realtime) /storage/v1 (Storage)                 │
│   ├── HTTPS studio.supabase.alexendros.pro → studio:3000              │
│   │     middleware: basicAuth + ipAllowList + noindex                 │
│   ├── TCP   db.supabase.alexendros.pro:6543 → supavisor:6543          │
│   │     TLS passthrough (Prisma serverless, connection_limit=1)       │
│   ├── (firewall) db.supabase.alexendros.pro:5432 → postgres:5432      │
│   │     IP allowlist (operador) — sólo prisma migrate                 │
│   └── n8n (Fase 7.5) — mismo dokploy-network                          │
└────────────────────────────────────────────────────────────────────────┘
```

## Consecuencias

- **Operativas**: snapshots semanales Dokploy + `pg_dump` diario cifrado con `restic` a Hostinger Object Storage; restore probado mensualmente en VPS staging.
- **Seguridad**: rotación `JWT_SECRET` programada cada 12 meses con runbook (invalidar sesiones). Rotación JWT client secret de Apple cada 6 meses por cron.
- **Compliance**: tratamiento "Auth self-hosted en VPS Hostinger" añadido al RoPA (`docs/legal/ropa.md`); DPA firmado con Hostinger archivado fuera de git.
- **Coste**: VPS único (~12 EUR/mes) + Apple Developer Program 99 USD/año (Sign in with Apple).
- **Riesgo aceptado**: sin PITR nativo (Cloud lo ofrece) hasta migrar a `wal-g` post-MVP; SLA acoplado al VPS — mitigado con monitor Better Uptime + plan de failover documentado.
- **Prisma se mantiene**: las consecuencias técnicas del ADR-0002 sobre `getUser()` vs `getSession()`, `force-dynamic`, mutaciones vía Prisma y migraciones sólo por `prisma migrate dev` siguen plenamente vigentes.

## Alternativas evaluadas y descartadas en esta revisión

| Alternativa | Motivo de descarte |
|---|---|
| Mantener Supabase Cloud (ADR-0002) | Coste por proyecto al escalar a 3 kits + dependencia de free tier; menor control sobre dato. |
| Postgres puro sobre Dokploy + Lucia/NextAuth | Hay que reescribir auth, OAuth y email confirm; pierde Storage y Realtime; mayor superficie de mantenimiento. |
| Dokploy en dev/staging + Cloud en prod | Doble operativa, dos versiones de Postgres a mantener sincronizadas; el operador prefiere una sola fuente de verdad. |

## Plan de implementación

Ver `ROADMAP.md` (Fase 4, sub-fases 4.0–4.7) y plan operativo en `/home/alexendros/.claude/plans/hay-que-levantar-supabase-idempotent-dusk.md`.

## Verificación

- `curl -fsSL https://supabase.alexendros.pro/auth/v1/health` → `{"name":"GoTrue", ...}`.
- `psql "$DIRECT_URL" -c "select 1"` desde IP del operador.
- `pnpm --filter=@repo/db prisma migrate status` limpio.
- `bash scripts/audit/20-db-schema.sh` retorna 0.
- Studio responde 401 sin basic-auth.
- Postgres puerto 5432 no accesible desde IPs ajenas al firewall.
