import { z } from "zod";

/**
 * Schema compartido entre el formulario cliente y el Route Handler.
 * `company` es un honeypot anti-spam: debe llegar vacío en envíos humanos.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indica tu nombre").max(120),
  email: z.string().trim().email("Introduce un email válido").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntame un poco más (mínimo 10 caracteres)")
    .max(4000, "El mensaje es demasiado largo"),
  consent: z
    .boolean()
    .refine((v) => v === true, "Debes aceptar la política de privacidad"),
  // Honeypot — campo oculto que solo rellenan los bots.
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
