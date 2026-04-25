/**
 * Next.js 15 instrumentation hook · valida env al arrancar el runtime Node.
 *
 * Followup golden-set autoresearch code-reviewer 2026-W17:
 * - pr-alexendrospro-1.yaml f2 (high): validateEnv() definida pero nunca invocada.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { validateEnv } = await import("@repo/config/env");
  try {
    validateEnv();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (process.env.NODE_ENV === "production") throw e;
    console.warn("[env] validateEnv() falló (no se interrumpe en dev):\n" + msg);
  }
}
