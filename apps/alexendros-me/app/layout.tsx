import type { Metadata } from "next";

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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
