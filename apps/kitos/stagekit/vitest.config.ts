import { defineConfig, mergeConfig } from "vitest/config";
import base from "@repo/config/vitest.base";

export default mergeConfig(
  base,
  defineConfig({
    test: {
      environment: "node",
    },
  })
);
