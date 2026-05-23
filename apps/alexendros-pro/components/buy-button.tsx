"use client";

import { useState } from "react";
import { z } from "zod";

const CheckoutOk = z.object({ url: z.string().url() });
const CheckoutErr = z.object({ error: z.string() });

export function BuyButton({ sku }: { sku: string }): React.ReactElement {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onBuy(): Promise<void> {
    setError(null);
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-[var(--color-text-secondary)]">
        Email para recibir la descarga
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-100)] px-3 py-2 text-[var(--color-text-primary)]"
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
        type="button"
        onClick={onBuy}
        disabled={loading || !consent || email.length === 0}
        className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-brand-primary-hc)] bg-[var(--color-brand-primary)] px-5 py-3 text-sm font-medium text-[var(--color-brand-primary-fg)] transition-colors hover:bg-[var(--color-brand-primary-hc)] disabled:opacity-50"
      >
        {loading ? "Redirigiendo…" : "Comprar"}
      </button>

      {error ? (
        <p role="alert" className="text-sm text-[var(--color-feedback-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
