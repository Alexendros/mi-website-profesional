// Cliente Stripe lazy — no instanciar a nivel de módulo (rompería build/test
// sin STRIPE_SECRET_KEY). apiVersion: se usa el default fijado por el SDK v22
// (forzar una string literal desalineada con la versión del SDK rompe el tipado).

import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) {
    throw new Error("Missing env variable: STRIPE_SECRET_KEY");
  }
  client = new Stripe(key);
  return client;
}

export type { Stripe } from "stripe";
