# Runbook: Respuesta a incidentes de seguridad

- Versión: 1.0 · 2026-05-10
- Oncall: Alexendros (spiderwebtraveler@gmail.com)
- Severidad: P0 (crítico) · P1 (alto) · P2 (medio)

---

## Clasificación de severidad

| Nivel | Criterio | Tiempo de respuesta |
|-------|----------|-------------------|
| P0 | Datos personales comprometidos, credenciales Stripe/Supabase expuestas, servicio caído en producción | < 1h |
| P1 | Fallo de auth, webhook Stripe no procesado, DB inaccesible | < 4h |
| P2 | Degradación de rendimiento, fallo de email, error no crítico en logs | < 24h |

---

## Protocolo P0 — Brecha de datos / credenciales comprometidas

### 1. Contener (0-15 min)
```bash
# Revocar credencial comprometida inmediatamente
# Si es SUPABASE_SERVICE_ROLE_KEY → ir a Supabase Dashboard > Settings > API > Regenerar
# Si es STRIPE_SECRET_KEY → ir a Stripe Dashboard > Developers > API Keys > Roll
# Si es VERCEL token → ir a Vercel > Settings > Tokens > Delete

# Desplegar variable nueva en Vercel
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# O via MCP: mcp__claude_ai_Vercel__ tools
```

### 2. Evaluar alcance (15-60 min)
```bash
# Revisar logs de acceso en Vercel
# Vercel Dashboard > Deployments > Runtime Logs

# Buscar accesos anómalos en Supabase
# Supabase Dashboard > Logs > API Logs (filtrar por status 500/401 inusuales)

# Revisar actividad Stripe en los últimas 24-48h
# Stripe Dashboard > Developers > Events
```

### 3. Notificar (si hay brecha de datos personales)
- **RGPD Art. 33**: notificar a la AEPD en < 72h si hay riesgo para derechos de usuarios
- **RGPD Art. 34**: notificar a los afectados si hay alto riesgo
- Contacto AEPD: https://sedeagpd.gob.es/sede-electronica-web/

### 4. Remediar y documentar
- Aplicar rotación completa (ver runbook `rotate-stripe-keys.md` / `rotate-supabase-keys.md`)
- Crear postmortem en < 48h (ver plantilla `postmortem-template.md`)

---

## Protocolo P1 — Fallo de servicio crítico

### Webhooks Stripe no procesados
```bash
# Verificar cola de eventos pendientes en Stripe
# Stripe Dashboard > Developers > Webhooks > [endpoint] > Recent Deliveries

# Re-entregar eventos fallidos desde Stripe Dashboard
# O usar CLI:
stripe events resend evt_xxx
```

### Auth inaccesible
```bash
# Verificar estado Supabase
# https://status.supabase.com

# Rollback si el fallo es post-deploy
# Ver runbook deploy-rollback.md
```

### DB inaccesible
```bash
# Ver runbook db-restore.md
```

---

## Post-incidente
1. Completar plantilla `postmortem-template.md` en < 48h
2. Actualizar `threat-model.md` con vector de ataque descubierto
3. Añadir test de regresión que cubra la vulnerabilidad
4. Si aplica: avisar a usuarios afectados (plantilla email en `packages/email/`)
