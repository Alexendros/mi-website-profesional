// Crea Product+Price en Stripe para cada SKU del manifest sin stripe_price_id,
// rellena products.stripe_price_id en BD y reescribe el manifest (SSOT).
// Ejecutar: pnpm --filter=@repo/stripe stripe:populate
// Requiere STRIPE_SECRET_KEY + DATABASE_URL. Idempotente (salta los ya poblados).

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { prisma } from "@repo/db";
import { getStripe } from "../src/client.ts";

type ManifestProduct = {
  sku: string;
  slug: string;
  title: string;
  description_md: string;
  price_cents: number;
  currency?: string;
  stripe_price_id: string | null;
  [k: string]: unknown;
};
type Manifest = {
  currency: string;
  products: ManifestProduct[];
  [k: string]: unknown;
};

async function main(): Promise<void> {
  const manifestPath = resolve(process.cwd(), "../../catalog/manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) throw new Error("STRIPE_SECRET_KEY required");
  const stripe = getStripe(key);
  let created = 0;

  for (const p of manifest.products) {
    if (p.stripe_price_id) continue;

    const product = await stripe.products.create({
      name: p.title,
      description: p.description_md.slice(0, 350),
      metadata: { sku: p.sku, slug: p.slug },
    });
    const price = await stripe.prices.create({
      product: product.id,
      currency: p.currency ?? manifest.currency,
      unit_amount: p.price_cents,
      metadata: { sku: p.sku },
    });

    p.stripe_price_id = price.id;
    await prisma.product.update({
      where: { sku: p.sku },
      data: { stripePriceId: price.id },
    });
    created += 1;
    console.log(`  ${p.sku} → ${price.id}`);
  }

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`stripe:populate → ${created} precio(s) creado(s); manifest actualizado`);
  await prisma.$disconnect();
}

main().catch(async (err: unknown) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
