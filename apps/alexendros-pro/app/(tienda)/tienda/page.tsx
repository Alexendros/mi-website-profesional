import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@repo/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Productos digitales descargables de Alexendros.",
  alternates: { canonical: "/tienda" },
};

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default async function TiendaPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, stripePriceId: { not: null } },
    orderBy: { displayOrder: "asc" },
    select: {
      sku: true,
      slug: true,
      title: true,
      descriptionMd: true,
      priceCents: true,
      currency: true,
    },
  });

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[64rem] px-6 py-20 md:px-10 md:py-28"
    >
      <h1
        className="font-semibold text-[var(--color-text-primary)]"
        style={{
          fontSize: "var(--text-h1)",
          letterSpacing: "var(--tracking-heading)",
        }}
      >
        Tienda
      </h1>
      <p
        className="mt-3 text-[var(--color-text-secondary)]"
        style={{ maxWidth: "var(--measure-prose)" }}
      >
        Productos digitales descargables. Pago único y entrega inmediata.
      </p>

      {products.length === 0 ? (
        <p className="mt-16 font-mono text-sm text-[var(--color-text-tertiary)]">
          Catálogo en preparación — vuelve pronto.
        </p>
      ) : (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <li key={p.sku}>
              <Link
                href={`/producto/${p.slug}`}
                className="block rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-100)] p-6 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-200)]"
              >
                <h2 className="font-medium text-[var(--color-text-primary)]">
                  {p.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                  {p.descriptionMd}
                </p>
                <p className="mt-4 font-mono text-sm text-[var(--color-brand-accent)]">
                  {formatPrice(p.priceCents, p.currency)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
