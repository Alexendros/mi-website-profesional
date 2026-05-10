# Runbook: Revocación de secretos comprometidos

- Versión: 1.0 · 2026-05-10
- Aplicar: si se detecta un secreto en código fuente, en logs, o en una PR pública

---

## Detección

Señales de alerta:
- GitHub Secret Scanning alerta (si está habilitado)
- Sentry muestra variables de entorno en stack trace
- `git log --all -p | grep "sk_live_"` retorna resultados
- Un secreto aparece en una PR pública accidentalmente

---

## Protocolo de respuesta (orden estricto)

### 1. Revocar ANTES de limpiar el repo

> **Regla crítica**: limpiar el historial git no revoca el secreto. Un atacante puede tener ya la copia.
> Revocar primero, limpiar después.

| Secreto | Cómo revocar |
|---------|-------------|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys → Roll/Delete |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → [endpoint] → Roll |
| `SUPABASE_SERVICE_ROLE_KEY` | Contactar Supabase Support o regenerar desde Dashboard |
| `DATABASE_URL` password | Supabase → Settings → Database → Reset password |
| `RESEND_API_KEY` | Resend Dashboard → API Keys → Delete |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Console → Database → Reset credentials |
| GitHub PAT | GitHub → Settings → Developer Settings → Tokens → Delete |
| Vercel token | Vercel → Settings → Tokens → Delete |

### 2. Limpiar el historial git

```bash
# Herramienta recomendada: git-filter-repo (más segura que BFG)
pip install git-filter-repo

# Reemplazar el secreto comprometido en TODO el historial
git filter-repo --replace-text <(echo "sk_live_XXXXX==>REDACTED_SECRET")

# Forzar push (requiere confirmación del equipo si hay más devs)
git push origin --force --all
git push origin --force --tags
```

> Si el repo es público en GitHub: abrir un Support ticket en GitHub para purgar caches de búsqueda.

### 3. Añadir al `.gitignore` / pre-commit hook

```bash
# Verificar que .env* está en .gitignore
grep "\.env" .gitignore

# Si no está:
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore
```

Considerar instalar `git-secrets` o `truffleHog` como pre-commit hook para prevención futura.

### 4. Auditar el período de exposición

```bash
# ¿Cuándo se introdujo el secreto?
git log --all --full-history -p -- "**/.env*" | grep -A5 -B5 "sk_live"

# Revisar Stripe Dashboard → Events en el período de exposición
# Revisar Supabase Logs en el período
```

### 5. Generar nuevas credenciales y redeployar

Ver runbooks específicos:
- `rotate-stripe-keys.md`
- `rotate-supabase-keys.md`

### 6. Postmortem

Crear postmortem con `postmortem-template.md`. Incluir:
- Vector de exposición (¿PR pública? ¿log? ¿error page?)
- Período de exposición estimado
- Evidencia de uso no autorizado (si aplica)
- Medidas preventivas implementadas
