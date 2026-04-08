import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de alexendros.me conforme al Art. 10 LSSI-CE.",
};

export default function AvisoLegalPage() {
  return (
    <>
      <h1>Aviso Legal</h1>

      <p>
        En cumplimiento del Art. 10 de la Ley 34/2002, de 11 de julio, de
        Servicios de la Sociedad de la Información y de Comercio Electrónico
        (LSSI-CE), se informa:
      </p>

      <h2>1. Datos del titular</h2>
      <ul>
        <li>
          <strong className="text-foreground">Titular:</strong> Alejandro
          Domingo Agustí
        </li>
        <li>
          <strong className="text-foreground">NIF:</strong> 21002968N
        </li>
        <li>
          <strong className="text-foreground">Domicilio:</strong> Madrid, España
          (dirección completa disponible a efectos legales previa solicitud)
        </li>
        <li>
          <strong className="text-foreground">Email de contacto:</strong>{" "}
          <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>
        </li>
        <li>
          <strong className="text-foreground">Actividad:</strong> Desarrollo de
          software y servicios digitales
        </li>
        <li>
          <strong className="text-foreground">Registro Mercantil:</strong> N/A
          (persona física, actividad profesional)
        </li>
        <li>
          <strong className="text-foreground">Colegio profesional:</strong> N/A
        </li>
      </ul>

      <h2>2. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos del sitio web{" "}
        <a
          href="https://alexendros.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          alexendros.me
        </a>{" "}
        — incluyendo textos, imágenes, diseños, logotipos, código fuente y
        cualquier otro elemento — son propiedad de Alejandro Domingo Agustí o de
        terceros que han autorizado su uso, y están protegidos por la normativa
        española e internacional sobre propiedad intelectual e industrial.
      </p>
      <p>
        Queda prohibida la reproducción, distribución, comunicación pública o
        transformación de cualquier contenido del sitio sin autorización expresa
        del titular, salvo en los casos permitidos por la ley.
      </p>

      <h2>3. Exclusión de responsabilidad</h2>
      <p>
        El titular no garantiza la disponibilidad, continuidad ni infalibilidad
        del funcionamiento del sitio web. Asimismo, no se hace responsable de
        los daños y perjuicios que puedan derivarse de la falta de
        disponibilidad o de errores en los contenidos, salvo en los casos en que
        dichos daños sean causados dolosamente.
      </p>
      <p>
        El titular tampoco se hace responsable de los contenidos de terceros que
        puedan estar enlazados desde este sitio web, ni de la disponibilidad o
        veracidad de dichos contenidos.
      </p>

      <h2>4. Política de enlaces</h2>
      <p>
        El establecimiento de un hipervínculo hacia este sitio web no implica
        ningún tipo de relación comercial o de cooperación entre el titular y el
        propietario del sitio desde el que se establece el enlace.
      </p>
      <p>
        El titular se reserva el derecho a solicitar la retirada de cualquier
        enlace que, a su criterio, resulte inadecuado.
      </p>

      <h2>5. Legislación aplicable y jurisdicción</h2>
      <p>
        Las presentes condiciones se rigen por la legislación española. Para la
        resolución de cualquier controversia derivada del acceso o uso de este
        sitio web, las partes se someten, con renuncia expresa a cualquier otro
        fuero, a la jurisdicción de los Juzgados y Tribunales de Valencia.
      </p>

      <h2>6. Modificaciones</h2>
      <p>
        El titular se reserva el derecho a modificar el presente aviso legal en
        cualquier momento. Se recomienda a los usuarios consultar periódicamente
        esta página.
      </p>

      <p>
        <em>Última actualización: abril 2026</em>
      </p>
    </>
  );
}
