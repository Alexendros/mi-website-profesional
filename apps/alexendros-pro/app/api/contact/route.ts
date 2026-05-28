import { NextResponse, type NextRequest } from "next/server";
import { getResend } from "@repo/email";
import { contactEnv } from "../../../lib/env";
import { checkRateLimit } from "../../../lib/ratelimit";
import { contactSchema } from "../../../lib/contact-schema";

// Resend necesita Node.js (no Edge). Forzamos runtime Node y render dinámico.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  // x-real-ip es de confianza en Vercel; x-forwarded-for es fallback y
  // tomamos el primer valor no vacío para tolerar cabeceras malformadas.
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const first = fwd.split(",").map((s) => s.trim()).find(Boolean);
  return first || "anon";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Rate limiting (obligatorio en /api/* según CLAUDE.md raíz).
  const ip = clientIp(req);
  if (!(await checkRateLimit(`contact:${ip}`))) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Inténtalo de nuevo en un minuto." },
      { status: 429 },
    );
  }

  // 2. Parseo y validación del payload.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Revisa los campos del formulario.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { name, email, message, company, consent } = parsed.data;

  // 3. Honeypot: si el campo oculto viene relleno, es un bot. Aceptamos en
  //    silencio (200) sin enviar nada para no dar señales al spammer.
  if (company && company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 4. Validación de secretos en tiempo de petición (nunca en build).
  let env;
  try {
    env = contactEnv();
  } catch (err) {
    console.error("[contact] configuración de entorno incompleta", err);
    return NextResponse.json(
      { error: "El formulario no está disponible ahora mismo. Escríbenos por email." },
      { status: 503 },
    );
  }

  // 5. Envío vía Resend (@repo/email). getResend es lazy; le pasamos la key ya
  //    validada. emails.send devuelve { error } en vez de lanzar.
  const text = [
    `Nombre: ${name}`,
    `Email: ${email}`,
    "",
    "Mensaje:",
    message,
    "",
    "—",
    // Rastro de consentimiento RGPD (art. 7: demostrabilidad).
    `Consentimiento política de privacidad: ${consent ? "aceptado" : "NO"} · ${new Date().toISOString()} · IP ${ip}`,
  ].join("\n");

  try {
    const { error } = await getResend(env.RESEND_API_KEY).emails.send({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Nuevo contacto desde alexendros.pro — ${name}`,
      text,
    });
    if (error) {
      console.error("[contact] resend error", error);
      return NextResponse.json(
        { error: "No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos por email." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] fallo al enviar email", err);
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos por email." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
