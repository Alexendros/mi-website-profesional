import type { Metadata } from "next";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con Alejandro Agustí. Email, GitHub, LinkedIn.",
};

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/alexendros",
    display: "github.com/alexendros",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/alexendros",
    display: "linkedin.com/in/alexendros",
  },
  {
    label: "Twitter / X",
    href: "https://x.com/alexendros",
    display: "x.com/alexendros",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Contacto</h1>
        <p className="text-muted-foreground leading-relaxed">
          Disponible para consultoría técnica en proyectos donde la intersección
          tech + legal aporta valor real.
        </p>
      </div>

      {/* Email */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Email
        </h2>
        <Button asChild>
          <a href="mailto:hola@alexendros.me">hola@alexendros.me</a>
        </Button>
      </section>

      <Separator />

      {/* Social links */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Redes
        </h2>
        <ul className="space-y-3">
          {socials.map((social) => (
            <li key={social.label} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-24">
                {social.label}
              </span>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {social.display}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      {/* Location */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Ubicación
        </h2>
        <p className="text-sm text-muted-foreground">Madrid, España</p>
      </section>
    </div>
  );
}
