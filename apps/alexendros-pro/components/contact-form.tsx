"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { contactSchema } from "../lib/contact-schema";

type FieldErrors = Partial<Record<"name" | "email" | "message" | "consent", string>>;
type Status = "idle" | "sending" | "ok" | "error";

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-100)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-colors focus-visible:border-[var(--color-border-focus)]";
const labelBase =
  "font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-text-secondary)]";
const errorBase = "text-xs text-[oklch(0.72_0.17_25)]";

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerMsg("");
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
      company: String(data.get("company") ?? ""),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        message: flat.message?.[0],
        consent: flat.consent?.[0],
      });
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        setServerMsg(json.error ?? "No se pudo enviar el mensaje.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("ok");
    } catch {
      setServerMsg("Error de red. Inténtalo de nuevo.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot — oculto a usuarios, accesible solo a bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">No rellenar</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="name" className={labelBase}>
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={!!errors.name}
          className={fieldBase}
          placeholder="Tu nombre"
        />
        {errors.name ? <p className={errorBase}>{errors.name}</p> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className={labelBase}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={!!errors.email}
          className={fieldBase}
          placeholder="tu@email.com"
        />
        {errors.email ? <p className={errorBase}>{errors.email}</p> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="message" className={labelBase}>
          ¿En qué puedo ayudarte?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={!!errors.message}
          className={`${fieldBase} resize-y`}
          placeholder="Cuéntame brevemente tu proyecto, plazos y presupuesto orientativo."
        />
        {errors.message ? <p className={errorBase}>{errors.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="consent" className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            aria-invalid={!!errors.consent}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          <span>
            He leído y acepto la{" "}
            <Link
              href="/privacidad"
              className="underline underline-offset-2 text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary-hc)]"
            >
              política de privacidad
            </Link>
            . Trataré tus datos solo para responder a tu consulta.
          </span>
        </label>
        {errors.consent ? <p className={errorBase}>{errors.consent}</p> : null}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-brand-primary-hc)] bg-[var(--color-brand-primary)] px-5 py-3 text-sm font-medium text-[var(--color-brand-primary-fg)] transition-[background-color,box-shadow] hover:bg-[var(--color-brand-primary-hc)] hover:shadow-[var(--shadow-glow-brand)] disabled:opacity-60"
        style={{ transitionDuration: "var(--dur-base)", transitionTimingFunction: "var(--ease-expo)" }}
      >
        <Send size={18} strokeWidth={1.75} aria-hidden="true" />
        <span>{status === "sending" ? "Enviando…" : "Enviar mensaje"}</span>
      </button>

      {/* Feedback accesible. */}
      <p role="status" aria-live="polite" className="min-h-5 text-sm">
        {status === "ok" ? (
          <span className="text-[var(--color-brand-primary-hc)]">
            ¡Mensaje enviado! Te responderé lo antes posible.
          </span>
        ) : null}
        {status === "error" && serverMsg ? (
          <span className="text-[oklch(0.72_0.17_25)]">{serverMsg}</span>
        ) : null}
      </p>
    </form>
  );
}
