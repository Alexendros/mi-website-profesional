import { describe, it, expect } from "vitest";
import { kitTokens } from "@repo/brand";

describe("stagekit · smoke", () => {
  it("expone paleta stagekit (dark-acid) desde @repo/brand", () => {
    expect(kitTokens.stagekit.accent).toMatch(/^oklch\(/);
    expect(kitTokens.stagekit.surface).toMatch(/^oklch\(/);
  });
});
