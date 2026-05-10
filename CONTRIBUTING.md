# Contribución a alexendros-pro

Este monorepo es mantenido principalmente por Alexendros. Las instrucciones siguientes aplican tanto para trabajo en solitario como para futuros colaboradores.

## Antes de empezar

- Lee el [Código de Conducta](CODE_OF_CONDUCT.md).
- Si tu aportación afecta a la arquitectura o a una decisión transversal, documenta la decisión en `docs/adr/` antes de implementar.
- Abre un issue describiendo el problema antes de trabajar en algo nuevo para evitar trabajo duplicado.

---

## Flujo de trabajo obligatorio

```
feature branch → PR → CI verde → code review → merge a main
```

**Nunca commits directos a `main`.** Sin excepciones.

### Crear una rama

```bash
git checkout -b feat/descripcion-corta
git checkout -b fix/descripcion-bug
git checkout -b chore/descripcion-tarea
```

---

## Setup local

```bash
# Pre-requisitos: Node.js 24+, pnpm 10+
node --version  # >= 24.0.0
pnpm --version  # >= 10.0.0

# Instalar dependencias
pnpm install

# Variables de entorno
cp apps/alexendros-pro/.env.example apps/alexendros-pro/.env.local
# Rellenar con credenciales reales (Supabase, Stripe, etc.)

# Dev
pnpm dev --filter=alexendros-pro

# Tests
pnpm turbo test
pnpm turbo test:e2e
```

---

## Gates de CI obligatorios

Toda PR debe pasar **todos** estos checks antes del merge:

| Gate | Comando | Criterio |
|------|---------|---------|
| Lint | `pnpm turbo lint` | 0 errores, 0 warnings ESLint |
| Typecheck | `pnpm turbo typecheck` | 0 errores TypeScript strict |
| Unit tests | `pnpm turbo test` | 100% passing |
| Build | `pnpm turbo build` | Build exitoso en todos los paquetes |
| Dependency audit | `pnpm audit --audit-level=high` | 0 vulnerabilidades high/critical |
| E2E | `pnpm turbo test:e2e` | Playwright passing (landing, a11y, responsive) |
| Lighthouse CI | `npx @lhci/cli@0.14.x autorun` | Performance ≥ 90, A11y ≥ 90 |

---

## Tests obligatorios por tipo de cambio

### Cambios en schema Prisma / tablas Supabase

Toda migración debe incluir tests que verifiquen RLS:

```typescript
// Ejemplo: tests/rls/user-profile.test.ts
it("usuario A no puede leer perfil de usuario B", async () => {
  const userAClient = createServerClient({ userId: userA.id });
  const result = await userAClient.from("Profile").select().eq("user_id", userB.id);
  expect(result.data).toHaveLength(0); // RLS debe filtrar
});
```

Los tests de RLS corren contra **Postgres real** (Docker local o Supabase test project). No mocks.

### Cambios en webhooks Stripe

Todo handler de webhook debe incluir un test que verifique la firma:

```typescript
// tests/webhooks/stripe-signature.test.ts
it("rechaza webhook sin firma válida", async () => {
  const res = await fetch("/api/webhooks/stripe", {
    method: "POST",
    body: JSON.stringify({ type: "checkout.session.completed" }),
  });
  expect(res.status).toBe(400);
});
```

### Cambios en tRPC procedures protegidos

```typescript
it("procedure protegido retorna UNAUTHORIZED sin sesión", async () => {
  const caller = createCaller({ session: null });
  await expect(caller.user.getProfile()).rejects.toThrow("UNAUTHORIZED");
});
```

### Cambios en endpoints con rate limiting

```typescript
it("endpoint retorna 429 tras superar rate limit", async () => {
  // N+1 requests → último retorna 429
});
```

---

## Reglas de código (resumen)

- TypeScript `strict: true` — prohibido `any`, `@ts-ignore`, `as any`
- Server Components por defecto — `"use client"` solo para interactividad browser
- Colores únicamente via CSS vars (`--color-*`) — hardcoded = bloqueo en review
- `process.env` prohibido directo — importar desde `@repo/config/env`
- Datos personales solo con base legal explícita (RGPD Art. 6)
- PostHog/analytics: no inicializar hasta `consent_given=1`
- IDs Stripe: nunca hardcodeados, siempre desde env vars

---

## Convenciones de commits

Formato: `type(scope): descripción corta`

```
feat(stagekit): añadir modal de booking
fix(auth): corregir redirección post-login
chore(ci): actualizar Node.js a 24
docs(adr): añadir ADR-0007 sobre rate limiting
refactor(db): extraer factory de Supabase client
test(rls): añadir tests de aislamiento de tenant
```

Los commits deben ir firmados (SSH o GPG):

```bash
git config --global commit.gpgsign true
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
```

---

## Pre-PR checklist

```
[ ] Branch parte de main actualizado
[ ] pnpm turbo lint typecheck test build pasa localmente
[ ] Si hay cambio de schema: migration creada y tests de RLS añadidos
[ ] Si hay webhook nuevo: test de firma añadido
[ ] Si hay datos personales nuevos: base legal documentada (RGPD Art. 6)
[ ] Si hay nuevo endpoint público: rate limiting aplicado
[ ] PR description incluye: qué, por qué, cómo verificar
```

---

## Reportar vulnerabilidades

No las publiques en issues. Sigue lo descrito en [SECURITY.md](SECURITY.md) y el runbook [docs/runbooks/secret-revoke.md](docs/runbooks/secret-revoke.md).

## Contacto

Para dudas sobre el proceso escribe a contacto@alexendros.pro.
