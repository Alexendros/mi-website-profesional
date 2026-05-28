/**
 * Genera el JWT "client secret" para Sign In with Apple.
 *
 * Apple firma el secret con la clave privada ES256 (.p8) que el operador descarga
 * UNA sola vez en developer.apple.com. El JWT tiene validez máxima de 6 meses
 * según política Apple → rotar cada ~150 días con cron.
 *
 * Uso:
 *   APPLE_TEAM_ID=ABCDE12345 \
 *   APPLE_KEY_ID=KEY1234567 \
 *   APPLE_SERVICES_ID=com.alexendros.signin \
 *   APPLE_PRIVATE_KEY_PATH=/secure/AuthKey_KEY1234567.p8 \
 *     pnpm dlx tsx infra/dokploy/supabase/scripts/gen-apple-secret.ts
 *
 * Imprime el JWT por stdout para pegarlo en GOTRUE_EXTERNAL_APPLE_SECRET (Dokploy).
 */

import { readFile } from "node:fs/promises";
import { SignJWT, importPKCS8 } from "jose";

interface AppleEnv {
  teamId: string;
  keyId: string;
  servicesId: string;
  privateKeyPath: string;
}

function readEnv(): AppleEnv {
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const servicesId = process.env.APPLE_SERVICES_ID;
  const privateKeyPath = process.env.APPLE_PRIVATE_KEY_PATH;
  if (!teamId || !keyId || !servicesId || !privateKeyPath) {
    throw new Error(
      "Faltan variables: APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_SERVICES_ID, APPLE_PRIVATE_KEY_PATH",
    );
  }
  return { teamId, keyId, servicesId, privateKeyPath };
}

async function main(): Promise<void> {
  const env = readEnv();
  const pem = await readFile(env.privateKeyPath, "utf8");
  const key = await importPKCS8(pem, "ES256");
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 150; // 150 días — margen frente al límite Apple de 6 meses

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: env.keyId })
    .setIssuer(env.teamId)
    .setSubject(env.servicesId)
    .setAudience("https://appleid.apple.com")
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(key);

  process.stdout.write(`${jwt}\n`);
  process.stderr.write(
    `Caduca el ${new Date(exp * 1000).toISOString()}. Programa la próxima rotación.\n`,
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`gen-apple-secret fallo: ${(err as Error).message}\n`);
  process.exit(1);
});
