import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad conforme al Art. 13 RGPD y LOPDGDD.",
};

export default function PrivacidadPage() {
  return (
    <>
      <h1>Política de Privacidad</h1>

      <p>
        En cumplimiento del Art. 13 del Reglamento (UE) 2016/679 del Parlamento
        Europeo y del Consejo, de 27 de abril de 2016 (RGPD), y de la Ley
        Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y
        garantía de los derechos digitales (LOPDGDD), se informa de las
        siguientes condiciones del tratamiento de datos personales:
      </p>

      <h2>1. Identidad del responsable del tratamiento</h2>
      <ul>
        <li>
          <strong className="text-foreground">Responsable:</strong> Alejandro
          Domingo Agustí
        </li>
        <li>
          <strong className="text-foreground">NIF:</strong> 21002968N
        </li>
        <li>
          <strong className="text-foreground">Domicilio:</strong> Madrid, España
        </li>
        <li>
          <strong className="text-foreground">Email de contacto:</strong>{" "}
          <a href="mailto:hola@alexendros.me">hola@alexendros.me</a>
        </li>
      </ul>

      <h2>2. Delegado de Protección de Datos (DPD)</h2>
      <p>
        No se ha designado Delegado de Protección de Datos al no concurrir las
        circunstancias previstas en el Art. 37 RGPD (organización con menos de
        250 empleados, tratamiento no masivo de categorías especiales de datos).
      </p>

      <h2>3. Finalidades y bases legales del tratamiento</h2>
      <ul>
        <li>
          <strong className="text-foreground">
            Gestión de cuenta y prestación del servicio
          </strong>{" "}
          — Base legal: Art. 6.1.b RGPD (ejecución de un contrato).
        </li>
        <li>
          <strong className="text-foreground">
            Envío de comunicaciones comerciales
          </strong>{" "}
          — Base legal: Art. 6.1.a RGPD (consentimiento explícito del
          interesado).
        </li>
        <li>
          <strong className="text-foreground">
            Facturación y cumplimiento fiscal
          </strong>{" "}
          — Base legal: Art. 6.1.c RGPD (obligación legal).
        </li>
        <li>
          <strong className="text-foreground">
            Seguridad y prevención de fraude
          </strong>{" "}
          — Base legal: Art. 6.1.f RGPD (interés legítimo del responsable).
        </li>
      </ul>

      <h2>4. Destinatarios de los datos</h2>
      <p>
        Los datos podrán ser comunicados a los siguientes encargados del
        tratamiento, en virtud de la prestación de sus servicios:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">Stripe, Inc.</strong> — Gestión de
          pagos y prevención de fraude.
        </li>
        <li>
          <strong className="text-foreground">Supabase, Inc.</strong> — Base de
          datos y autenticación (región EU West).
        </li>
        <li>
          <strong className="text-foreground">Resend, Inc.</strong> — Envío de
          correos electrónicos transaccionales.
        </li>
        <li>
          <strong className="text-foreground">Vercel, Inc.</strong> — Hosting y
          entrega de contenido web (CDN).
        </li>
      </ul>

      <h2>5. Transferencias internacionales de datos</h2>
      <p>
        Algunos de los proveedores anteriores tienen su sede en Estados Unidos.
        Las transferencias se realizan con las garantías adecuadas previstas en
        el Art. 46 RGPD, mediante Cláusulas Contractuales Tipo (CCT) adoptadas
        por la Comisión Europea. En particular:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">Stripe:</strong> SCCs firmadas
          conforme al Art. 46.2.c RGPD.
        </li>
        <li>
          <strong className="text-foreground">Vercel:</strong> SCCs firmadas
          conforme al Art. 46.2.c RGPD, con opción de región EU disponible.
        </li>
        <li>
          <strong className="text-foreground">Supabase:</strong> DPA disponible,
          procesamiento en región EU West (Frankfurt).
        </li>
        <li>
          <strong className="text-foreground">Resend:</strong> DPA disponible
          para tratamiento de email transaccional.
        </li>
      </ul>

      <h2>6. Plazos de conservación</h2>
      <ul>
        <li>
          <strong className="text-foreground">Usuarios inactivos:</strong> 3
          años desde el último acceso (Art. 5.1.e RGPD — principio de
          limitación del plazo de conservación).
        </li>
        <li>
          <strong className="text-foreground">Datos fiscales:</strong> 5 años
          (Art. 30 LGT y Art. 30 Código de Comercio).
        </li>
        <li>
          <strong className="text-foreground">Logs de acceso:</strong> Máximo 1
          año (Art. 12 LSSI-CE).
        </li>
        <li>
          <strong className="text-foreground">Datos post-baja:</strong> 90 días
          antes de la anonimización definitiva.
        </li>
        <li>
          <strong className="text-foreground">Audit logs:</strong> 5 años
          (trazabilidad fiscal y legal).
        </li>
      </ul>

      <h2>7. Derechos de los interesados</h2>
      <p>
        El interesado tiene derecho a ejercer, en cualquier momento, los
        siguientes derechos:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">Acceso</strong> — Conocer qué
          datos se tratan y con qué finalidad.
        </li>
        <li>
          <strong className="text-foreground">Rectificación</strong> —
          Corregir datos inexactos o incompletos.
        </li>
        <li>
          <strong className="text-foreground">Supresión</strong> — Solicitar la
          eliminación de los datos («derecho al olvido»).
        </li>
        <li>
          <strong className="text-foreground">Portabilidad</strong> — Obtener
          los datos en formato estructurado, de uso común y lectura mecánica.
        </li>
        <li>
          <strong className="text-foreground">Oposición</strong> — Oponerse al
          tratamiento basado en interés legítimo.
        </li>
        <li>
          <strong className="text-foreground">Limitación</strong> — Solicitar
          que se restrinja el tratamiento en determinadas circunstancias.
        </li>
      </ul>
      <p>
        Para ejercer estos derechos, puede dirigirse a:{" "}
        <a href="mailto:hola@alexendros.me">hola@alexendros.me</a>
      </p>

      <h2>8. Derecho a presentar reclamación ante la AEPD</h2>
      <p>
        Si considera que sus derechos no han sido debidamente atendidos, tiene
        derecho a presentar una reclamación ante la Agencia Española de
        Protección de Datos (AEPD), autoridad de control competente en España,
        a través de su sitio web:{" "}
        <a
          href="https://www.aepd.es"
          target="_blank"
          rel="noopener noreferrer"
        >
          aepd.es
        </a>
        .
      </p>

      <p>
        <em>Última actualización: abril 2026</em>
      </p>
    </>
  );
}
