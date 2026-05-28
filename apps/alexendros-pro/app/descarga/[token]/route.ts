// GET /descarga/[token] — valida token + caducidad, contabiliza la descarga
// y entrega el objeto via Supabase Storage signed URL (bucket privado).
// Si storagePath es una URL HTTPS directa (legacy/fallback), redirige tras
// validar el dominio contra la allow-list.

import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { checkRateLimit } from "../../../lib/ratelimit";
import { createSignedDownloadUrl } from "../../../lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = new Set<string>([
  // Hosts concretos adicionales se añaden aquí si es necesario.
  // Supabase Storage (project-ref varía) se valida por sufijo más abajo.
]);

const ALLOWED_HOST_SUFFIXES = [
  ".supabase.co",
  ".supabase.in",
];

function isAllowedHost(hostname: string): boolean {
  if (ALLOWED_HOSTS.has(hostname)) return true;
  return ALLOWED_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await ctx.params;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!(await checkRateLimit(ip))) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes, inténtalo más tarde" },
      { status: 429 },
    );
  }

  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
    include: { product: true },
  });

  if (!order || order.deletedAt) {
    return NextResponse.json({ error: "Enlace no válido" }, { status: 404 });
  }

  const blocked: string[] = ["refunded", "failed", "pending", "service_intake_pending"];
  if (blocked.includes(order.status)) {
    return NextResponse.json({ error: "Enlace no válido" }, { status: 404 });
  }

  if (order.downloadExpiresAt && order.downloadExpiresAt < new Date()) {
    return NextResponse.json({ error: "Enlace caducado" }, { status: 410 });
  }

  if (!order.product.storagePath) {
    return NextResponse.json(
      {
        ok: true,
        product: order.product.title,
        note: "Tu descarga estará disponible pronto. Contacta soporte si persiste.",
      },
      { status: 200 },
    );
  }

  await prisma.order
    .update({
      where: { id: order.id },
      data: { downloadCount: { increment: 1 } },
    })
    .catch(() => {
      /* non-critical: don't block download delivery */
    });

  // Estrategia 1: storagePath es una ruta relativa al bucket (ej. "templates/file.zip")
  // → generar signed URL via Supabase Storage.
  const isRelativePath = !order.product.storagePath.startsWith("https://");
  if (isRelativePath) {
    const result = await createSignedDownloadUrl(order.product.storagePath);
    if (result.ok) {
      return NextResponse.redirect(result.url);
    }
    // Supabase no configurado o error → informar al usuario
    return NextResponse.json(
      { error: "Descarga no disponible temporalmente" },
      { status: 503 },
    );
  }

  // Estrategia 2 (legacy/fallback): storagePath es una URL HTTPS directa.
  // Validar protocolo + domain allow-list antes de redirigir.
  let redirectUrl: URL;
  try {
    redirectUrl = new URL(order.product.storagePath);
  } catch {
    return NextResponse.json(
      { error: "Descarga no disponible temporalmente" },
      { status: 503 },
    );
  }

  if (redirectUrl.protocol !== "https:") {
    return NextResponse.json(
      { error: "Descarga no disponible temporalmente" },
      { status: 503 },
    );
  }

  if (!isAllowedHost(redirectUrl.hostname)) {
    return NextResponse.json(
      { error: "Descarga no disponible temporalmente" },
      { status: 503 },
    );
  }

  return NextResponse.redirect(redirectUrl);
}
