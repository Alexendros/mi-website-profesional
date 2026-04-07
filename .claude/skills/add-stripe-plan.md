# Skill: add-stripe-plan
# Uso: crear o modificar plan/precio en cualquier Kit
# Activar con: /skills add-stripe-plan

## Proceso

1. **Crear en Stripe Dashboard**
   - Products → Add product
   - Nombre: "<KitName> <PlanName>" (ej: "LexKit Pro")
   - Precio recurrente: mensual en EUR
   - Si tiene setup fee: precio adicional one-time
   - Copiar `price_xxx` ID del precio mensual
   - Copiar `price_yyy` ID del setup fee (si existe)

2. **Añadir env vars**
```bash
# .env.local
STRIPE_PRICE_<KITNAME>_<PLAN>=price_xxx
STRIPE_PRICE_<KITNAME>_<PLAN>_SETUP=price_yyy  # si aplica
# Vercel Dashboard → Environment Variables → Production
vercel env add STRIPE_PRICE_<KITNAME>_<PLAN> production
```

3. **Actualizar lib/stripe/kit-plans.ts**
```typescript
<kitSlug>: {
  <PLAN>: {
    id: '<kit>_<plan>',
    name: '<PlanName>',
    priceSetup: <número>,
    priceMonthly: <número>,
    stripePriceId: process.env.STRIPE_PRICE_<KIT>_<PLAN>!,
    stripeSetupPriceId: process.env.STRIPE_PRICE_<KIT>_<PLAN>_SETUP,
    features: [...],
    limits: {...},
    maintenanceSLA: '48h'
  }
}
```

4. **Añadir a env.ts (validación Zod)**
```typescript
STRIPE_PRICE_<KITNAME>_<PLAN>: z.string().min(1),
```

5. **Test en modo test**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# En otra terminal:
curl -X POST http://localhost:3000/api/checkout \
  -H 'Content-Type: application/json' \
  -d '{"planId": "<kit>_<plan>", "kitId": "<kitSlug>"}'
# → Usar card 4242 4242 4242 4242
# → Verificar webhook checkout.session.completed recibido
# → Verificar subscription creada en DB
```

6. **Actualizar pricing page del Kit**
```bash
# Regenerar componente pricing con nuevo plan
# Verificar que priceMonthly y features coinciden con Stripe Dashboard
```
