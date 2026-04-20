import type { Metadata } from "next";
import { ArrowUpRight, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "KitOS — Próximamente",
  description:
    "KitOS — Plataforma de kits digitales profesionales. Apúntate a la waitlist y sé el primero en acceder.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">Saltar al contenido</a>

      <main id="main" className="site-shell hero-section" aria-labelledby="hero-title">
        <span className="hero-eyebrow">KitOS · by Alexendros</span>

        <h1 id="hero-title" className="hero-signature">
          Tu presencia digital,<br />
          lista en minutos.
        </h1>

        <p className="prose-lead">
          <strong className="text-foreground">KitOS</strong> es la plataforma de kits digitales
          verticalizados para profesionales — artistas, abogados, gestores. Presencia web,
          booking y pagos en un solo kit. Lanzamiento en Q3 2026. Mientras tanto, conoce
          el trabajo detrás en{" "}
          <a
            href="https://alexendros.me"
            target="_blank"
            rel="noopener noreferrer"
            className="link-cta"
          >
            alexendros.me
            <ArrowUpRight
              className="link-cta__icon"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </a>
          .
        </p>

        <a
          href="mailto:contacto@alexendros.me?subject=Waitlist%20KitOS&body=Hola%2C%20me%20interesa%20KitOS.%20Mi%20email%20es%3A%20"
          className="link-cta"
          aria-label="Apuntarse a la waitlist de KitOS por email"
        >
          <Bell size={16} strokeWidth={2} aria-hidden="true" />
          Avísame cuando esté listo
        </a>

        <div className="pro-status" role="status" aria-live="polite">
          <span className="pro-status__dot" aria-hidden="true" />
          <span className="pro-status__label">Q3 2026 · Valencia</span>
        </div>
      </main>
    </>
  );
}
