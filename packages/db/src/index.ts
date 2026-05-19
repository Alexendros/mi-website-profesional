// @repo/db — PrismaClient singleton
// Run `pnpm --filter=@repo/db db:generate` after schema changes.

import { PrismaClient } from "@prisma/client";

// Avoid multiple instances in development (Next.js hot-reload creates new
// module instances on each reload). In production a single instance per
// process is always created.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}

export type { PrismaClient } from "@prisma/client";
export * from "@prisma/client";
