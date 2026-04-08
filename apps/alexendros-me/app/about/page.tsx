import type { Metadata } from "next";
import { Separator } from "@repo/ui/components/separator";

export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Fullstack developer con background jurídico. Fundador de KitOS. Madrid.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 space-y-12">
      <h1 className="text-3xl font-bold text-foreground">Sobre mí</h1>

      {/* Acto I */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Acto I — Origen
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Formación en derecho y ejercicio de asesoramiento legal y consultoría
          jurídica. Años de trabajo con documentación técnica, contratos y
          procesos que exigen precisión absoluta en los detalles. Paralelamente:
          automatización de workflows, primeros proyectos de software.
        </p>
      </section>

      <Separator />

      {/* Acto II */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Acto II — Transición
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          El software empezó a ocupar más espacio que el derecho. Formación
          autodidacta intensiva en stack moderno: Next.js, Supabase, Stripe,
          Docker, n8n. Primeros proyectos freelance. Apertura del repositorio
          público. El background jurídico no desapareció: se convirtió en
          ventaja competitiva en RGPD, contratos SaaS y compliance técnico.
        </p>
      </section>

      <Separator />

      {/* Acto III */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Acto III — Actualidad
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Fundador en activo de KitOS (
          <a
            href="https://alexendros.pro"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            alexendros.pro
          </a>
          ). Plataforma multi-Kit en producción. Build in public documentado.
          Disponible para consultoría técnica en proyectos donde la intersección
          tech + legal aporta valor real.
        </p>
      </section>

      <Separator />

      {/* UVP */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          Propuesta de valor
        </h2>
        <blockquote className="border-l-2 border-primary pl-4">
          <p className="text-foreground font-medium leading-relaxed">
            &ldquo;El único fullstack developer con background jurídico real que
            construye y opera su propio SaaS vertical en producción.&rdquo;
          </p>
        </blockquote>

        {/* Diferenciación table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-medium text-foreground">
                  Dimensión
                </th>
                <th className="text-center py-3 px-4 font-medium text-foreground">
                  Alexendros
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Dev genérico
                </th>
                <th className="text-center py-3 pl-4 font-medium text-muted-foreground">
                  Abogado estándar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">
                  Código fullstack enterprise
                </td>
                <td className="py-3 px-4 text-center text-primary">✓</td>
                <td className="py-3 px-4 text-center text-muted-foreground">
                  Variable
                </td>
                <td className="py-3 pl-4 text-center text-muted-foreground">
                  —
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">
                  Legal / RGPD (background real)
                </td>
                <td className="py-3 px-4 text-center text-primary">✓</td>
                <td className="py-3 px-4 text-center text-muted-foreground">
                  Superficial
                </td>
                <td className="py-3 pl-4 text-center text-primary">✓</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">
                  Producto SaaS propio en producción
                </td>
                <td className="py-3 px-4 text-center text-primary">✓</td>
                <td className="py-3 px-4 text-center text-muted-foreground">
                  —
                </td>
                <td className="py-3 pl-4 text-center text-muted-foreground">
                  —
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">
                  Intersección tech + derecho
                </td>
                <td className="py-3 px-4 text-center text-primary">✓</td>
                <td className="py-3 px-4 text-center text-muted-foreground">
                  —
                </td>
                <td className="py-3 pl-4 text-center text-muted-foreground">
                  —
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">
                  Build in public documentado
                </td>
                <td className="py-3 px-4 text-center text-primary">✓</td>
                <td className="py-3 px-4 text-center text-muted-foreground">
                  Variable
                </td>
                <td className="py-3 pl-4 text-center text-muted-foreground">
                  —
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
