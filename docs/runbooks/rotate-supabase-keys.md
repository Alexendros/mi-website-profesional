# Runbook: Rotación de claves Supabase

- Versión: 1.0 · 2026-05-10
- Frecuencia recomendada: trimestral o inmediatamente tras sospecha de compromiso
- Tiempo estimado: 15-25 min

---

## Claves a rotar

| Variable | Descripción | Criticidad |
|----------|-------------|-----------|
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key — bypasa RLS | Crítica |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública | Media |
| `DATABASE_URL` | Pooler string (contiene password) | Crítica |
| `DIRECT_URL` | Direct string (contiene password) | Crítica |

> La `NEXT_PUBLIC_SUPABASE_URL` no es secreta — no requiere rotación.

---

## Paso 1: Regenerar claves en Supabase

1. Supabase Dashboard → Project → Settings → API
2. Sección "Project API keys" → Clic en "Reveal" → comparar con `.env.local`
3. Para rotar: **no hay botón de roll** — debes rotar la password de DB (que afecta a `DATABASE_URL` y `DIRECT_URL`)

### Rotar password de base de datos

1. Supabase Dashboard → Project → Settings → Database
2. "Reset database password" → generar nueva contraseña
3. **Actualizar INMEDIATAMENTE** `DATABASE_URL` y `DIRECT_URL` — la anterior deja de funcionar al instante

### Service Role Key

La service role key no se puede rotar aisladamente en Supabase (está ligada al proyecto). Si está comprometida:
1. Considera crear un nuevo proyecto Supabase y migrar (caso extremo)
2. Contacta a Supabase Support para opciones de rotación de emergencia
3. En tanto: restringir en código todos los paths que usan `supabaseAdmin`

---

## Paso 2: Actualizar en Vercel

```bash
# Para cada variable comprometida:
vercel env rm SUPABASE_SERVICE_ROLE_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

vercel env rm DATABASE_URL production
vercel env add DATABASE_URL production

vercel env rm DIRECT_URL production
vercel env add DIRECT_URL production
```

## Paso 3: Verificar conexión Prisma

```bash
# En local con nuevas vars:
pnpm --filter=@repo/db prisma db pull
# Debe completarse sin error

# Verificar pool:
pnpm --filter=@repo/db prisma migrate status
```

## Paso 4: Redeploy

```bash
vercel --prod
```

## Paso 5: Verificar

- Login en alexendros.pro → confirmar que Supabase Auth funciona
- Verificar que queries tRPC retornan datos correctos
- Revisar Sentry en los 10 min post-deploy por errores de conexión DB

---

## Rotación de emergencia — service role key comprometida (Threat I-02)

1. Notificar a Supabase Support inmediatamente
2. Auditar Supabase Logs → API Logs para detectar queries no autorizadas
3. Si hay acceso a datos de usuarios → iniciar protocolo RGPD Art. 33 (notificación AEPD < 72h)
4. Revisar RLS policies para asegurarse de que el acceso was efectivamente bypassed o no
5. Completar postmortem
