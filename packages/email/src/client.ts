// Cliente Resend lazy — no instanciar a nivel de módulo (rompería build/test
// sin RESEND_API_KEY).
//
// El caller DEBE pasar la key validada (vía serverEnv()) en la primera
// invocación; las siguientes pueden omitirla y reciben el singleton cacheado.

import { Resend } from "resend";

let client: Resend | null = null;

export function getResend(key?: string): Resend {
  if (client) return client;
  if (!key) {
    throw new Error(
      "RESEND_API_KEY required on first call — pass the validated key from serverEnv()",
    );
  }
  client = new Resend(key);
  return client;
}
