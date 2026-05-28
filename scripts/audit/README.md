# scripts/audit

Verificación infalible del estado del monorepo `alexendros-pro`. Cada script:

- Tiene shebang `#!/usr/bin/env bash`, `set -Eeuo pipefail`, `IFS=$'\n\t'`.
- Es idempotente, sin side-effects (sólo lectura + comprobaciones).
- Imprime líneas `OK:` / `WARN:` / `FAIL:` y termina con `RESULT: PASS|FAIL fase=<N>`.
- Sale con `0` si la fase está cerrada, `1` si hay `FAIL`, `2` si hay sólo `WARN`.
- Tras cualquier pipe usa `set -o pipefail` o consulta `${PIPESTATUS[0]}` (norma operador).

## Inventario

| Script | Fase | Qué verifica |
|---|---|---|
| `00-preflight.sh` | 0 | Toolchain (Node ≥ 20.9, pnpm 10+, Turbo 2, git limpio) |
| `10-stack-versions.sh` | 0/6 | Versiones reales en `package.json` vs canon (Next 16.2, React 19.2, Tailwind 4.1+, Prisma 5, tRPC v11, Supabase SSR, Stripe) |
| `20-db-schema.sh` | 4 | Modelos Prisma ≥ 11, RLS, `prisma migrate status`, seed sin PII |
| `30-stripe-funnel.sh` | 5 | Planes env, webhook firmado, idempotencia, templates Resend |
| `40-hub.sh` | 6 | Login E2E, rate limit 429, Sentry sin PII |
| `50-seo-cwv.sh` | 7 | Lighthouse, JSON-LD, `llms.txt`, sitemap, og:image |
| `60-n8n.sh` | 7.5 | `/healthz`, workflows activos, último run |
| `70-security.sh` | 8 | gitleaks, CSP, `npm audit`, Semgrep, RoPA |
| `99-report.sh` | - | Orquesta todos y emite tabla resumen |

## Uso

```bash
# Uno suelto
bash scripts/audit/20-db-schema.sh

# Pipeline completo
bash scripts/audit/99-report.sh

# Integrado en pnpm
pnpm -w run audit
```

## Salida tipo

```
OK:   Node 22.11.0 (≥ 20.9)
OK:   pnpm 10.33.0
WARN: stagekit sin código (apps/stagekit) — CI Playwright fallará
FAIL: Next.js 15.5.18 detectado, canon exige 16.2
RESULT: FAIL fase=0
```
