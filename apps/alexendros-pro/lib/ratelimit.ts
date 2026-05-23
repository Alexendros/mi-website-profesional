// Rate limiter con fallback graceful: si Upstash no está configurado
// (UPSTASH_REDIS_REST_*), se permite (no rompe dev/local). Patrón afiladocs.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | null = null;
let resolved = false;

function getLimiter(): Ratelimit | null {
  if (resolved) return limiter;
  resolved = true;
  const hasEnv =
    !!process.env["UPSTASH_REDIS_REST_URL"] &&
    !!process.env["UPSTASH_REDIS_REST_TOKEN"];
  if (!hasEnv) return null;
  limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: "alexendros-pro/checkout",
  });
  return limiter;
}

export async function checkRateLimit(key: string): Promise<boolean> {
  const l = getLimiter();
  if (!l) return true; // sin Upstash configurado → permitir (graceful)
  const { success } = await l.limit(key);
  return success;
}
