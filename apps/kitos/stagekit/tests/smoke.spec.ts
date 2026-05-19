import { test, expect } from "@playwright/test";

test.describe("StageKit · smoke tests", () => {
  test("página principal carga y tiene título", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/StageKit/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("no hay errores de consola críticos", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const critical = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !/Failed to load resource.*\b404\b/i.test(e) &&
        !e.includes("DevTools")
    );
    expect(critical, `Console errors: ${critical.join("\n")}`).toHaveLength(0);
  });

  test("meta description presente", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const meta = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(meta?.length ?? 0).toBeGreaterThan(20);
  });
});
