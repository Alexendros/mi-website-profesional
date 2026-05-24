// GET /descarga/[token] — valida token + caducidad, contabiliza la descarga
// y entrega el objeto. La firma de URL de Supabase Storage se conecta cuando
// el bucket privado esté provisionado (infra operador); hasta entonces el
// gating de seguridad (token único + expiración) ya es funcional.

import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { checkRateLimit } from "../../../lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  // Validar que storagePath es una URL absoluta HTTPS antes de redirigir.
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

  await prisma.order
    .update({
      where: { id: order.id },
      data: { downloadCount: { increment: 1 } },
    })
    .catch(() => {
      /* non-critical: don't block download delivery */
    });

  // TODO(infra): firmar URL del objeto privado en Supabase Storage
  // (createSignedUrl, TTL corto) y redirigir aquí.
  return NextResponse.redirect(redirectUrl);
}
