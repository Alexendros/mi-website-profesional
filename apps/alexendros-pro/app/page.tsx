import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "En construcción",
  description:
    "KitOS — Plataforma de kits digitales profesionales. Estamos afinando los detalles. Vuelve pronto.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">Saltar al contenido</a>

      <main id="main" className="site-shell hero-section" aria-labelledby="hero-title">
        <span className="hero-eyebrow">KitOS · by Alexendros</span>

        <h1 id="hero-title" className="hero-signature">
          En construcción.<br />
          Volvemos pronto con algo mejor.
        </h1>

        <p className="prose-lead">
          Estamos afinando <strong className="text-foreground">KitOS</strong>, la plataforma de
          kits digitales verticalizados para profesionales. Mientras tanto, puedes ver el
          trabajo y el criterio detrás del código en{" "}
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

        <div className="pro-status" role="status" aria-live="polite">
          <span className="pro-status__dot" aria-hidden="true" />
          <span className="pro-status__label">Próximamente · Valencia</span>
        </div>
      </main>
    </>
  );
}
