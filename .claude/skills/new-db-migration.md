# Skill: new-db-migration
# Uso: cualquier cambio en schema Prisma, agregar/modificar modelos, relaciones

## Proceso obligatorio (NO saltarse pasos)

1. **Leer estado actual**
```bash
cat packages/db/prisma/schema.prisma
```

2. **Documentar el cambio antes de ejecutar**
```
Que tabla/modelo cambia? →
Por que? (justificacion de negocio) →
Afecta a datos existentes? →
Requiere data migration? →
```

3. **Editar schema.prisma**
- Anadir `// RGPD Art.6.1.X` si el campo almacena datos personales
- Anadir `@@index` para campos de busqueda frecuente
- Anadir `@@map("snake_case")` en todo modelo nuevo

4. **Ejecutar migracion**
```bash
pnpm --filter=@repo/db prisma migrate dev --name <descripcion-clara-en-ingles>
# Ejemplo: --name add-audit-log-table
# Ejemplo: --name add-affiliate-commission-rate
```

5. **Aplicar RLS en Supabase** (OBLIGATORIO en tablas nuevas)
```sql
-- Ejecutar en Supabase SQL Editor
ALTER TABLE public.<tabla> ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_own_data" ON public.<tabla>
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "service_role_bypass" ON public.<tabla>
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

6. **Generar tipos TypeScript**
```bash
pnpm --filter=@repo/db prisma generate
```

7. **Test de RLS**
```bash
# Verificar con Supabase anon key (SIN JWT) → debe devolver 0 filas
curl -H "apikey: $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/<tabla>?select=*" | jq 'length'
# Resultado esperado: 0
```

8. **Build global**
```bash
pnpm turbo build --filter=@repo/db
```
