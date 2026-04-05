# CLAUDE.md — packages/ui

Shared React components based on shadcn/ui for all apps.

## Rules
- shadcn/ui variants first — use existing variants before creating custom ones
- Icons: lucide-react only
- Dialog on desktop, Drawer on mobile (use useMediaQuery)
- All components must support dark mode via CSS variables from @repo/brand
- Do NOT create components in apps/ that belong here
- Accessible: WCAG AA contrast minimum in dark mode
- CVA (class-variance-authority) for variant management
