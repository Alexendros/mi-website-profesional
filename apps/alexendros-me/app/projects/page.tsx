import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Portfolio de proyectos: KitOS, alexendros.me y más.",
};

const projects = [
  {
    title: "KitOS",
    description:
      "Plataforma SaaS de kits digitales verticalizados. Cada Kit es un producto independiente dirigido a un sector específico, construido sobre infraestructura compartida: auth, pagos, email, analytics.",
    stack: ["Next.js", "Supabase", "Prisma", "Stripe", "Turborepo", "Vercel"],
    status: "En producción",
    statusVariant: "default" as const,
    url: "https://alexendros.pro",
    year: "2024",
  },
  {
    title: "alexendros.me",
    description:
      "Portfolio y marca personal. Sitio estático con Next.js, Tailwind v4, tokens oklch y componentes shadcn/ui.",
    stack: ["Next.js", "Tailwind v4", "Vercel"],
    status: "En desarrollo",
    statusVariant: "secondary" as const,
    url: "https://alexendros.me",
    year: "2025",
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Proyectos</h1>
      <p className="text-muted-foreground leading-relaxed">
        Portfolio de proyectos activos. Cada uno incluye stack específico,
        estado actual y enlace a producción o demo.
      </p>

      <div className="space-y-6">
        {projects.map((project) => (
          <Card key={project.title} className="border-border">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground text-xl">
                    {project.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {project.year}
                  </p>
                </div>
                <Badge variant={project.statusVariant}>{project.status}</Badge>
              </div>
              <CardDescription className="text-muted-foreground leading-relaxed">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver proyecto →
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
