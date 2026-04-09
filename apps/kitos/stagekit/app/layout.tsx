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
    <html
      lang="es"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      data-kit="stagekit"
    >
      <body>{children}</body>
    </html>
  );
}
