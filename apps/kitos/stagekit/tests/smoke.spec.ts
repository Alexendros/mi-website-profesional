import { test, expect } from "@playwright/test";

test.describe("StageKit · smoke tests", () => {
  test("página principal carga y tiene título", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/.+/);
  });

  test("no hay errores de consola críticos", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const critical = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("404") &&
        !e.includes("DevTools")
    );
    expect(critical, `Console errors: ${critical.join("\n")}`).toHaveLength(0);
  });
});
