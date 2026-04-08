/**
 * Design tokens — oklch color system
 * Source of truth: packages/brand/styles/globals.css
 * Values here MUST match globals.css :root and kit overrides exactly.
 */

export const alexendrosTokens = {
  colors: {
    black: "oklch(0.09 0.005 240)",
    acidGreen: "oklch(0.72 0.22 142)",
    mineralGray: "oklch(0.65 0.01 240)",
    white: "oklch(0.95 0.005 240)",
  },
  surfaces: {
    bg: "oklch(0.09 0.005 240)",
    card: "oklch(0.13 0.008 240)",
    border: "oklch(0.22 0.01 240)",
  },
} as const;

export const kitTokens = {
  stagekit: {
    accent: "oklch(0.72 0.22 142)",
    secondary: "oklch(0.65 0.18 55)",
    surface: "oklch(0.11 0.006 240)",
    text: "oklch(0.95 0.005 240)",
  },
  lexkit: {
    accent: "oklch(0.45 0.12 250)",
    secondary: "oklch(0.70 0.10 80)",
    surface: "oklch(0.09 0.005 240)",
    text: "oklch(0.95 0.005 250)",
  },
  gestkit: {
    accent: "oklch(0.55 0.08 220)",
    secondary: "oklch(0.65 0.15 160)",
    surface: "oklch(0.09 0.005 240)",
    text: "oklch(0.95 0.005 220)",
  },
} as const;

/**
 * Semantic tokens — maps CSS custom property values to TypeScript.
 * These values mirror :root and [data-kit="*"] in globals.css exactly.
 * stagekit = default dark-acid theme (used by [data-kit="stagekit"] and :root)
 */
export const semanticTokens = {
  stagekit: {
    background: "oklch(0.09 0.005 240)",
    foreground: "oklch(0.95 0.005 240)",
    card: "oklch(0.13 0.008 240)",
    cardForeground: "oklch(0.95 0.005 240)",
    popover: "oklch(0.13 0.008 240)",
    popoverForeground: "oklch(0.95 0.005 240)",
    primary: "oklch(0.72 0.22 142)",
    primaryForeground: "oklch(0.09 0.005 240)",
    secondary: "oklch(0.17 0.008 240)",
    secondaryForeground: "oklch(0.95 0.005 240)",
    muted: "oklch(0.17 0.008 240)",
    mutedForeground: "oklch(0.65 0.01 240)",
    accent: "oklch(0.65 0.18 55)",
    accentForeground: "oklch(0.09 0.005 240)",
    destructive: "oklch(0.60 0.22 25)",
    destructiveForeground: "oklch(0.95 0.005 240)",
    border: "oklch(0.22 0.01 240)",
    input: "oklch(0.22 0.01 240)",
    ring: "oklch(0.72 0.22 142)",
    chart1: "oklch(0.72 0.22 142)",
    chart2: "oklch(0.65 0.18 55)",
    chart3: "oklch(0.65 0.16 240)",
    chart4: "oklch(0.75 0.15 70)",
    chart5: "oklch(0.60 0.22 25)",
    sidebar: "oklch(0.11 0.006 240)",
    sidebarForeground: "oklch(0.95 0.005 240)",
    sidebarPrimary: "oklch(0.72 0.22 142)",
    sidebarPrimaryForeground: "oklch(0.09 0.005 240)",
    sidebarAccent: "oklch(0.17 0.008 240)",
    sidebarAccentForeground: "oklch(0.95 0.005 240)",
    sidebarBorder: "oklch(0.22 0.01 240)",
    sidebarRing: "oklch(0.72 0.22 142)",
  },
  lexkit: {
    background: "oklch(0.09 0.005 240)",
    foreground: "oklch(0.95 0.005 240)",
    primary: "oklch(0.45 0.12 250)",
    primaryForeground: "oklch(0.95 0.005 250)",
    accent: "oklch(0.70 0.10 80)",
    accentForeground: "oklch(0.12 0.01 250)",
    ring: "oklch(0.45 0.12 250)",
    chart1: "oklch(0.45 0.12 250)",
    chart2: "oklch(0.70 0.10 80)",
    sidebarPrimary: "oklch(0.45 0.12 250)",
    sidebarRing: "oklch(0.45 0.12 250)",
  },
  gestkit: {
    background: "oklch(0.09 0.005 240)",
    foreground: "oklch(0.95 0.005 240)",
    primary: "oklch(0.55 0.08 220)",
    primaryForeground: "oklch(0.95 0.005 220)",
    accent: "oklch(0.65 0.15 160)",
    accentForeground: "oklch(0.13 0.005 220)",
    ring: "oklch(0.55 0.08 220)",
    chart1: "oklch(0.55 0.08 220)",
    chart2: "oklch(0.65 0.15 160)",
    sidebarPrimary: "oklch(0.55 0.08 220)",
    sidebarRing: "oklch(0.55 0.08 220)",
  },
} as const;
