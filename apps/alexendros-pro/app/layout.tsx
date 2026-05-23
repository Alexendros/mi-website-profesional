import localFont from "next/font/local";
import { Inter } from "next/font/google";
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

// Vergina Imperial v0.2.2 · Inter weight 700/800/900 para hero h1.display.
// Outfit/Bricolage descatalogados (Inter aprobada como reemplazo definitivo).
const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
  display: "swap",
});

const SITE_URL = "https://alexendros.pro";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "alexendros.pro",
    template: "%s | Alexendros",
  },
  description:
    "alexendros.pro — Productos digitales y presencia profesional por Alexendros.",
  applicationName: "alexendros.pro",
  authors: [{ name: "Alejandro Domingo Agustí", url: "https://alexendros.me" }],
  creator: "Alexendros",
  publisher: "Alexendros",
  category: "technology",
  keywords: ["Alexendros", "alexendros.pro", "SaaS"],
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    locale: "es_ES",
    siteName: "alexendros.pro",
    title: "alexendros.pro",
    description:
      "Productos digitales y presencia profesional por Alexendros.",
  },
  twitter: {
    card: "summary_large_image",
    title: "alexendros.pro",
    description:
      "Productos digitales y presencia profesional por Alexendros.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
      data-mode="dark"
      data-accent="titanium"
      className={`${geistSans.variable} ${geistMono.variable} ${interDisplay.variable}`}
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
