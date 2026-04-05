# Skill: deploy-vercel
# Uso: configurar deploy, nuevo dominio o primer setup de app en Vercel

## Setup inicial de app nueva

1. **Vincular proyecto**
```bash
cd apps/<app-name>
vercel link --project <app-name>
# Seleccionar: scope alexendros, proyecto existente o crear nuevo
```

2. **vercel.json (en raiz de la app)**
```json
{
  "buildCommand": "cd ../.. && pnpm turbo build --filter=<app-name>",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["mad1"]
}
```

3. **Variables de entorno en Vercel**
```bash
# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Stripe
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
# Email
vercel env add RESEND_API_KEY production
# Monitoring
vercel env add NEXT_PUBLIC_SENTRY_DSN production
vercel env add NEXT_PUBLIC_POSTHOG_KEY production
```

4. **Dominio custom**
```bash
vercel domains add <dominio.com> --project <app-name>
# → Apuntar DNS: CNAME @ cname.vercel-dns.com
# → Verificar con: vercel domains inspect <dominio.com>
```

5. **turbo-ignore (evitar deploys innecesarios)**
```json
{
  "ignoreCommand": "npx turbo-ignore <app-name>"
}
```

6. **Webhook Stripe en produccion**
```bash
stripe webhooks create \
  --url https://<dominio>/api/webhooks/stripe \
  --events checkout.session.completed,customer.subscription.updated,customer.subscription.deleted,invoice.payment_failed
# Copiar webhook secret → STRIPE_WEBHOOK_SECRET en Vercel
```

7. **Verificacion post-deploy**
```bash
# CWV
npx @unlighthouse/cli https://<dominio> --reporter json
# JSON-LD
curl -s https://<dominio> | grep -A 30 'application/ld+json'
# Headers de seguridad
curl -I https://<dominio> | grep -E 'X-Frame|Content-Type|Referrer'
```
