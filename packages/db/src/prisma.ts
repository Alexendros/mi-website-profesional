import { PrismaClient } from "@prisma/client";

// Singleton compartido entre invocaciones serverless de la misma instancia
// (Vercel reuses Node process). Evita el agotamiento del pool en hot paths.
declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__prisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma__ = prisma;
}
