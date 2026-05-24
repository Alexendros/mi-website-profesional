// Helpers de envío. safeSendEmail no lanza: registra y devuelve ok=false
// (el webhook no debe fallar por un email; la entrega se reintenta aparte).

import { render } from "@react-email/components";
import { getResend } from "./client";
import { DownloadReady, type DownloadReadyProps } from "./templates/DownloadReady";

const FROM = "Alexendros <no-reply@alexendros.pro>";

export type SendResult = { ok: boolean; id?: string; error?: string };

export async function safeSendEmail(args: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> {
  try {
    const res = await getResend().emails.send({
      from: FROM,
      to: args.to,
      subject: args.subject,
      html: args.html,
    });
    if (res.error) return { ok: false, error: res.error.message };
    return { ok: true, id: res.data?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send error" };
  }
}

export async function sendDownloadReady(
  to: string,
  props: DownloadReadyProps,
): Promise<SendResult> {
  try {
    const html = await render(DownloadReady(props));
    return safeSendEmail({
      to,
      subject: `Tu descarga: ${props.productTitle}`,
      html,
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "render error" };
  }
}
