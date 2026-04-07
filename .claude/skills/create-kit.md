# Skill: create-kit
# Uso: cuando hay que añadir un Kit nuevo al monorepo
# Activar con: /skills create-kit

## Pasos numerados (ejecutar en orden)

1. **Scaffold app Next.js en monorepo**
```bash
cd apps/
pnpm create next-app@latest <kit-name> --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

2. **Crear CLAUDE.md específico del Kit**
```bash
cat > apps/<kit-name>/CLAUDE.md << 'EOF'
# CLAUDE.md — <KitName>
## Contexto del Kit
- Audiencia: [definir]
- Dominio: [definir]
- Theme token: [definir en packages/brand/tokens.ts]
- Planes: [Free/Pro/Agency o equivalentes]
## Reglas específicas
- Paleta de colores: usar SOLO tokens de packages/brand con prefijo <kit-name>-*
- Copywriting: tono [definir según audiencia]
- Compliance adicional: [regulaciones sectoriales si aplica]
EOF
```

3. **Registrar Kit en packages/db/prisma/schema.prisma**
```typescript
// Añadir seed entry para el nuevo Kit
// Archivo: packages/db/prisma/seed.ts
await prisma.kit.create({
  data: {
    id: '<kit-slug>',          // 'lexkit'
    name: '<KitName>',         // 'LexKit'
    domain: '<domain>',        // 'lexkit.pro'
    status: 'COMING_SOON',
    config: {}
  }
})
```

4. **Añadir tokens de color en packages/brand/tokens.ts**
```typescript
<kitSlug>: {
  accent: '',        // color principal del Kit
  secondary: '',
  surface: '',
  text: '',
}
```

5. **Crear planes en Stripe Dashboard**
- Crear Producto: "<KitName> Pro" + "<KitName> Agency" (u equivalentes)
- Copiar Price IDs
- Añadir a `.env.local`: `STRIPE_PRICE_<KITNAME>_PRO=price_xxx`
- Añadir a `lib/stripe/kit-plans.ts`

6. **Configurar proyecto Vercel**
```bash
vercel link --project <kit-name>-app
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel domains add <domain> --project <kit-name>-app
```

7. **Verificación final**
```bash
pnpm turbo build --filter=<kit-name>
# → Build exitoso sin errores TypeScript
# → Variables de entorno validadas por env.ts
# → Kit registrado en DB: pnpm --filter=@repo/db prisma studio
```
