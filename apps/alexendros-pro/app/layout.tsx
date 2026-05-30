import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { getBuildEnv } from "@repo/config/env";
import { LazyParticleBg } from "../components/lazy-particle-bg";
import { LazyAnalytics } from "../components/lazy-analytics";

const { VERCEL } = getBuildEnv();

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

// Vergina Imperial v0.2.2 · Inter weight 700 para hero h1.display.
// Outfit/Bricolage descatalogados (Inter aprobada como reemplazo definitivo).
const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700"],
  display: "swap",
});

const SITE_URL = "https://alexendros.pro";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alexendros · Desarrollo web y SaaS a medida en Valencia",
    template: "%s | Alexendros",
  },
  description:
    "Alejandro Domingo Agustí (Alexendros), desarrollador fullstack en Valencia. Diseño y construyo webs y productos SaaS con Next.js, Supabase y Stripe.",
  applicationName: "alexendros.pro",
  authors: [{ name: "Alejandro Domingo Agustí", url: "https://alexendros.me" }],
  creator: "Alexendros",
  publisher: "Alexendros",
  category: "technology",
  keywords: [
    "Alexendros",
    "desarrollador fullstack Valencia",
    "desarrollo web a medida",
    "desarrollo SaaS",
    "Next.js",
    "Supabase",
    "Stripe",
    "productos digitales",
  ],
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    locale: "es_ES",
    siteName: "alexendros.pro",
    title: "Alexendros · Desarrollo web y SaaS a medida",
    description:
      "Webs y productos digitales que generan negocio. Next.js, Supabase y Stripe. Cuéntame tu proyecto.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexendros · Desarrollo web y SaaS a medida",
    description:
      "Webs y productos digitales que generan negocio. Next.js, Supabase y Stripe.",
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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Alejandro Domingo Agustí",
      alternateName: "Alexendros",
      url: SITE_URL,
      image: `${SITE_URL}/icon`,
      jobTitle: "Desarrollador fullstack",
      knowsAbout: ["Next.js", "TypeScript", "Supabase", "Stripe", "React"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Valencia",
        addressCountry: "ES",
      },
      sameAs: ["https://alexendros.me"],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: "Alexendros — Desarrollo web y SaaS",
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      logo: `${SITE_URL}/icon`,
      description:
        "Desarrollo de webs y productos SaaS a medida con Next.js, Supabase y Stripe, mantenimiento y consultoría técnica.",
      areaServed: "ES",
      provider: { "@id": `${SITE_URL}/#person` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Valencia",
        addressCountry: "ES",
      },
    },
  ],
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
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        <LazyParticleBg />
        <main id="main">{children}</main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {VERCEL && <LazyAnalytics />}
      </body>
    </html>
  );
}
