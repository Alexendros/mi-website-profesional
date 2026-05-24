// Fulfillment por delivery_mode. v1: `download` envía el email con el enlace
// tokenizado. `service_manual` queda como gancho no-op (Opción B).

import { prisma } from "@repo/db";
import { sendDownloadReady } from "@repo/email";

export async function fulfillOrder(
  orderId: string,
  origin: string,
): Promise<void> {
  // Transición atómica: solo un caller concurrente puede reclamar el pedido.
  const claimed = await prisma.order.updateMany({
    where: { id: orderId, status: "payment_completed" },
    data: { status: "fulfilling" },
  });
  if (claimed.count === 0) return;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });
    if (!order || !order.downloadToken) return;

    if (order.product.deliveryMode === "service_manual") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "service_intake_pending" },
      });
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
  } catch (err) {
    await prisma.order
      .update({ where: { id: orderId }, data: { status: "payment_completed" } })
      .catch(() => {});
    throw err;
  }
}
