export function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

// Convierte Markdown a texto plano legible, preservando los saltos de párrafo.
// No es un parser completo: elimina la sintaxis visible (énfasis, encabezados,
// enlaces, listas, código) para no mostrar marcas crudas (`**`, `#`, `[]()`).
export function mdToPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "") // bloques de código
    .replace(/`([^`]+)`/g, "$1") // código en línea
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // imágenes → alt
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // enlaces → texto
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // encabezados
    .replace(/^\s{0,3}>\s?/gm, "") // citas
    .replace(/^\s{0,3}[-*+]\s+/gm, "") // listas con viñeta
    .replace(/^\s{0,3}\d+\.\s+/gm, "") // listas numeradas
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // negrita
    .replace(/(\*|_)(.*?)\1/g, "$2") // cursiva
    .replace(/~~(.*?)~~/g, "$1") // tachado
    .replace(/\n{3,}/g, "\n\n") // colapsar líneas en blanco
    .trim();
}

// Resumen en una sola línea para tarjetas y metadatos (sin saltos ni sintaxis),
// recortado a `maxLen` por límite de palabra.
export function mdExcerpt(md: string, maxLen = 160): string {
  const text = mdToPlainText(md).replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
