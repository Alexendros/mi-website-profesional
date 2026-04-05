# CLAUDE.md — packages/config

Shared configuration package for the monorepo.

## Contents
- `tsconfig.base.json` — Base TypeScript config (strict: true, no `any`)
- `tsconfig.nextjs.json` — Extended config for Next.js apps
- `tsconfig.library.json` — Extended config for library packages
- `eslint.config.mjs` — Shared ESLint flat config

## Rules
- TypeScript `strict: true` is mandatory across all packages
- `noUncheckedIndexedAccess: true` enforced
- ESLint `no-explicit-any` is an error, not a warning
- All apps extend `tsconfig.nextjs.json`, all packages extend `tsconfig.library.json`
