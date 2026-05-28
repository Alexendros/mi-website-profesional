# Cierre Fase 4 · Supabase self-hosted sobre Dokploy

> Plantilla. Rellenar conforme se vayan completando bloques.
> Cuando todo está en verde, mover el bloque correspondiente del `ROADMAP.md` a "Completado" y enlazar este runbook desde `.planning/STATE.md`.

## Identificación

- Owner: Alejandro Domingo Agustí
- ADR vigente: 0003 (supersede 0002)
- Plan ejecutivo: `~/.claude/plans/hay-que-levantar-supabase-idempotent-dusk.md`
- Fecha de apertura: <YYYY-MM-DD>
- Fecha de cierre: <YYYY-MM-DD>
- PR merge: #<num>

## Bloque 1 · Preparación

| Ítem | Resultado | Fecha | Notas |
|---|---|---|---|
| 1.1 Preflight VPS (13/13) | | | enlace a `infra/dokploy/PREFLIGHT.md` con tabla rellena |
| 1.2 DNS resolviendo | | | `dig +short` × 3 hostnames |
| 1.3 OAuth Google | | | client_id último 4 dígitos |
| 1.3 OAuth GitHub | | | |
| 1.3 OAuth Apple | | | Team ID, Key ID, Services ID anotados |
| 1.4 Secretos generados | | | hash de los JWTs (no el valor) |
| 1.5 IPs allowlist | | | número de IPs |
| DPA Hostinger solicitado | | | número de referencia |

## Bloque 2 · Ejecución

| Ítem | Resultado | Fecha | Notas |
|---|---|---|---|
| 2.1 Compose desplegado (11 contenedores healthy) | | | `docker ps` snapshot |
| 2.2 Studio basic-auth + ipAllowList | | | smoke 401 |
| 2.3 Firewall Postgres directo | | | smoke timeout desde IP externa |
| 2.4 `.env.local` rellenado | | | confirmar `.gitignore` |
| 2.5 Migraciones aplicadas (5/5) | | | `prisma migrate status` salida |
| 2.6 Seed idempotente (2 corridas) | | | conteo Kits/Plans/Prices |
| 2.7 Build local verde | | | duración build |

## Bloque 3 · Verificaciones

| Comando | Resultado | Fecha |
|---|---|---|
| `curl /auth/v1/health` | GoTrue 200 | |
| `curl /rest/v1/` | 200 con apikey | |
| `curl studio.*/` | 401 | |
| `psql DIRECT_URL select 1` | 1 | |
| `select count(*) from kits` | 3 | |
| RLS · rowsecurity=false | vacío | |
| RLS · count(pg_policies) | ≥ 18 | |
| Index `audit_log_stripe_event_unique` | presente | |
| `nc -zv 5432` desde IP externa | timeout | |
| `bash scripts/audit/99-report.sh` | rc 0 | |
| `grep getSession()` | vacío (CP-01) | |
| `grep NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | vacío (CP-03) | |
| `gitleaks detect` | 0 findings | |

## Bloque 4 · Testing final

| Smoke | Resultado | Captura |
|---|---|---|
| Playwright magic link CI | | enlace al run |
| Email+password | | |
| Magic link manual | | |
| Google OAuth | | |
| GitHub OAuth | | |
| Apple OAuth | | |
| Backup noche 1 | | |
| Backup noche 2 | | |
| Backup noche 3 | | |
| Restore en staging | | |
| Rotación JWT en staging | | |

## Bloque 5 · Cierre legal y documental

- [ ] PR mergeado: <enlace>
- [ ] ROADMAP.md actualizado: Fase 4 en "Completado"
- [ ] DPA Hostinger archivado: `~/Documentos/legal/dpa-hostinger-<fecha>.pdf`
- [ ] RoPA actualizado con eventos
- [ ] `.planning/STATE.md` snapshot publicado

## Lo que arrastramos a Fase 5

> Cualquier cosa que se haya pospuesto pero no rompa el cierre va aquí.
> Cada ítem requiere ticket explícito y dueño antes de iniciar Fase 5.

- [ ] WAL archiving con `wal-g` (post-MVP) → ticket #<n>
- [ ] Multi-región failover documentado → ticket #<n>
- [ ] Monitor Better Uptime configurado → ticket #<n>

## Métricas técnicas registradas

- LCP `/login` (lab): __ s
- Tiempo medio magic link → sesión activa: __ s
- Backups exitosos: __ / 7
- Tiempo total de la fase: __ días hábiles
