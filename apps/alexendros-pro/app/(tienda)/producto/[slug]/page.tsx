import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@repo/db";
import { BuyButton } from "../../../../components/buy-button";
import { formatPrice } from "../../../../lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true, stripePriceId: { not: null } },
    select: {
      sku: true,
      slug: true,
      title: true,
      descriptionMd: true,
      priceCents: true,
      currency: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.title,
    description: product.descriptionMd.slice(0, 160),
    alternates: { canonical: `/producto/${product.slug}` },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[48rem] px-6 py-20 md:px-10 md:py-28"
    >
      <h1
        className="font-semibold text-[var(--color-text-primary)]"
        style={{
          fontSize: "var(--text-h1)",
          letterSpacing: "var(--tracking-heading)",
        }}
      >
        {product.title}
      </h1>
      <p
        className="mt-4 whitespace-pre-line text-[var(--color-text-secondary)]"
        style={{ maxWidth: "var(--measure-prose)" }}
      >
        {product.descriptionMd}
      </p>
      <p className="mt-6 font-mono text-[var(--color-brand-accent)]">
        {formatPrice(product.priceCents, product.currency)}
      </p>

      <BuyButton sku={product.sku} />
    </main>
  );
}
