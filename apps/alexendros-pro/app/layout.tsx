import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://alexendros.pro"),
  title: {
    default: "KitOS — Kits digitales para profesionales",
    template: "%s | KitOS by Alexendros",
  },
  description:
    "Plataforma de kits digitales profesionales. EPK, booking, portfolio y mas para tu nicho.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "KitOS",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
