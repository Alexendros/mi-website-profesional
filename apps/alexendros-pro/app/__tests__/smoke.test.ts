import { describe, it, expect } from "vitest";
import { alexendrosTokens } from "@repo/brand";

describe("alexendros-pro · smoke", () => {
  it("consume tokens de marca Alexendros (oklch)", () => {
    expect(alexendrosTokens.colors.acidGreen).toMatch(/^oklch\(/);
    expect(alexendrosTokens.surfaces.bg).toMatch(/^oklch\(/);
  });
});
