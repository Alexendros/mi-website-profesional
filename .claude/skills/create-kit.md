# Skill: create-kit
# Uso: cuando hay que anadir un Kit nuevo al monorepo

## Pasos numerados (ejecutar en orden)

1. **Scaffold app Next.js en monorepo**
```bash
cd apps/
pnpm create next-app@latest <kit-name> --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

2. **Crear CLAUDE.md especifico del Kit**
```bash
cat > apps/<kit-name>/CLAUDE.md << 'EOF'
# CLAUDE.md — <KitName>
## Contexto del Kit
- Audiencia: [definir]
- Dominio: [definir]
- Theme token: [definir en packages/brand/tokens.ts]
- Planes: [Free/Pro/Agency o equivalentes]
## Reglas especificas
- Paleta de colores: usar SOLO tokens de packages/brand con prefijo <kit-name>-*
- Copywriting: tono [definir segun audiencia]
- Compliance adicional: [regulaciones sectoriales si aplica]
EOF
```

3. **Registrar Kit en packages/db/prisma/schema.prisma**
```typescript
// Anadir seed entry para el nuevo Kit
// Archivo: packages/db/prisma/seed.ts
await prisma.kit.create({
  data: {
    id: '<kit-slug>',
    name: '<KitName>',
    domain: '<domain>',
    status: 'COMING_SOON',
    config: {}
  }
})
```

4. **Anadir tokens de color en packages/brand/tokens.ts**
```typescript
<kitSlug>: {
  accent: '',
  secondary: '',
  surface: '',
  text: '',
}
```

5. **Crear planes en Stripe Dashboard**
- Crear Producto: "<KitName> Pro" + "<KitName> Agency" (u equivalentes)
- Copiar Price IDs
- Anadir a `.env.local`: `STRIPE_PRICE_<KITNAME>_PRO=price_xxx`
- Anadir a `lib/stripe/kit-plans.ts`

6. **Configurar proyecto Vercel**
```bash
vercel link --project <kit-name>-app
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel domains add <domain> --project <kit-name>-app
```

7. **Verificacion final**
```bash
pnpm turbo build --filter=<kit-name>
# → Build exitoso sin errores TypeScript
# → Variables de entorno validadas por env.ts
# → Kit registrado en DB
```
