import { defineConfig } from "vitest/config";

/**
 * Shared Vitest base configuration for all apps in the monorepo.
 * Each app merges this with its own overrides via mergeConfig().
 *
 * Usage in an app:
 *   import { defineConfig, mergeConfig } from "vitest/config";
 *   import base from "@repo/config/vitest.base";
 *   export default mergeConfig(base, defineConfig({ ... }));
 */
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "app/**/__tests__/**/*.{test,spec}.{ts,tsx}",
      "app/**/*.{test,spec}.{ts,tsx}",
      "__tests__/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: [
      "node_modules",
      ".next",
      "dist",
      "out",
      "tests/**",          // playwright lives here
      "**/*.e2e.{ts,tsx}",
      "**/*.spec.{ts,tsx}", // playwright uses .spec, vitest uses .test
    ],
  },
});
