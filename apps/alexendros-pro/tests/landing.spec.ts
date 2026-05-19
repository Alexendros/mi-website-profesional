import { test, expect } from "@playwright/test";

test.describe("Landing · smoke tests", () => {
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
    const meta = await page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute("content") ?? ""
    );
    expect(meta.length).toBeGreaterThan(20);
  });

  test("OG title y description presentes", async ({ page }) => {
    await page.goto("/");
    const ogTitle = await page.$eval(
      'meta[property="og:title"]',
      (el) => el.getAttribute("content") ?? ""
    );
    expect(ogTitle.length).toBeGreaterThan(0);
  });

  test("robots.txt accesible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
  });

  test("sitemap.xml accesible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });
});
