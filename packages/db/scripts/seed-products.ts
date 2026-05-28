// Seed/upsert del catálogo a la tabla `products` desde catalog/manifest.json.
// Ejecutar: pnpm --filter=@repo/db seed:products
// Requiere DATABASE_URL / DIRECT_URL. Idempotente (upsert por sku).

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { prisma } from "../src/index.ts";

type ManifestProduct = {
  sku: string;
  slug: string;
  title: string;
  description_md: string;
  category: string;
  price_cents: number;
  currency?: string;
  delivery_mode: "download" | "service_manual";
  stripe_price_id: string | null;
  storage_path: string | null;
  is_active: boolean;
  display_order: number;
};

type Manifest = { currency: string; products: ManifestProduct[] };

async function main(): Promise<void> {
  const manifestPath = resolve(process.cwd(), "../../catalog/manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;

  let upserted = 0;
  for (const p of manifest.products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      create: {
        sku: p.sku,
        slug: p.slug,
        title: p.title,
        descriptionMd: p.description_md,
        category: p.category,
        priceCents: p.price_cents,
        currency: p.currency ?? manifest.currency,
        stripePriceId: p.stripe_price_id,
        storagePath: p.storage_path,
        deliveryMode: p.delivery_mode,
        isActive: p.is_active,
        displayOrder: p.display_order,
      },
      update: {
        slug: p.slug,
        title: p.title,
        descriptionMd: p.description_md,
        category: p.category,
        priceCents: p.price_cents,
        currency: p.currency ?? manifest.currency,
        stripePriceId: p.stripe_price_id,
        storagePath: p.storage_path,
        deliveryMode: p.delivery_mode,
        isActive: p.is_active,
        displayOrder: p.display_order,
      },
    });
    upserted += 1;
  }

  console.log(`seed:products → ${upserted} SKU upserted desde ${manifestPath}`);
  await prisma.$disconnect();
}

main().catch(async (err: unknown) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
