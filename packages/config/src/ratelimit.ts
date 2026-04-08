import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiter factory.
 * Configurar UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN antes de usar.
 * Se activara en Phase 6 (PRO-08).
 */
export function createRatelimit(config?: {
  requests?: number;
  window?: `${number} ${"s" | "m" | "h" | "d"}`;
}) {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(
      config?.requests ?? 10,
      config?.window ?? "10 s",
    ),
    analytics: true,
    prefix: "@repo/ratelimit",
  });
}

export { Ratelimit, Redis };
