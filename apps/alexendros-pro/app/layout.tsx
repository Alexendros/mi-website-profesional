import localFont from "next/font/local";
import "./globals.css";
import type { Metadata } from "next";

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
    <html
      lang="es"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      data-kit="stagekit"
    >
      <body>{children}</body>
    </html>
  );
}
