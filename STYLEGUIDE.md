# Guía de estilo de alexendros-pro

Convenciones para el código y la documentación.

## TypeScript

- Modo estricto activo (`strict: true` en `tsconfig.json`).
- Sin `any`. Usar `unknown` y validar antes de usar.
- Funciones puras siempre que se pueda. Estado en hooks o store
  declarado.
- Tipos antes que clases. Solo se usan clases si la API lo exige.

## Componentes React

- Server Components por defecto. Marcar `'use client'` solo cuando el
  componente requiera efectos del navegador, estado interactivo o
  bibliotecas que dependen de `window`.
- Componentes pequeños y composables. Si crece, partir.
- Props tipadas explícitamente. Default props sólo si reduce ruido.

## Estilos

- Tailwind v4. Evitar CSS suelto salvo en `globals.css` o tokens.
- Variantes y átomos antes que `@apply`.
- Tokens vienen del design system (`--color-*`) — definidos en `packages/brand/src/tokens.ts`
  y expuestos como variables CSS en el `globals.css` de cada app (sistema Vergina Imperial).
- Prohibido hardcodear colores fuera de `packages/brand/src/tokens.ts`.

## Naming

- Archivos: `kebab-case.tsx` para componentes, `kebab-case.ts` para
  módulos sin React.
- Componentes: `PascalCase`. Funciones y variables: `camelCase`.
- Hooks: prefijo `use`.
- Tipos: `PascalCase`. Sufijo `Props` para props de componente,
  `Schema` para validadores.

## Accesibilidad

- Cada elemento interactivo es alcanzable por teclado y tiene foco
  visible.
- Imágenes con `alt` descriptivo (vacío si decorativas).
- Contraste mínimo 4.5:1.
- Tamaño de objetivo táctil ≥ 24px (WCAG 2.2 AA, SC 2.5.8); excepciones
  para enlaces en línea dentro de texto. Verificado en E2E (`responsive.spec.ts`).

## Tests

- Vitest para unit. Playwright para E2E.
- Cobertura objetivo ≥ 60% en lógica de negocio. La UI se cubre con
  smoke E2E.
- Tests deterministas. Sin `Math.random` ni `Date.now()` sin control.

## Commits

- Conventional Commits.
- Cuerpo del commit en español, encabezado en inglés breve si aporta
  uniformidad. La regla principal: claridad.

## Documentación

- Castellano peninsular.
- Imperativo en READMEs (`Instala`, `Configura`).
- Primera persona plural en `CONTRIBUTING.md`.
- Tercera persona objetiva en `ARCHITECTURE.md` y `SECURITY.md`.
- Marcas (Vergina Imperial, Iniciativas-Alexendros, Apsys) tratadas como
  nombres propios.
