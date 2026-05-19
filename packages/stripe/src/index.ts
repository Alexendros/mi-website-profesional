// @repo/stripe — Shared Stripe client
// STRIPE_SECRET_KEY must be set in server-side env before importing this module.

import Stripe from "stripe";

const key = process.env["STRIPE_SECRET_KEY"];
if (!key) {
  throw new Error("Missing env variable: STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(key);

export type { Stripe } from "stripe";
