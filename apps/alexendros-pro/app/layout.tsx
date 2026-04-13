import localFont from "next/font/local";
import "./globals.css";
import type { Metadata, Viewport } from "next";

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alexendros.pro"),
  title: {
    default: "KitOS — En construcción",
    template: "%s | KitOS by Alexendros",
  },
  description:
    "KitOS — Plataforma de kits digitales profesionales. En construcción. Vuelve pronto.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "KitOS",
    title: "KitOS — En construcción",
    description:
      "Plataforma de kits digitales profesionales por Alexendros. Afinando los últimos detalles.",
  },
  robots: { index: true, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      data-kit="stagekit"
    >
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
