// @repo/email — Resend lazy + plantillas React Email + helpers de envío.
// RESEND_API_KEY sólo en entorno server. Para v1 (Opción A) un único email
// transaccional (DownloadReady) actúa también como justificante de compra.

export { getResend } from "./client";
export { safeSendEmail, sendDownloadReady } from "./send";
export type { SendResult } from "./send";
export { DownloadReady } from "./templates/DownloadReady";
export type { DownloadReadyProps } from "./templates/DownloadReady";

export type { CreateEmailOptions, CreateEmailResponse } from "resend";
