import type { Metadata } from "next";
import { Badge } from "@repo/ui/components/badge";
import { Separator } from "@repo/ui/components/separator";

export const metadata: Metadata = {
  title: "Uses",
  description: "Herramientas, stack tecnológico y setup de desarrollo.",
};

const stack = [
  {
    category: "Framework & Runtime",
    items: ["Next.js 15", "TypeScript strict", "React 19", "Node.js 22"],
  },
  {
    category: "Estilos",
    items: ["Tailwind CSS v4", "shadcn/ui", "Radix UI"],
  },
  {
    category: "Base de datos & Auth",
    items: ["Supabase (PostgreSQL + Auth + Storage)", "Prisma 5"],
  },
  {
    category: "Pagos",
    items: ["Stripe (Subscriptions + Connect Express)"],
  },
  {
    category: "Email",
    items: ["React Email", "Resend"],
  },
  {
    category: "Deploy & Infraestructura",
    items: ["Vercel", "Turborepo", "GitHub Actions"],
  },
  {
    category: "Automatización",
    items: ["n8n (self-hosted)"],
  },
  {
    category: "Monitoreo",
    items: ["Sentry", "PostHog (EU)", "Better Uptime"],
  },
  {
    category: "Testing",
    items: ["Vitest", "Playwright"],
  },
  {
    category: "Editor & Herramientas",
    items: ["VS Code", "Claude Code"],
  },
];

export default function UsesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Uses</h1>
        <p className="text-muted-foreground leading-relaxed">
          Herramientas y tecnologías que uso día a día para construir productos.
        </p>
      </div>

      <div className="space-y-8">
        {stack.map((section, index) => (
          <div key={section.category}>
            {index > 0 && <Separator className="mb-8" />}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {section.category}
              </h2>
              <div className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <Badge key={item} variant="secondary" className="text-sm">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
