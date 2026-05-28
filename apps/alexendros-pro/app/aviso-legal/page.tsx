import type { Metadata } from "next";
import Link from "next/link";
import { getContactPublicConfig } from "../../lib/env";
import { LegalPageLayout, LegalSection } from "../../components/legal-page";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal e información del titular de alexendros.pro conforme a la LSSI-CE.",
  alternates: { canonical: "/aviso-legal" },
  robots: { index: true, follow: true },
};

export default function AvisoLegalPage() {
  const { email } = getContactPublicConfig();

  return (
    <LegalPageLayout title="Aviso legal">
      <LegalSection title="Titular del sitio">
        <p>
          Este sitio web (alexendros.pro) es titularidad de Alejandro Domingo Agustí (Alexendros),
          con domicilio profesional en Valencia (España). Contacto:{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 text-[var(--color-text-primary)]"
          >
            {email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Objeto">
        <p>
          El sitio tiene como finalidad presentar los servicios profesionales de desarrollo web y
          software del titular, así como facilitar el contacto con clientes potenciales.
        </p>
      </LegalSection>

      <LegalSection title="Propiedad intelectual">
        <p>
          Los contenidos, marca y diseño de este sitio pertenecen a su titular, salvo indicación en
          contrario. Queda prohibida su reproducción sin autorización expresa.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilidad">
        <p>
          El titular no se responsabiliza del uso que terceros puedan hacer de la información
          publicada, ni de los daños derivados de su uso. El tratamiento de datos personales se
          rige por la{" "}
          <Link href="/privacidad" className="underline underline-offset-2 text-[var(--color-text-primary)]">
            política de privacidad
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
