/**
 * E2E · Magic link end-to-end (Fase 4.6).
 *
 * Requiere en CI:
 *   - SUPABASE_TEST_URL apuntando a una instancia self-hosted aislada (staging).
 *   - SMTP redirigido a Mailpit (servicio docker en CI) para capturar el mail.
 *   - MAILPIT_API_URL=http://mailpit:8025/api/v1.
 *
 * En local, ejecutar contra la instancia self-hosted de staging del operador.
 * Si las vars no están definidas, el test se marca `test.skip`.
 */

import { test, expect } from "@playwright/test";

const MAILPIT_API = process.env.MAILPIT_API_URL;
const TEST_EMAIL = `e2e+${Date.now()}@alexendros.test`;

test.describe("magic link", () => {
  test.skip(!MAILPIT_API, "MAILPIT_API_URL no definido — saltado");

  test("registro → enlace en email → sesión activa", async ({ page, request, baseURL }) => {
    // 1. Pedir magic link
    await page.goto(`${baseURL ?? "http://localhost:3000"}/login`);
    await page.getByLabel(/correo|email/i).fill(TEST_EMAIL);
    await page.getByRole("button", { name: /enviar enlace|magic link/i }).click();
    await expect(page.getByText(/te hemos enviado/i)).toBeVisible({ timeout: 10_000 });

    // 2. Recuperar el último email recibido en Mailpit
    const messages = await request.get(`${MAILPIT_API}/messages?query=${encodeURIComponent(`to:${TEST_EMAIL}`)}`);
    expect(messages.ok()).toBeTruthy();
    const payload = (await messages.json()) as { messages: Array<{ ID: string }> };
    expect(payload.messages.length).toBeGreaterThan(0);
    const id = payload.messages[0]?.ID;
    const detail = await request.get(`${MAILPIT_API}/message/${id}`);
    const detailJson = (await detail.json()) as { Text: string };
    const match = detailJson.Text.match(/https?:\/\/\S+/);
    expect(match).not.toBeNull();
    const link = match![0]!;

    // 3. Abrir el link → callback → sesión
    await page.goto(link);
    await expect(page).toHaveURL(/\/(app|dashboard|onboarding)/, { timeout: 15_000 });

    // 4. Cookie sb-* presente
    const cookies = await page.context().cookies();
    expect(cookies.some((c) => c.name.startsWith("sb-"))).toBeTruthy();

    // 5. tRPC auth.me devuelve el userId
    const me = await request.get(`${baseURL ?? "http://localhost:3000"}/api/trpc/auth.me?batch=1`, {
      headers: { cookie: cookies.map((c) => `${c.name}=${c.value}`).join("; ") },
    });
    expect(me.status()).toBe(200);
  });
});
