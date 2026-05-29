import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Code2,
  Compass,
  Mail,
  MessageCircle,
  Wrench,
} from "lucide-react";
import { getContactPublicConfig } from "../lib/env";
import { ContactForm } from "../components/contact-form";

export const metadata: Metadata = {
  title: { absolute: "Alexendros · Desarrollo web y SaaS a medida en Valencia" },
  description:
    "Alejandro Domingo Agustí (Alexendros), desarrollador fullstack en Valencia. Diseño y construyo webs y productos SaaS con Next.js, Supabase y Stripe. Cuéntame tu proyecto.",
  alternates: { canonical: "/" },
};

const SERVICES = [
  {
    icon: Code2,
    title: "Desarrollo web y SaaS",
    body: "Webs y productos a medida con Next.js, TypeScript, Supabase y Stripe. Del MVP a producción, con rendimiento y SEO cuidados.",
  },
  {
    icon: Wrench,
    title: "Mantenimiento y evolución",
    body: "Soporte continuo, nuevas funcionalidades, actualizaciones de dependencias y monitorización. Tu producto siempre al día.",
  },
  {
    icon: Compass,
    title: "Consultoría y arquitectura",
    body: "Auditoría técnica, mejora de Core Web Vitals, arquitectura escalable y cumplimiento RGPD desde el diseño.",
  },
];

const PROCESS = [
  { step: "01", title: "Llamada de descubrimiento", body: "Entendemos tu objetivo, alcance y plazos. Sin compromiso." },
  { step: "02", title: "Propuesta y plan", body: "Te envío alcance cerrado, presupuesto y calendario de entregas." },
  { step: "03", title: "Entrega iterativa", body: "Construyo en ciclos cortos con demos frecuentes hasta el lanzamiento." },
];

export default function Home() {
  const { email, whatsapp, calendly } = getContactPublicConfig();

  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola Alejandro, me interesa hablar sobre un proyecto.")}`
    : null;
  const calendlyHref = calendly || null;
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent("Proyecto — alexendros.pro")}`;

  const sectionLabel =
    "flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]";
  const labelRule = "block h-px w-10 bg-[var(--color-border-strong)]";
  const card =
    "flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-100)] p-6";

  return (
    <>
      <a href="#contacto" className="skip-link">
        Saltar al formulario de contacto
      </a>

      <div className="relative mx-auto flex w-full max-w-[64rem] flex-col gap-24 px-6 py-20 md:px-10 md:py-28">
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="hero flex flex-col items-start gap-6">
          <div className={sectionLabel}>
            <span aria-hidden="true" className={labelRule} />
            <span className="text-[var(--color-brand-accent)]">
              alexendros.pro · by Alexendros
            </span>
          </div>

          <h1
            className="display max-w-[20ch] text-balance font-semibold text-[var(--color-text-primary)]"
            style={{
              fontSize: "var(--text-display)",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "var(--tracking-display)",
            }}
          >
            Webs y productos digitales{" "}
            <span className="text-[var(--color-brand-primary-hc)]">que generan negocio.</span>
          </h1>

          <p
            className="text-pretty text-[var(--color-text-secondary)]"
            style={{ maxWidth: "var(--measure-prose)", fontSize: "1.0625rem", lineHeight: "var(--leading-relaxed)" }}
          >
            Soy{" "}
            <span className="text-[var(--color-text-primary)]">Alejandro Domingo Agustí</span>{" "}
            (Alexendros), desarrollador fullstack en Valencia. Diseño y construyo webs y
            productos SaaS con Next.js, Supabase y Stripe: rápidos, accesibles y listos para
            escalar.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-brand-primary-hc)] bg-[var(--color-brand-primary)] px-5 py-3 text-sm font-medium text-[var(--color-brand-primary-fg)] transition-[background-color,box-shadow] hover:bg-[var(--color-brand-primary-hc)] hover:shadow-[var(--shadow-glow-brand)]"
              style={{ transitionDuration: "var(--dur-base)", transitionTimingFunction: "var(--ease-expo)" }}
            >
              <Mail size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>Cuéntame tu proyecto</span>
            </a>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-100)] px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-200)]"
            >
              <span>Ver la tienda</span>
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* ── Servicios ──────────────────────────────────────────── */}
        <section aria-labelledby="servicios-title" className="flex flex-col gap-8">
          <h2
            id="servicios-title"
            className="text-[1.625rem] font-semibold leading-tight text-[var(--color-text-primary)]"
          >
            Servicios
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, body }) => (
              <article key={title} className={card}>
                <Icon size={22} strokeWidth={1.6} aria-hidden="true" className="text-[var(--color-brand-primary-hc)]" />
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  {body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Proceso ────────────────────────────────────────────── */}
        <section aria-labelledby="proceso-title" className="flex flex-col gap-8">
          <h2
            id="proceso-title"
            className="text-[1.625rem] font-semibold leading-tight text-[var(--color-text-primary)]"
          >
            Cómo trabajo
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {PROCESS.map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-2">
                <span className="font-mono text-sm text-[var(--color-brand-accent)]">{step}</span>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Productos digitales (tienda) ───────────────────────── */}
        <section aria-labelledby="tienda-title" className="flex flex-col gap-8">
          <h2
            id="tienda-title"
            className="text-[1.625rem] font-semibold leading-tight text-[var(--color-text-primary)]"
          >
            Productos digitales
          </h2>
          <article className={`${card} md:flex-row md:items-center md:justify-between`}>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                Plantillas y recursos descargables
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]" style={{ lineHeight: "var(--leading-relaxed)", maxWidth: "var(--measure-prose)" }}>
                ¿Buscas algo listo para usar? Echa un vistazo a la tienda de productos digitales
                descargables.
              </p>
            </div>
            <Link
              href="/tienda"
              className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-200)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-strong)]"
            >
              <span>Ir a la tienda</span>
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </article>
        </section>

        {/* ── Contacto ───────────────────────────────────────────── */}
        <section id="contacto" aria-labelledby="contacto-title" className="flex flex-col gap-8 scroll-mt-8">
          <div className={sectionLabel}>
            <span aria-hidden="true" className={labelRule} />
            <span id="contacto-title">Contacto</span>
          </div>

          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col gap-4">
              <h2 className="text-balance text-2xl font-semibold text-[var(--color-text-primary)]">
                ¿Hablamos de tu proyecto?
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]" style={{ lineHeight: "var(--leading-relaxed)" }}>
                Escríbeme por el canal que prefieras. Respondo en menos de 24&nbsp;horas
                laborables.
              </p>
              <div className="flex flex-col gap-1 pt-2">
                {calendlyHref ? (
                  <a href={calendlyHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 text-sm text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary-hc)]">
                    <Calendar size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>Agendar una llamada</span>
                  </a>
                ) : null}
                {whatsappHref ? (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 text-sm text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary-hc)]">
                    <MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                ) : null}
                <a href={mailtoHref} className="inline-flex items-center gap-2 py-2 text-sm text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary-hc)]">
                  <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
                  <span>{email}</span>
                </a>
              </div>
            </div>

            <div className={card}>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="flex flex-col gap-4 border-t border-[var(--color-border-subtle)] pt-8 font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-tertiary)] md:flex-row md:items-center md:justify-between">
          <div>
            <span aria-hidden="true">◈</span>
            <span className="mx-2">Alexendros</span>
            <span>/</span>
            <span className="mx-2">Valencia</span>
          </div>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/tienda" className="inline-flex items-center py-1.5 hover:text-[var(--color-text-primary)]">Tienda</Link>
            <Link href="/aviso-legal" className="inline-flex items-center py-1.5 hover:text-[var(--color-text-primary)]">Aviso legal</Link>
            <Link href="/privacidad" className="inline-flex items-center py-1.5 hover:text-[var(--color-text-primary)]">Privacidad</Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
