import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pago completado",
  description: "Tu compra se ha completado.",
  robots: { index: false, follow: false },
};

export default function PagoExitosoPage() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[40rem] flex-col items-start justify-center gap-5 px-6 py-24 md:px-10">
      <CheckCircle
        aria-hidden="true"
        style={{ color: "var(--color-feedback-success)" }}
        size={40}
      />
      <h1
        className="display font-semibold text-[var(--color-text-primary)]"
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
      <Link href="/tienda" className="btn-primary">
        Volver a la tienda
      </Link>
    </div>
  );
}
