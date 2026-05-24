// GET /descarga/[token] — valida token + caducidad, contabiliza la descarga
// y entrega el objeto. La firma de URL de Supabase Storage se conecta cuando
// el bucket privado esté provisionado (infra operador); hasta entonces el
// gating de seguridad (token único + expiración) ya es funcional.

import { NextResponse } from "next/server";
import { prisma } from "@repo/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await ctx.params;

  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
    include: { product: true },
  });

  if (!order || order.deletedAt) {
    return NextResponse.json({ error: "Enlace no válido" }, { status: 404 });
  }
  if (order.downloadExpiresAt && order.downloadExpiresAt < new Date()) {
    return NextResponse.json({ error: "Enlace caducado" }, { status: 410 });
  }

  if (!order.product.storagePath) {
    // Storage aún no provisionado: el token es válido pero no hay objeto.
    return NextResponse.json(
      {
        ok: true,
        product: order.product.title,
        note: "Almacenamiento pendiente de configurar (bucket privado Supabase + SUPABASE_SERVICE_ROLE_KEY).",
      },
      { status: 200 },
    );
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { downloadCount: { increment: 1 } },
  });

  // TODO(infra): firmar URL del objeto privado en Supabase Storage
  // (createSignedUrl, TTL corto) y redirigir aquí.
  return NextResponse.redirect(order.product.storagePath);
}
