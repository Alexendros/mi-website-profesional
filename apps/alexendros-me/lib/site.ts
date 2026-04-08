export const siteConfig = {
  name: "Alexendros",
  fullName: "Alejandro Domingo Agustí",
  title: "Alejandro Agustí — Fullstack Developer",
  description:
    "Fullstack developer especializado en Next.js y Supabase. Fundador de KitOS. Madrid.",
  url: "https://alexendros.me",
  email: "hola@alexendros.me",
  location: "Madrid, España",
  links: {
    pro: "https://alexendros.pro",
    github: "https://github.com/alexendros",
    linkedin: "https://linkedin.com/in/alexendros",
    twitter: "https://x.com/alexendros",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Sobre mí", href: "/about" },
    { label: "Proyectos", href: "/projects" },
    { label: "Uses", href: "/uses" },
    { label: "Contacto", href: "/contact" },
  ],
  legalNav: [
    { label: "Aviso legal", href: "/legal/aviso-legal" },
    { label: "Privacidad", href: "/legal/privacidad" },
    { label: "Cookies", href: "/legal/cookies" },
  ],
} as const;
