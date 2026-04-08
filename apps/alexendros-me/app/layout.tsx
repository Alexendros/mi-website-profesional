import localFont from "next/font/local";
import "./globals.css";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/lib/site";
import { personJsonLd, websiteJsonLd } from "@/lib/structured-data";

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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [
      {
        url: "/og/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Alexendros — Fullstack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/opengraph-image.png"],
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
    >
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
