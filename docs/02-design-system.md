# 02 — Design System

## Identidad visual: Alexendros × StageKit

```yaml
persona_marca: Desarrollador full-stack · comunidad techno/electrónica
tono: Técnico-creativo · oscuro · directo · underground-profesional
paleta: Dark-first · negro profundo + verde néon acid + gris mineral
tipografía:
  display: 'Geist' (Vercel) · alternativa: 'Inter'
  mono: 'Geist Mono'
shadcn_theme: dark (base)
```

## Tokens de color (CSS variables)

```css
:root {
  /* Brand */
  --brand-primary: oklch(0.72 0.22 142);     /* Verde acid #7CFC00 equiv */
  --brand-secondary: oklch(0.15 0.01 240);   /* Negro azulado profundo */
  --brand-accent: oklch(0.65 0.18 55);       /* Ámbar/naranja sutil */

  /* Surfaces */
  --bg: oklch(0.09 0.005 240);               /* #0a0a0f */
  --surface: oklch(0.13 0.008 240);          /* #141420 */
  --surface-2: oklch(0.17 0.008 240);        /* #1a1a28 */
  --surface-3: oklch(0.22 0.01 240);         /* #22222f */

  /* Text */
  --text: oklch(0.95 0.005 240);             /* Blanco suave */
  --text-muted: oklch(0.65 0.01 240);        /* Gris medio */
  --text-faint: oklch(0.40 0.008 240);       /* Gris oscuro */

  /* Semantic */
  --success: oklch(0.68 0.18 142);
  --warning: oklch(0.75 0.15 70);
  --error: oklch(0.60 0.22 25);
  --info: oklch(0.65 0.16 240);

  /* Radius (shadcn compatible) */
  --radius: 0.5rem;
}
```

## shadcn/ui — Config

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## Componentes obligatorios a instalar

```bash
npx shadcn@latest add button card input label
npx shadcn@latest add dialog sheet drawer
npx shadcn@latest add form select textarea
npx shadcn@latest add table badge avatar
npx shadcn@latest add navigation-menu tabs
npx shadcn@latest add toast sonner
npx shadcn@latest add skeleton separator
```

## Reglas UI para Claude Code

```
- SIEMPRE usar variantes de shadcn antes de crear componente custom
- Botones primarios: variant="default" (usa --brand-primary)
- Iconos: SOLO lucide-react (ya incluido en shadcn)
- No usar color directamente en className: usar tokens CSS var()
- Modales: Dialog para desktop, Drawer para mobile (responsive automático)
- Loading states: Skeleton de shadcn, nunca spinner custom
```