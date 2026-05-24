// Validación de entorno server-only, lazy (no rompe build sin secretos;
// se valida en el primer request que lo necesita). Esquema mínimo Opción A.

import {
  createServerEnvValidator,
  serverFields,
} from "@repo/config/env";

export const serverEnv = createServerEnvValidator({
  STRIPE_SECRET_KEY: serverFields.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: serverFields.STRIPE_WEBHOOK_SECRET,
  DATABASE_URL: serverFields.DATABASE_URL,
});
