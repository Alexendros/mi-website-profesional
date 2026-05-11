const BASE_URL = "https://alexendros.pro";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Alexendros",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  sameAs: [
    "https://github.com/alexendros",
    "https://linkedin.com/in/alejandrodomingo",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hola@alexendros.pro",
    availableLanguage: ["Spanish", "English"],
  },
} as const;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Alexendros",
  url: BASE_URL,
  description: "Plataforma SaaS de kits digitales para profesionales",
  inLanguage: "es",
  author: {
    "@type": "Person",
    name: "Alejandro Domingo Agustí",
    alternateName: "Alexendros",
  },
} as const;

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alejandro Domingo Agustí",
  alternateName: "Alexendros",
  url: "https://alexendros.me",
  jobTitle: "Fullstack Developer & Entrepreneur",
  knowsAbout: ["Next.js", "TypeScript", "Supabase", "Stripe", "RGPD"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Valencia",
    addressCountry: "ES",
  },
} as const;

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  url: string;
  price: number;
  currency?: string;
  availability?: "InStock" | "PreOrder" | "SoldOut";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: product.url,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency ?? "EUR",
      availability: `https://schema.org/${product.availability ?? "InStock"}`,
      url: product.url,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0] ?? "",
    },
    provider: {
      "@type": "Organization",
      name: "Alexendros",
      url: BASE_URL,
    },
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
