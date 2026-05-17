// @repo/email — Shared Resend client + React Email components
// RESEND_API_KEY must be set in server-side env before importing this module.

import { Resend } from "resend";

const key = process.env["RESEND_API_KEY"];
if (!key) {
  throw new Error("Missing env variable: RESEND_API_KEY");
}

export const resend = new Resend(key);

export type { CreateEmailOptions, CreateEmailResponse } from "resend";

// Re-export React Email primitives for use in template files.
export * from "@react-email/components";
