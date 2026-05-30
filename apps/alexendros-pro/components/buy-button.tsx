"use client";

import { useId, useState } from "react";
import { z } from "zod";

const CheckoutOk = z.object({ url: z.string().url() });
const CheckoutErr = z.object({ error: z.string() });
const emailSchema = z.string().email();

export function BuyButton({ sku }: { sku: string }): React.ReactElement {
  const emailId = useId();
  const hintId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = emailSchema.safeParse(email).success;

  async function onSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError(null);
    if (!emailValid) {
      setError("Introduce un email válido para recibir la descarga.");
      return;
    }
    if (!consent) {
      setError("Marca la casilla de consentimiento para continuar.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sku, email, withdrawalConsent: consent }),
      });
      const data: unknown = await res.json();
      const ok = CheckoutOk.safeParse(data);
      if (res.ok && ok.success) {
        window.location.href = ok.data.url;
        return;
      }
      const err = CheckoutErr.safeParse(data);
      setError(err.success ? err.data.error : "No se pudo iniciar el pago");
    } catch {
      setError("Error de red");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-4">
      <label
        htmlFor={emailId}
        className="flex flex-col gap-1 text-sm text-[var(--color-text-secondary)]"
      >
        Email para recibir la descarga
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={email.length > 0 && !emailValid}
          aria-describedby={hintId}
          className="field"
        />
      </label>

      <label className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        <span>
          Solicito la ejecución inmediata y acepto perder el derecho de
          desistimiento una vez iniciada la descarga (art. 103.m TRLGDCU).
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        aria-describedby={hintId}
        className="btn-primary"
      >
        {loading ? "Redirigiendo al pago seguro…" : "Comprar"}
      </button>

      <p id={hintId} className="text-sm text-[var(--color-text-tertiary)]">
        {!emailValid
          ? "Introduce un email válido para recibir la descarga."
          : !consent
            ? "Marca la casilla de consentimiento para continuar."
            : "Te llevaremos al pago seguro de Stripe."}
      </p>

      <p role="status" aria-live="polite" className="sr-only">
        {loading ? "Redirigiendo al pago seguro…" : ""}
      </p>

      {error ? (
        <p role="alert" className="text-sm text-[var(--color-feedback-error)]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
