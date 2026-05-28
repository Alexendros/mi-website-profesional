/**
 * Genera JWT_SECRET + ANON_KEY + SERVICE_ROLE_KEY para Supabase self-hosted.
 *
 * Uso (local, NUNCA en CI):
 *   pnpm dlx tsx infra/dokploy/supabase/scripts/gen-jwt.ts > /tmp/sb-keys.json
 *
 * El secret tiene 64 bytes base64url. Los tokens caducan en 10 años:
 * el operador rota cuando lo decide (ver RUNBOOK-rotate-jwt.md), no
 * por expiración silenciosa.
 *
 * Requiere: jose (peer dep). Si no está, instalar con `pnpm add -w -D jose`.
 */

import { randomBytes } from "node:crypto";
import { SignJWT } from "jose";

const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;

async function main(): Promise<void> {
  const secretBytes = randomBytes(64);
  const secret = secretBytes.toString("base64url");
  const key = new Uint8Array(secretBytes);
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TEN_YEARS_SECONDS;

  const anon = await new SignJWT({ role: "anon", iss: "supabase" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(key);

  const serviceRole = await new SignJWT({ role: "service_role", iss: "supabase" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(key);

  const out = {
    JWT_SECRET: secret,
    ANON_KEY: anon,
    SERVICE_ROLE_KEY: serviceRole,
    generated_at: new Date(iat * 1000).toISOString(),
    expires_at: new Date(exp * 1000).toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main().catch((err: unknown) => {
  process.stderr.write(`gen-jwt fallo: ${(err as Error).message}\n`);
  process.exit(1);
});
