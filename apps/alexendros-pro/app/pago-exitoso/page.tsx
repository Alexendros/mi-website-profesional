import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pago completado",
  description: "Tu compra se ha completado.",
  robots: { index: false, follow: false },
};

export default function PagoExitosoPage() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[40rem] flex-col items-start justify-center gap-5 px-6 py-24 md:px-10">
      <h1
        className="font-semibold text-[var(--color-text-primary)]"
        style={{
          fontSize: "var(--text-h1)",
          letterSpacing: "var(--tracking-heading)",
        }}
      >
        Pago completado
      </h1>
      <p
        className="text-[var(--color-text-secondary)]"
        style={{ maxWidth: "var(--measure-prose)" }}
      >
        Gracias por tu compra. En unos minutos recibirás un correo con el
        enlace de descarga. Revisa también la carpeta de spam.
      </p>
      <Link
        href="/tienda"
        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-100)] px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-200)]"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
