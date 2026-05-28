/**
 * Seed determinista — Kits, Plans, Prices placeholder.
 *
 * IMPORTANTE: prohibido datos personales reales. El auditor
 * `scripts/audit/20-db-schema.sh` lo verifica.
 *
 * Ejecutar:
 *   pnpm --filter=@repo/db prisma db seed
 */

import { PrismaClient, PlanTier, PriceInterval } from "@prisma/client";

const prisma = new PrismaClient();

interface KitSeed {
  slug: string;
  name: string;
  themeToken: string;
  domain: string;
}

interface PlanSeed {
  kitSlug: string;
  slug: string;
  name: string;
  tier: PlanTier;
  description: string;
  features: string[];
  prices: PriceSeed[];
}

interface PriceSeed {
  stripePriceIdEnv: string; // nombre de var en env; placeholder si vacía
  currency: string;
  unitAmount: number;
  interval: PriceInterval;
  trialDays?: number;
}

const KITS: KitSeed[] = [
  { slug: "stagekit", name: "StageKit", themeToken: "dark-acid", domain: "stagekit.app" },
  { slug: "lexkit", name: "LexKit", themeToken: "legal-navy", domain: "lexkit.pro" },
  { slug: "gestkit", name: "GestKit", themeToken: "gestoria-slate", domain: "gestkit.pro" },
];

const PLANS: PlanSeed[] = [
  {
    kitSlug: "stagekit",
    slug: "free",
    name: "Free",
    tier: PlanTier.FREE,
    description: "Perfil básico publicado.",
    features: ["Perfil público", "Formulario contacto"],
    prices: [
      {
        stripePriceIdEnv: "STRIPE_PRICE_STAGEKIT_FREE",
        currency: "EUR",
        unitAmount: 0,
        interval: PriceInterval.MONTH,
      },
    ],
  },
  {
    kitSlug: "stagekit",
    slug: "pro",
    name: "Pro",
    tier: PlanTier.PRO,
    description: "EPK pro + bookings.",
    features: ["EPK profesional", "Bookings ilimitados", "Analytics", "Soporte 48h"],
    prices: [
      {
        stripePriceIdEnv: "STRIPE_PRICE_STAGEKIT_PRO_MONTHLY",
        currency: "EUR",
        unitAmount: 2900,
        interval: PriceInterval.MONTH,
        trialDays: 14,
      },
      {
        stripePriceIdEnv: "STRIPE_PRICE_STAGEKIT_PRO_ANNUAL",
        currency: "EUR",
        unitAmount: 29000,
        interval: PriceInterval.YEAR,
        trialDays: 14,
      },
    ],
  },
  {
    kitSlug: "stagekit",
    slug: "agency",
    name: "Agency",
    tier: PlanTier.AGENCY,
    description: "Multi-artista, marca propia.",
    features: ["10 artistas", "Marca blanca", "API", "Soporte prioritario"],
    prices: [
      {
        stripePriceIdEnv: "STRIPE_PRICE_STAGEKIT_AGENCY_MONTHLY",
        currency: "EUR",
        unitAmount: 19900,
        interval: PriceInterval.MONTH,
        trialDays: 14,
      },
      {
        stripePriceIdEnv: "STRIPE_PRICE_STAGEKIT_AGENCY_ANNUAL",
        currency: "EUR",
        unitAmount: 199000,
        interval: PriceInterval.YEAR,
        trialDays: 14,
      },
    ],
  },
];

const PLACEHOLDER_PRICE_ID = (slug: string, interval: PriceInterval) =>
  `price_PLACEHOLDER_${slug}_${interval}`.toLowerCase();

async function main(): Promise<void> {
  for (const kit of KITS) {
    await prisma.kit.upsert({
      where: { slug: kit.slug },
      create: kit,
      update: { name: kit.name, themeToken: kit.themeToken, domain: kit.domain },
    });
  }

  for (const planSeed of PLANS) {
    const kit = await prisma.kit.findUniqueOrThrow({ where: { slug: planSeed.kitSlug } });
    const plan = await prisma.plan.upsert({
      where: { kitId_slug: { kitId: kit.id, slug: planSeed.slug } },
      create: {
        kitId: kit.id,
        slug: planSeed.slug,
        name: planSeed.name,
        tier: planSeed.tier,
        description: planSeed.description,
        features: planSeed.features,
      },
      update: {
        name: planSeed.name,
        tier: planSeed.tier,
        description: planSeed.description,
        features: planSeed.features,
      },
    });

    for (const priceSeed of planSeed.prices) {
      const stripePriceId =
        process.env[priceSeed.stripePriceIdEnv] ??
        PLACEHOLDER_PRICE_ID(planSeed.slug, priceSeed.interval);

      await prisma.price.upsert({
        where: { stripePriceId },
        create: {
          planId: plan.id,
          stripePriceId,
          currency: priceSeed.currency,
          unitAmount: priceSeed.unitAmount,
          interval: priceSeed.interval,
          trialDays: priceSeed.trialDays,
        },
        update: {
          unitAmount: priceSeed.unitAmount,
          trialDays: priceSeed.trialDays,
        },
      });
    }
  }

  process.stdout.write("seed ok\n");
}

main()
  .catch((err: unknown) => {
    process.stderr.write(`seed fallo: ${(err as Error).message}\n`);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
