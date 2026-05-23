// Catálogo vivo indexado por SKU — sólo productos activos con stripe_price_id.
// Fuente única: tabla `products` (patrón afiladocs catálogo-como-BD).
// Async plano (sin react cache: @repo/stripe no debe depender de React).

import { prisma } from "@repo/db";

export type CatalogEntry = {
  sku: string;
  slug: string;
  title: string;
  stripePriceId: string;
  priceCents: number;
  currency: string;
  deliveryMode: "download" | "service_manual";
};

export async function getActiveCatalog(): Promise<Map<string, CatalogEntry>> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, stripePriceId: { not: null } },
    orderBy: { displayOrder: "asc" },
    select: {
      sku: true,
      slug: true,
      title: true,
      stripePriceId: true,
      priceCents: true,
      currency: true,
      deliveryMode: true,
    },
  });

  const map = new Map<string, CatalogEntry>();
  for (const r of rows) {
    if (!r.stripePriceId) continue;
    map.set(r.sku, {
      sku: r.sku,
      slug: r.slug,
      title: r.title,
      stripePriceId: r.stripePriceId,
      priceCents: r.priceCents,
      currency: r.currency,
      deliveryMode: r.deliveryMode,
    });
  }
  return map;
}

export async function getCatalogEntry(
  sku: string,
): Promise<CatalogEntry | null> {
  const r = await prisma.product.findFirst({
    where: { sku, isActive: true, stripePriceId: { not: null } },
    select: {
      sku: true,
      slug: true,
      title: true,
      stripePriceId: true,
      priceCents: true,
      currency: true,
      deliveryMode: true,
    },
  });
  if (!r || !r.stripePriceId) return null;
  return {
    sku: r.sku,
    slug: r.slug,
    title: r.title,
    stripePriceId: r.stripePriceId,
    priceCents: r.priceCents,
    currency: r.currency,
    deliveryMode: r.deliveryMode,
  };
}
