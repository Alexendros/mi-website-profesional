/**
 * Font configuration — Geist + Geist Mono
 * To be used with next/font in apps
 * FASE 1 will add full font loading config
 */

export const fontConfig = {
  sans: {
    family: "Geist",
    variable: "--font-geist-sans",
    display: "swap" as const,
  },
  mono: {
    family: "Geist Mono",
    variable: "--font-geist-mono",
    display: "swap" as const,
  },
} as const;
