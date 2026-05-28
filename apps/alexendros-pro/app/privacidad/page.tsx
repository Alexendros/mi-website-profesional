import type { Metadata } from "next";
import { getContactPublicConfig } from "../../lib/env";
import { LegalPageLayout, LegalSection } from "../../components/legal-page";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de alexendros.pro: responsable, finalidad, base legal y derechos sobre tus datos personales.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  const { email } = getContactPublicConfig();
  const mailto = (
    <a
      href={`mailto:${email}`}
      className="underline underline-offset-2 text-[var(--color-text-primary)]"
    >
      {email}
    </a>
  );

  return (
    <LegalPageLayout title="Política de privacidad">
      <LegalSection title="Responsable del tratamiento">
        <p>
          Alejandro Domingo Agustí (Alexendros), Valencia (España). Contacto: {mailto}.
        </p>
      </LegalSection>

      <LegalSection title="Finalidad">
        <p>
          Los datos que facilitas en el formulario de contacto (nombre, email y el contenido
          de tu mensaje) se tratan con la única finalidad de atender y responder a tu consulta.
          No se utilizan para envíos comerciales ni se elaboran perfiles. Junto al mensaje se
          registran la fecha y la dirección IP de envío como prueba del consentimiento y para
          prevenir abusos (spam) del formulario.
        </p>
      </LegalSection>

      <LegalSection title="Base legal">
        <p>
          El tratamiento se basa en tu consentimiento expreso, otorgado al marcar la casilla del
          formulario (art. 6.1.a del RGPD, Reglamento UE 2016/679).
        </p>
      </LegalSection>

      <LegalSection title="Conservación y destinatarios">
        <p>
          Los datos se conservan el tiempo necesario para gestionar tu consulta y, después, durante
          los plazos legalmente exigibles. El correo se gestiona a través de Resend
          (proveedor de envío de email) como encargado del tratamiento. No se ceden datos a
          terceros salvo obligación legal.
        </p>
      </LegalSection>

      <LegalSection title="Tus derechos">
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación
          y portabilidad escribiendo a {mailto}. Si consideras que el tratamiento no se ajusta a la
          normativa, puedes reclamar ante la Agencia Española de Protección de Datos (
          <a
            href="https://www.aepd.es"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-[var(--color-text-primary)]"
          >
            aepd.es
          </a>
          ).
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
