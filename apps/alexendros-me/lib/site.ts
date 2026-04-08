export const siteConfig = {
  name: "Alexendros",
  fullName: "Alejandro Domingo Agustí",
  url: "https://alexendros.me",
  email: "hola@alexendros.me",
  links: {
    pro: "https://alexendros.pro",
    github: "https://github.com/alexendros",
    linkedin: "https://linkedin.com/in/alexendros",
    twitter: "https://x.com/alexendros",
  },
  nav: [
    { href: "/about", label: "Sobre mí" },
    { href: "/projects", label: "Proyectos" },
    { href: "/uses", label: "Uses" },
    { href: "/contact", label: "Contacto" },
  ],
  legalNav: [
    { href: "/legal/aviso-legal", label: "Aviso legal" },
    { href: "/legal/privacidad", label: "Privacidad" },
    { href: "/legal/cookies", label: "Cookies" },
  ],
} as const;
