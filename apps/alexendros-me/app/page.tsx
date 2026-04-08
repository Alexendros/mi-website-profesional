import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Separator } from "@repo/ui/components/separator";

export default function Home() {
  return (
    <>
      {/* Hero — visible without scroll, answers: quien, que, para quien */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Construyo productos digitales que funcionan y cumplen la ley.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Fullstack developer. Fundador de{" "}
            <a
              href="https://alexendros.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              KitOS
            </a>
            . Background en derecho. Madrid.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/projects">Ver proyectos</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contacto</Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-3xl px-6" />

      {/* About brief */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold mb-4">Sobre mí</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Desarrollador fullstack y fundador de{" "}
              <strong className="text-foreground">KitOS</strong>, plataforma
              SaaS de kits digitales verticalizados para sectores específicos.
              Construyo con Next.js, Supabase y Stripe, con foco en rendimiento
              real (LCP &lt; 2s), conversión y cumplimiento legal
              (RGPD/LOPDGDD).
            </p>
            <p>
              Antes de dedicarme al software a tiempo completo combiné durante
              años la práctica jurídica —asesoramiento legal y consultoría— con
              el desarrollo de productos digitales. Esa intersección entre
              derecho y tecnología define la forma en que construyo: con
              precisión contractual en los detalles técnicos y con criterio de
              negocio desde el primer commit.
            </p>
            <p>
              Actualmente:{" "}
              <strong className="text-foreground">KitOS</strong> en producción
              en{" "}
              <a
                href="https://alexendros.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                alexendros.pro
              </a>
              , con StageKit (música electrónica), LexKit (despachos) y GestKit
              (gestorías) en roadmap.
            </p>
          </div>
          <div className="mt-6">
            <Button variant="link" asChild className="px-0">
              <Link href="/about">Leer más →</Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-3xl px-6" />

      {/* Projects preview */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold mb-6">Proyectos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">KitOS</CardTitle>
                  <Badge className="shrink-0">En producción</Badge>
                </div>
                <CardDescription>
                  Plataforma SaaS de kits digitales verticalizados. Next.js +
                  Supabase + Stripe + Turborepo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="https://alexendros.pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  alexendros.pro →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">alexendros.me</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    Rebuild activo
                  </Badge>
                </div>
                <CardDescription>
                  Portfolio y marca personal. Next.js static + Tailwind v4 +
                  oklch tokens.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-muted-foreground">
                  alexendros.me
                </span>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <Button variant="link" asChild className="px-0">
              <Link href="/projects">Ver todos los proyectos →</Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-3xl px-6" />

      {/* Stack */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold mb-6">Stack</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js",
              "TypeScript",
              "Supabase",
              "Prisma",
              "Stripe",
              "Tailwind CSS",
              "Turborepo",
              "Vercel",
              "React Email",
              "n8n",
            ].map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
