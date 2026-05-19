import type { Metadata } from "next";
import { ArrowUpRight, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "alexendros.pro — Próximamente",
  description:
    "Plataforma de Alexendros. Apúntate a la waitlist y sé el primero en acceder.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-[var(--radius-md)] focus-visible:border focus-visible:border-[var(--color-border-subtle)] focus-visible:bg-[var(--color-surface-100)] focus-visible:px-3 focus-visible:py-2 focus-visible:font-mono focus-visible:text-sm focus-visible:text-[var(--color-text-primary)]"
      >
        Saltar al contenido
      </a>

      <main
        id="main"
        aria-labelledby="hero-title"
        className="relative mx-auto flex min-h-svh w-full max-w-[64rem] flex-col items-start justify-center gap-6 px-6 py-24 md:px-10 md:py-32"
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
          <span
            aria-hidden="true"
            className="block h-px w-10 bg-[var(--color-border-strong)]"
          />
          <span className="text-[var(--color-brand-accent)]">
            alexendros.pro · by Alexendros
          </span>
        </div>

        {/* Display heading */}
        <h1
          id="hero-title"
          className="max-w-[22ch] text-balance font-semibold text-[var(--color-text-primary)]"
          style={{
            fontSize: "var(--text-display)",
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-display)",
          }}
        >
          Tu presencia digital,
          <br />
          <span className="text-[var(--color-brand-primary-hc)]">
            lista en minutos.
          </span>
        </h1>

        {/* Lead paragraph */}
        <p
          className="text-pretty text-[var(--color-text-secondary)]"
          style={{
            maxWidth: "var(--measure-prose)",
            fontSize: "1.0625rem",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          <span className="text-[var(--color-text-primary)]">Alexendros</span>{" "}
          es la marca personal de Alejandro Domingo Agustí, desarrollador
          fullstack en Valencia. Plataforma en construcción — lanzamiento Q3
          2026.
        </p>

        {/* Action row */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <a
            href="mailto:contacto@alexendros.me?subject=Waitlist%20alexendros.pro&body=Hola%2C%20me%20interesa%20la%20plataforma.%20Mi%20email%20es%3A%20"
            aria-label="Avísame cuando esté listo — apuntarse a la waitlist por email"
            className="group inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-brand-primary-hc)] bg-[var(--color-brand-primary)] px-5 py-3 text-sm font-medium text-[var(--color-brand-primary-fg)] transition-[background-color,box-shadow] hover:bg-[var(--color-brand-primary-hc)] hover:shadow-[var(--shadow-glow-brand)]"
            style={{
              transitionDuration: "var(--dur-base)",
              transitionTimingFunction: "var(--ease-expo)",
            }}
          >
            <Bell size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>Avísame cuando esté listo</span>
          </a>

          <a
            href="https://alexendros.me"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-100)] px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-200)]"
            style={{
              transitionDuration: "var(--dur-base)",
              transitionTimingFunction: "var(--ease-expo)",
            }}
          >
            <span>Ver alexendros.me</span>
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
              style={{
                transitionDuration: "var(--dur-fast)",
                transitionTimingFunction: "var(--ease-expo)",
              }}
            />
          </a>
        </div>

        {/* Status pill */}
        <div
          role="status"
          aria-live="polite"
          className="mt-8 inline-flex items-center gap-3 rounded-[var(--radius-full)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-100)] px-4 py-2 font-mono text-xs text-[var(--color-text-secondary)]"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brand-primary)] opacity-60"
              style={{ willChange: "transform, opacity" }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brand-primary-hc)]" />
          </span>
          <span className="tracking-[0.08em] uppercase">
            Q3 2026 · Valencia
          </span>
        </div>

        {/* Signature footer */}
        <footer className="mt-auto pt-16 font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">
          <span aria-hidden="true">◈</span>
          <span className="mx-2">Vergina Imperial</span>
          <span>/</span>
          <span className="mx-2">alexendros.pro</span>
        </footer>
      </main>
    </>
  );
}
