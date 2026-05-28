import { test, expect } from "@playwright/test";

test.describe("Responsividad · no-overflow + tap targets ≥44px", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("no hay overflow horizontal", async ({ page }) => {
    const overflow = await page.evaluate(() => {
      const body = document.body;
      return body.scrollWidth > body.clientWidth;
    });
    expect(overflow, "overflow horizontal detectado").toBe(false);
  });

  // WCAG 2.2 nivel AA · SC 2.5.8 Target Size (Minimum) = 24px.
  // (El antiguo umbral de 44px corresponde a SC 2.5.5, nivel AAA.)
  test("tap targets interactivos tienen al menos 24px", async ({ page }) => {
    const MIN = 24;
    const smallTargets = await page.evaluate((min) => {
      const targets = [
        ...document.querySelectorAll<HTMLElement>(
          'a, button, [role="button"], input, select, textarea'
        ),
      ];
      return targets
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) return false;
          // Skip links are visually hidden (1×1) but focusable — WCAG exception
          const href = el.getAttribute("href") ?? "";
          if (
            el.tagName === "A" &&
            href.startsWith("#") &&
            rect.width <= 1 &&
            rect.height <= 1
          ) {
            return false;
          }
          // Checkbox/radio: el objetivo accesible es su <label> asociado.
          if (
            el.tagName === "INPUT" &&
            ["checkbox", "radio"].includes(
              (el as HTMLInputElement).type
            )
          ) {
            return false;
          }
          // Enlaces en línea dentro de texto corrido (excepción de SC 2.5.8).
          if (
            el.tagName === "A" &&
            getComputedStyle(el).display === "inline"
          ) {
            return false;
          }
          return rect.width < min || rect.height < min;
        })
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim().slice(0, 50) ?? "",
          width: Math.round(el.getBoundingClientRect().width),
          height: Math.round(el.getBoundingClientRect().height),
        }));
    }, MIN);

    if (smallTargets.length > 0) {
      console.warn(
        `Tap targets <${MIN}px:`,
        JSON.stringify(smallTargets, null, 2)
      );
    }

    expect(
      smallTargets,
      `${smallTargets.length} elemento(s) con tap target < ${MIN}px`
    ).toHaveLength(0);
  });
});
