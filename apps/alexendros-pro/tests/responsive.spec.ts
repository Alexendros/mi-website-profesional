import { test, expect } from "@playwright/test";

test.describe("Responsividad · no-overflow + tap targets ≥44px", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("no hay overflow horizontal", async ({ page }) => {
    const overflow = await page.evaluate(() => {
      const body = document.body;
      return body.scrollWidth > body.clientWidth;
    });
    expect(overflow, "overflow horizontal detectado").toBe(false);
  });

  test("tap targets interactivos tienen al menos 44px", async ({ page }) => {
    const smallTargets = await page.evaluate(() => {
      const targets = [
        ...document.querySelectorAll<HTMLElement>(
          'a, button, [role="button"], input, select, textarea'
        ),
      ];
      return targets
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) return false;
          return rect.width < 44 || rect.height < 44;
        })
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim().slice(0, 50) ?? "",
          width: Math.round(el.getBoundingClientRect().width),
          height: Math.round(el.getBoundingClientRect().height),
        }));
    });

    if (smallTargets.length > 0) {
      console.warn("Tap targets <44px:", JSON.stringify(smallTargets, null, 2));
    }

    expect(
      smallTargets,
      `${smallTargets.length} elemento(s) con tap target < 44px`
    ).toHaveLength(0);
  });
});
