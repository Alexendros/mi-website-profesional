-- Migración SQL bruto · 0005_indices_partials
-- Índices parciales y de soporte que Prisma no genera literalmente.

begin;

-- Usuarios activos: la mayoría de queries filtran deleted_at is null
create index if not exists users_active_email_idx
  on public.users (email)
  where deleted_at is null;

-- Suscripciones activas — hot path del dashboard
create index if not exists subscriptions_active_user_idx
  on public.subscriptions (user_id)
  where status in ('TRIALING','ACTIVE','PAST_DUE');

-- KitProfile públicos para SEO/sitemap
create index if not exists kit_profiles_published_idx
  on public.kit_profiles (kit_id, published_at desc)
  where published = true and deleted_at is null;

-- AuditLog idempotencia Stripe — partial: solo eventos Stripe
create unique index if not exists audit_log_stripe_event_unique
  on public.audit_log (stripe_event_id)
  where stripe_event_id is not null;

-- Leads no convertidos — para campañas
create index if not exists leads_unconverted_idx
  on public.leads (created_at desc)
  where converted_user_id is null;

commit;
