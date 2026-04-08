import localFont from "next/font/local";
import "./globals.css";
import type { Metadata } from "next";

const geistSans = localFont({
  src: "../../packages/brand/fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../../packages/brand/fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alexendros.me"),
  title: {
    default: "Alejandro Agustí — Fullstack Developer",
    template: "%s | Alexendros",
  },
  description:
    "Fullstack developer especializado en Next.js y Supabase. Fundador de KitOS. Madrid.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Alexendros",
  },
  twitter: {
    card: "summary_large_image",
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
