// Rate limiter con fallback graceful: si Upstash no está configurado
// (UPSTASH_REDIS_REST_*), se permite (no rompe dev/local). Patrón afiladocs.

import { createRatelimit } from "@repo/config/ratelimit";
import type { Ratelimit } from "@repo/config/ratelimit";

let limiter: Ratelimit | null = null;
let resolved = false;

function getLimiter(): Ratelimit | null {
  if (resolved) return limiter;
  resolved = true;
  try {
    limiter = createRatelimit({ requests: 10, window: "1 m" });
  } catch {
    // Upstash no configurado — permitir todo (graceful degradation dev/local).
  }
  return limiter;
}

export async function checkRateLimit(key: string): Promise<boolean> {
  const l = getLimiter();
  if (!l) return true;
  const { success } = await l.limit(key);
  return success;
}
