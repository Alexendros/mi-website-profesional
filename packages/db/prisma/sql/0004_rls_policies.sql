-- Migración SQL bruto · 0004_rls_policies
-- Row Level Security en todas las tablas con PII + tablas operativas.
-- Patrón canónico:
--   - SELECT: owner OR admin (kits/plans/prices activos son públicos).
--   - INSERT: con user_id = public.current_user_id() o service_role.
--   - UPDATE: owner (campos no sensibles) o service_role.
--   - DELETE: service_role (audit_log, consent_records, digital_registrations son append-only).
--
-- Bases legales RGPD se documentan en comentarios COMMENT ON POLICY ...

begin;

-- ============================================================================
-- USERS
-- ============================================================================
alter table public.users enable row level security;
alter table public.users force row level security;

drop policy if exists users_select_own on public.users;
create policy users_select_own
  on public.users
  for select
  using (supabase_auth_id = auth.uid()::text);

drop policy if exists users_update_own on public.users;
create policy users_update_own
  on public.users
  for update
  using (supabase_auth_id = auth.uid()::text)
  with check (supabase_auth_id = auth.uid()::text);

comment on policy users_select_own on public.users is 'RGPD Art.15 derecho de acceso del titular';
comment on policy users_update_own on public.users is 'RGPD Art.16 rectificacion';

-- ============================================================================
-- KITS (público en lectura)
-- ============================================================================
alter table public.kits enable row level security;

drop policy if exists kits_select_public on public.kits;
create policy kits_select_public
  on public.kits
  for select
  using (active = true);

comment on policy kits_select_public on public.kits is 'Catalogo publico de productos';

-- ============================================================================
-- PLANS / PRICES (público en lectura si active)
-- ============================================================================
alter table public.plans enable row level security;
drop policy if exists plans_select_public on public.plans;
create policy plans_select_public
  on public.plans
  for select
  using (active = true);

alter table public.prices enable row level security;
drop policy if exists prices_select_public on public.prices;
create policy prices_select_public
  on public.prices
  for select
  using (active = true);

-- ============================================================================
-- SUBSCRIPTIONS
-- ============================================================================
alter table public.subscriptions enable row level security;
alter table public.subscriptions force row level security;

drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own
  on public.subscriptions
  for select
  using (user_id = public.current_user_id());

comment on policy subscriptions_select_own on public.subscriptions is 'RGPD Art.6.1.b ejecucion del contrato';

-- ============================================================================
-- CLIENT_PROFILES
-- ============================================================================
alter table public.client_profiles enable row level security;
alter table public.client_profiles force row level security;

drop policy if exists client_profiles_select_own on public.client_profiles;
create policy client_profiles_select_own
  on public.client_profiles
  for select
  using (user_id = public.current_user_id());

drop policy if exists client_profiles_upsert_own on public.client_profiles;
create policy client_profiles_upsert_own
  on public.client_profiles
  for insert
  with check (user_id = public.current_user_id());

drop policy if exists client_profiles_update_own on public.client_profiles;
create policy client_profiles_update_own
  on public.client_profiles
  for update
  using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

comment on policy client_profiles_select_own on public.client_profiles is 'RGPD Art.6.1.b';

-- ============================================================================
-- KIT_PROFILES
-- ============================================================================
alter table public.kit_profiles enable row level security;
alter table public.kit_profiles force row level security;

drop policy if exists kit_profiles_select_public on public.kit_profiles;
create policy kit_profiles_select_public
  on public.kit_profiles
  for select
  using (published = true and deleted_at is null);

drop policy if exists kit_profiles_select_own on public.kit_profiles;
create policy kit_profiles_select_own
  on public.kit_profiles
  for select
  using (user_id = public.current_user_id());

drop policy if exists kit_profiles_insert_own on public.kit_profiles;
create policy kit_profiles_insert_own
  on public.kit_profiles
  for insert
  with check (user_id = public.current_user_id());

drop policy if exists kit_profiles_update_own on public.kit_profiles;
create policy kit_profiles_update_own
  on public.kit_profiles
  for update
  using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

drop policy if exists kit_profiles_delete_own on public.kit_profiles;
create policy kit_profiles_delete_own
  on public.kit_profiles
  for delete
  using (user_id = public.current_user_id());

-- ============================================================================
-- INBOUND_REQUESTS (anonymous insert, owner-of-target select)
-- ============================================================================
alter table public.inbound_requests enable row level security;
alter table public.inbound_requests force row level security;

drop policy if exists inbound_requests_insert_anon on public.inbound_requests;
create policy inbound_requests_insert_anon
  on public.inbound_requests
  for insert
  with check (true); -- rate-limit a nivel Kong, no PG

drop policy if exists inbound_requests_select_owner on public.inbound_requests;
create policy inbound_requests_select_owner
  on public.inbound_requests
  for select
  using (
    exists (
      select 1
      from public.kit_profiles kp
      where kp.id = inbound_requests.kit_profile_id
        and kp.user_id = public.current_user_id()
    )
  );

comment on policy inbound_requests_insert_anon on public.inbound_requests
  is 'RGPD Art.6.1.f legitimate interest: el visitante envia voluntariamente para contacto';

-- ============================================================================
-- AFFILIATES / AFFILIATE_PAYOUTS
-- ============================================================================
alter table public.affiliates enable row level security;
alter table public.affiliates force row level security;

drop policy if exists affiliates_select_own on public.affiliates;
create policy affiliates_select_own
  on public.affiliates
  for select
  using (user_id = public.current_user_id());

alter table public.affiliate_payouts enable row level security;
alter table public.affiliate_payouts force row level security;

drop policy if exists affiliate_payouts_select_own on public.affiliate_payouts;
create policy affiliate_payouts_select_own
  on public.affiliate_payouts
  for select
  using (
    exists (
      select 1
      from public.affiliates a
      where a.id = affiliate_payouts.affiliate_id
        and a.user_id = public.current_user_id()
    )
  );

-- ============================================================================
-- AUDIT_LOG (append-only, owner-of-actor select)
-- ============================================================================
alter table public.audit_log enable row level security;
alter table public.audit_log force row level security;

drop policy if exists audit_log_select_own on public.audit_log;
create policy audit_log_select_own
  on public.audit_log
  for select
  using (actor_user_id = public.current_user_id());

-- ============================================================================
-- DIGITAL_REGISTRATIONS (append-only)
-- ============================================================================
alter table public.digital_registrations enable row level security;
alter table public.digital_registrations force row level security;

drop policy if exists digital_registrations_select_own on public.digital_registrations;
create policy digital_registrations_select_own
  on public.digital_registrations
  for select
  using (user_id = public.current_user_id());

drop policy if exists digital_registrations_insert_own on public.digital_registrations;
create policy digital_registrations_insert_own
  on public.digital_registrations
  for insert
  with check (user_id = public.current_user_id());

-- ============================================================================
-- CONSENT_RECORDS (append-only, RGPD Art.7)
-- ============================================================================
alter table public.consent_records enable row level security;
alter table public.consent_records force row level security;

drop policy if exists consent_records_select_own on public.consent_records;
create policy consent_records_select_own
  on public.consent_records
  for select
  using (user_id = public.current_user_id());

drop policy if exists consent_records_insert_own_or_lead on public.consent_records;
create policy consent_records_insert_own_or_lead
  on public.consent_records
  for insert
  with check (
    user_id = public.current_user_id()
    or (user_id is null and lead_id is not null)
  );

-- ============================================================================
-- LEADS (anonymous insert; service_role select via Prisma admin)
-- ============================================================================
alter table public.leads enable row level security;
alter table public.leads force row level security;

drop policy if exists leads_insert_anon on public.leads;
create policy leads_insert_anon
  on public.leads
  for insert
  with check (true); -- rate-limit Kong + captcha en frontend

comment on policy leads_insert_anon on public.leads
  is 'RGPD Art.6.1.a consentimiento explicito (doble opt-in en formulario)';

-- ============================================================================
-- Service role bypasa toda RLS — comportamiento por defecto Supabase.
-- Documentamos aquí que mutaciones del webhook Stripe pasan por service_role.
-- ============================================================================

commit;
