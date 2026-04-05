import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://stagekit.app"),
  title: {
    default: "StageKit — Tu carrera musical, nivel profesional",
    template: "%s | StageKit",
  },
  description:
    "EPK profesional, booking y portfolio para artistas de musica electronica.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "StageKit",
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
