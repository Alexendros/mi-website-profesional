import { siteConfig } from "./site";

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alejandro Domingo Agustí",
  alternateName: "Alexendros",
  url: "https://alexendros.me",
  jobTitle: "Fullstack Developer",
  description:
    "Fullstack developer especializado en Next.js y Supabase. Fundador de KitOS.",
  knowsAbout: ["Next.js", "TypeScript", "Supabase", "Stripe", "RGPD"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Madrid",
    addressCountry: "ES",
  },
  sameAs: [
    siteConfig.links.github,
    siteConfig.links.linkedin,
    siteConfig.links.twitter,
  ],
} as const;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Alexendros",
  url: "https://alexendros.me",
  description: siteConfig.description,
  author: { "@type": "Person", name: "Alejandro Domingo Agustí" },
  inLanguage: "es",
} as const;
