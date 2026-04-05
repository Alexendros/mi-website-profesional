# CLAUDE.md — packages/db

Prisma schema + Supabase client factory for apps with backend.

## Rules
- RLS enabled on ALL tables — no exceptions
- Mutations exclusively via Prisma — never raw SQL for writes
- Migrations via `prisma migrate dev` — never edit schema in Supabase Studio
- Table names: `@@map("snake_case_plural")`
- IDs: `@id @default(cuid())`
- Timestamps: always `createdAt` + `updatedAt`
- Multi-Kit: `kitId String` on Kit-specific tables
- Soft delete: `deletedAt DateTime?` on critical tables
- Personal data: comment `// RGPD Art.6.1.X` on fields with personal data
- Indices: `@@index([kitId])`, `@@index([userId])`, `@@index([slug])`, `@@index([createdAt(sort: Desc)])`

## Commands
```bash
pnpm --filter=@repo/db prisma migrate dev --name <description>
pnpm --filter=@repo/db prisma generate
pnpm --filter=@repo/db prisma studio
```
