// @repo/stripe — núcleo Stripe (Opción A: productos digitales, pago único).
// Patrón portado de afiladocs: cliente lazy + catálogo-como-BD + webhook
// con verificación de firma. STRIPE_SECRET_KEY sólo en entorno server.

export { getStripe } from "./client";
export { getActiveCatalog, getCatalogEntry } from "./catalog";
export type { CatalogEntry } from "./catalog";
export { createCheckoutSession } from "./checkout";
export type { CreateCheckoutInput, CreateCheckoutResult } from "./checkout";
export { verifyWebhook } from "./webhook";

export type { Stripe } from "stripe";
