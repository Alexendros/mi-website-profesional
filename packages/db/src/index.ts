// @repo/db — punto de entrada del paquete.
//
// Re-exporta Prisma y los factories Supabase. Apps no deben importar
// `@prisma/client` directamente: siempre via `@repo/db`.

export { prisma } from "./prisma";
export {
  createServerSupabase,
  createBrowserSupabase,
  createServiceRoleSupabase,
} from "./supabase";
export type { ServerSupabase, BrowserSupabase } from "./supabase";
export type { PrismaClient } from "@prisma/client";
export * from "@prisma/client";
