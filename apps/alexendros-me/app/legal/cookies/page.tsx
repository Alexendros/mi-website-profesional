import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Política de cookies de alexendros.me conforme a la Guía AEPD 2023.",
};

const cookieInventory = [
  {
    cookie: "sb-*",
    proveedor: "Supabase",
    tipo: "Necesaria",
    duracion: "Sesión",
    finalidad: "Autenticación SSR",
    consentimiento: "No (exenta)",
  },
  {
    cookie: "__stripe_*",
    proveedor: "Stripe",
    tipo: "Necesaria",
    duracion: "Sesión",
    finalidad: "Prevención fraude",
    consentimiento: "No (exenta)",
  },
  {
    cookie: "ph_*",
    proveedor: "PostHog",
    tipo: "Analítica",
    duracion: "1 año",
    finalidad: "Métricas de uso",
    consentimiento: "Sí",
  },
  {
    cookie: "cookie-consent",
    proveedor: "Propia",
    tipo: "Necesaria",
    duracion: "1 año",
    finalidad: "Preferencias cookies",
    consentimiento: "No (exenta)",
  },
];

export default function CookiesPage() {
  return (
    <>
      <h1>Política de Cookies</h1>

      <p>
        En cumplimiento de la Guía sobre el uso de las cookies publicada por la
        Agencia Española de Protección de Datos (AEPD) en 2023, y de la Ley
        34/2002 de Servicios de la Sociedad de la Información (LSSI-CE), se
        informa sobre el uso de cookies en{" "}
        <a
          href="https://alexendros.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          alexendros.me
        </a>
        .
      </p>

      <h2>¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que se almacenan en el
        dispositivo del usuario cuando visita un sitio web. Permiten que el
        sitio recuerde información sobre la visita, lo que facilita la
        navegación y mejora la experiencia del usuario.
      </p>
      <p>
        Según la normativa vigente, las cookies que no sean estrictamente
        necesarias para el funcionamiento del servicio requieren el
        consentimiento previo e informado del usuario.
      </p>

      <h2>Nota sobre este sitio</h2>
      <p>
        <strong className="text-foreground">alexendros.me es un sitio estático</strong>{" "}
        que actualmente no utiliza cookies de terceros con fines analíticos o
        publicitarios. La siguiente tabla documenta las cookies que{" "}
        <em>podrían</em> estar presentes cuando se integren servicios
        adicionales. Esta política se actualizará cuando dichos servicios sean
        activados.
      </p>

      <h2>Inventario de cookies</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cookie</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Finalidad</TableHead>
              <TableHead>Consentimiento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cookieInventory.map((row) => (
              <TableRow key={row.cookie}>
                <TableCell className="font-mono text-xs">{row.cookie}</TableCell>
                <TableCell>{row.proveedor}</TableCell>
                <TableCell>{row.tipo}</TableCell>
                <TableCell>{row.duracion}</TableCell>
                <TableCell>{row.finalidad}</TableCell>
                <TableCell>{row.consentimiento}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h2>Cookies necesarias (exentas)</h2>
      <p>
        Las cookies marcadas como &ldquo;exentas&rdquo; son técnicamente
        imprescindibles para el funcionamiento del servicio y no requieren
        consentimiento conforme al Art. 22.2 LSSI-CE y la Guía AEPD 2023. Se
        utilizan para:
      </p>
      <ul>
        <li>Mantener la sesión autenticada del usuario (Supabase).</li>
        <li>Prevenir el fraude en los pagos (Stripe).</li>
        <li>
          Recordar las preferencias de cookies del propio usuario (cookie
          propia).
        </li>
      </ul>

      <h2>Cookies analíticas (requieren consentimiento)</h2>
      <p>
        Las cookies de PostHog (<code className="font-mono text-xs text-foreground">ph_*</code>) se utilizan para
        analizar el comportamiento de los usuarios en el sitio web con el fin de
        mejorar el servicio. Estas cookies solo se activarán tras obtener el
        consentimiento explícito del usuario.
      </p>

      <h2>Derechos del usuario</h2>
      <p>El usuario tiene derecho a:</p>
      <ul>
        <li>
          <strong className="text-foreground">Retirar el consentimiento</strong>{" "}
          en cualquier momento, sin que ello afecte a la licitud del tratamiento
          basado en el consentimiento previo a su retirada.
        </li>
        <li>
          <strong className="text-foreground">
            Configurar su navegador
          </strong>{" "}
          para rechazar o eliminar cookies. Consulte la ayuda de su navegador
          para más información.
        </li>
        <li>
          <strong className="text-foreground">Solicitar información</strong>{" "}
          adicional sobre el tratamiento de sus datos a través de:{" "}
          <a href="mailto:hola@alexendros.me">hola@alexendros.me</a>
        </li>
      </ul>

      <h2>Modificaciones</h2>
      <p>
        Esta política de cookies puede modificarse en función de cambios
        legislativos o de la incorporación de nuevos servicios al sitio web. Se
        recomienda revisarla periódicamente.
      </p>

      <p>
        <em>Última actualización: abril 2026. Conforme a la Guía AEPD 2023.</em>
      </p>
    </>
  );
}
