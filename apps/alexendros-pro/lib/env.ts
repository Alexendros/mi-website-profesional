// Validación de entorno server-only, lazy (no rompe build sin secretos;
// se valida en el primer request que lo necesita). Esquema mínimo Opción A.

import { z } from "zod";
import {
  createServerEnvValidator,
  serverFields,
} from "@repo/config/env";

export const serverEnv = createServerEnvValidator({
  STRIPE_SECRET_KEY: serverFields.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: serverFields.STRIPE_WEBHOOK_SECRET,
  DATABASE_URL: serverFields.DATABASE_URL,
  RESEND_API_KEY: serverFields.RESEND_API_KEY,
});

export const storageEnv = createServerEnvValidator({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: serverFields.SUPABASE_SERVICE_ROLE_KEY,
});

// Formulario de contacto (landing de servicios). Secretos server-only,
// validados lazy en el primer request a /api/contact.
export const contactEnv = createServerEnvValidator({
  RESEND_API_KEY: serverFields.RESEND_API_KEY,
  CONTACT_TO_EMAIL: z.string().email(),
  CONTACT_FROM_EMAIL: z.string().email().default("onboarding@resend.dev"),
});

/**
 * Configuración pública de contacto (NEXT_PUBLIC_*) para la landing.
 * Tolerante: aplica defaults y nunca lanza, para renderizar aunque falten.
 */
export function getContactPublicConfig() {
  return {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@alexendros.me",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
  };
}
