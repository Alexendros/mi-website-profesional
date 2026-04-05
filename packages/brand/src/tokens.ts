/**
 * Design tokens — oklch color system
 * Source of truth: docs/02-design-system.md
 * FASE 1 will populate with full token definitions
 */

export const alexendrosTokens = {
  colors: {
    black: "oklch(0% 0 0)",
    acidGreen: "oklch(85% 0.25 140)",
    mineralGray: "oklch(40% 0.01 260)",
    white: "oklch(100% 0 0)",
  },
  surfaces: {
    bg: "oklch(8% 0.005 260)",
    card: "oklch(12% 0.005 260)",
    border: "oklch(22% 0.005 260)",
  },
} as const;

export const kitTokens = {
  stagekit: {
    accent: "oklch(85% 0.25 140)",
    secondary: "oklch(70% 0.15 300)",
    surface: "oklch(10% 0.005 260)",
    text: "oklch(95% 0 0)",
  },
  lexkit: {
    accent: "oklch(50% 0.12 250)",
    secondary: "oklch(60% 0.08 250)",
    surface: "oklch(15% 0.01 250)",
    text: "oklch(95% 0 0)",
  },
  gestkit: {
    accent: "oklch(55% 0.06 240)",
    secondary: "oklch(65% 0.04 240)",
    surface: "oklch(15% 0.005 240)",
    text: "oklch(95% 0 0)",
  },
} as const;
