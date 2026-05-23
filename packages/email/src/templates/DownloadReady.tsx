// Email transaccional: descarga lista tras el pago (Opción A).

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

export type DownloadReadyProps = {
  productTitle: string;
  downloadUrl: string;
  expiresLabel: string;
};

export function DownloadReady({
  productTitle,
  downloadUrl,
  expiresLabel,
}: DownloadReadyProps): React.ReactElement {
  return (
    <Html lang="es">
      <Head />
      <Preview>Tu descarga de {productTitle} está lista</Preview>
      <Body style={{ backgroundColor: "#080c14", color: "#e6eaf0", fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading style={{ fontSize: "20px" }}>Gracias por tu compra</Heading>
          <Text>
            Tu producto <strong>{productTitle}</strong> está listo para
            descargar:
          </Text>
          <Text>
            <Link
              href={downloadUrl}
              style={{ color: "#7dd3fc", fontWeight: 600 }}
            >
              Descargar ahora
            </Link>
          </Text>
          <Text style={{ fontSize: "13px", color: "#9aa4b2" }}>
            El enlace caduca {expiresLabel}. Conserva este correo como
            justificante de compra.
          </Text>
          <Text style={{ fontSize: "12px", color: "#9aa4b2" }}>
            alexendros.pro
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
