import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ParticleBg } from "../components/particle-bg";

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: true,
});

const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: false,
});

const SITE_URL = "https://alexendros.pro";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KitOS — En construcción",
    template: "%s | KitOS by Alexendros",
  },
  description:
    "KitOS — Plataforma de kits digitales profesionales. En construcción. Vuelve pronto.",
  applicationName: "KitOS",
  authors: [{ name: "Alejandro Domingo Agustí", url: "https://alexendros.me" }],
  creator: "Alexendros",
  publisher: "Alexendros",
  category: "technology",
  keywords: [
    "KitOS",
    "Alexendros",
    "SaaS",
    "kits digitales",
    "StageKit",
    "LexKit",
    "GestKit",
  ],
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    locale: "es_ES",
    siteName: "KitOS",
    title: "KitOS — En construcción",
    description:
      "Plataforma de kits digitales profesionales por Alexendros. Afinando los últimos detalles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KitOS — En construcción",
    description:
      "Plataforma de kits digitales profesionales por Alexendros. Afinando los últimos detalles.",
  },
  robots: {
    index: true,
    follow: false,
    googleBot: {
      index: true,
      follow: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080c14" },
    { media: "(prefers-color-scheme: light)", color: "#080c14" },
  ],
  colorScheme: "dark",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Alexendros",
  alternateName: "KitOS by Alexendros",
  url: SITE_URL,
  logo: `${SITE_URL}/icon`,
  sameAs: ["https://alexendros.me"],
  founder: {
    "@type": "Person",
    name: "Alejandro Domingo Agustí",
    url: "https://alexendros.me",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-theme="abisal"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ParticleBg />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
