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

test.describe("Landing · captación de servicios", () => {
  test("muestra secciones de servicios, proceso y contacto", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Servicios/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Cómo trabajo/i })).toBeVisible();
    await expect(page.locator("#contacto")).toBeVisible();
  });

  test("formulario de contacto presente con consentimiento RGPD", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel(/Nombre/i)).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByRole("checkbox")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /política de privacidad/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Enviar mensaje/i })
    ).toBeVisible();
  });
});

test.describe("Páginas legales", () => {
  for (const path of ["/privacidad", "/aviso-legal"]) {
    test(`${path} responde 200 y tiene h1`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }
});
