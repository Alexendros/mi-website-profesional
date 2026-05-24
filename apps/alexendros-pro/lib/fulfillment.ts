// Fulfillment por delivery_mode. v1: `download` envía el email con el enlace
// tokenizado. `service_manual` queda como gancho no-op (Opción B).

import { prisma } from "@repo/db";
import { sendDownloadReady } from "@repo/email";

export async function fulfillOrder(
  orderId: string,
  origin: string,
): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true },
  });
  if (!order || !order.downloadToken) return;
  // Defensa en profundidad: si ya se entregó, no reenviar (idempotencia).
  if (order.status === "delivered") return;

  if (order.product.deliveryMode === "service_manual") {
    // Opción B (reservado): entrega/intake manual. No-op en v1.
    return;
  }

  const downloadUrl = `${origin}/descarga/${order.downloadToken}`;
  const expiresLabel = order.downloadExpiresAt
    ? `el ${order.downloadExpiresAt.toLocaleDateString("es-ES")}`
    : "en 7 días";

  const res = await sendDownloadReady(order.customerEmail, {
    productTitle: order.product.title,
    downloadUrl,
    expiresLabel,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: res.ok ? "delivered" : "payment_completed" },
  });
}
