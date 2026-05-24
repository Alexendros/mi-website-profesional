// Cliente Stripe lazy — no instanciar a nivel de módulo (rompería build/test
// sin STRIPE_SECRET_KEY). apiVersion: se usa el default fijado por el SDK v22
// (forzar una string literal desalineada con la versión del SDK rompe el tipado).
//
// El caller DEBE pasar la key validada (vía serverEnv()) en la primera
// invocación; las siguientes pueden omitirla y reciben el singleton cacheado.

import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(key?: string): Stripe {
  if (client) return client;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY required on first call — pass the validated key from serverEnv()",
    );
  }
  client = new Stripe(key);
  return client;
}

export type { Stripe } from "stripe";
