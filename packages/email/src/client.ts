// Cliente Resend lazy — no instanciar a nivel de módulo (rompería build/test
// sin RESEND_API_KEY).

import { Resend } from "resend";

let client: Resend | null = null;

export function getResend(): Resend {
  if (client) return client;
  const key = process.env["RESEND_API_KEY"];
  if (!key) {
    throw new Error("Missing env variable: RESEND_API_KEY");
  }
  client = new Resend(key);
  return client;
}
