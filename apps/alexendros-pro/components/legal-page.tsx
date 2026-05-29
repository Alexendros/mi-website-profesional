import type { ReactNode } from "react";
import Link from "next/link";

// Layout compartido por las páginas legales (privacidad, aviso legal, y futuras
// cookies/términos) para no duplicar estructura, espaciado y back-link.

export function LegalPageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[48rem] flex-col gap-6 px-6 py-20 md:px-10 md:py-28">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
      >
        ← alexendros.pro
      </Link>
      <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">{title}</h1>
      <div
        className="flex flex-col gap-5 text-sm text-[var(--color-text-secondary)]"
        style={{ lineHeight: "var(--leading-relaxed)" }}
      >
        {children}
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h2>
      {children}
    </section>
  );
}
