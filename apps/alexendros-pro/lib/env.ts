// Validación de entorno server-only, lazy (no rompe build sin secretos;
// se valida en el primer request que lo necesita). Esquema mínimo Opción A.

import { z } from "zod";

const serverSchema = z.object({
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  DATABASE_URL: z.string().min(1),
});

type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    const detail = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Variables de entorno del servidor inválidas:\n${detail}`);
  }
  cached = result.data;
  return cached;
}
