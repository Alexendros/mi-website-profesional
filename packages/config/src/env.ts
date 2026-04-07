import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

/**
 * Variables expuestas al cliente (prefijo NEXT_PUBLIC_).
 * Seguras para incluir en el bundle del navegador.
 */
export const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z
    .string()
    .url()
    .default("https://eu.posthog.com"),
});

/**
 * Variables del servidor — NUNCA exponer al cliente.
 * SUPABASE_SERVICE_ROLE_KEY jamás con prefijo NEXT_PUBLIC_.
 */
export const serverSchema = z.object({
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Prisma — pooler (6543) para queries, directo (5432) para migraciones
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  STRIPE_CONNECT_CLIENT_ID: z.string().min(1),
  STRIPE_PRICE_STAGEKIT_PRO_MONTHLY: z.string().startsWith("price_"),
  STRIPE_PRICE_STAGEKIT_AGENCY_MONTHLY: z.string().startsWith("price_"),

  // Email
  RESEND_API_KEY: z.string().startsWith("re_"),

  // Notion
  NOTION_TOKEN: z.string().startsWith("secret_"),

  // n8n
  N8N_WEBHOOK_SECRET: z.string().min(1),
  N8N_BASE_URL: z.string().url(),

  // Rate Limiting (Upstash Redis)
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

/** Schema completo: public + server. */
export const envSchema = publicSchema.merge(serverSchema);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PublicEnv = z.infer<typeof publicSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;
export type Env = z.infer<typeof envSchema>;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function formatErrors(issues: z.ZodIssue[]): string {
  return issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
}

/**
 * Valida solo las variables públicas (NEXT_PUBLIC_*).
 * Usar en apps estáticas como alexendros-me.
 */
export function validatePublicEnv(): PublicEnv {
  const result = publicSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      `Variables de entorno publicas invalidas:\n${formatErrors(result.error.issues)}`,
    );
  }
  return result.data;
}

/**
 * Valida solo las variables del servidor.
 * Usar en contextos server-only donde las publicas ya estan validadas.
 */
export function validateServerEnv(): ServerEnv {
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      `Variables de entorno del servidor invalidas:\n${formatErrors(result.error.issues)}`,
    );
  }
  return result.data;
}

/**
 * Valida TODAS las variables (public + server).
 * Usar en apps con backend: alexendros-pro, stagekit.
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      `Variables de entorno invalidas:\n${formatErrors(result.error.issues)}`,
    );
  }
  return result.data;
}
