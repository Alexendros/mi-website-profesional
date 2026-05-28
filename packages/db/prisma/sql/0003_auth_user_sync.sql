-- Migración SQL bruto · 0003_auth_user_sync
-- Sincroniza auth.users (Supabase GoTrue) con public.users (Prisma).
-- Aplicar tras `prisma migrate dev --name 0001_init` y `0002_kits_plans_seed`.
--
-- Patrón:
--   - Función public.current_user_id() resuelve el row.id de la sesión actual.
--   - Trigger on auth.users INSERT crea fila en public.users con un cuid mediante
--     gen_random_uuid()::text (cuid real generado por Prisma cuando es la app la
--     que crea el usuario; este path cubre signups vía OAuth donde es GoTrue
--     quien crea auth.users primero).

begin;

-- 1) helper para políticas RLS
create or replace function public.current_user_id()
  returns text
  language sql
  stable
  security definer
  set search_path = public
as $$
  select id
  from public.users
  where supabase_auth_id = auth.uid()::text
    and deleted_at is null
$$;

grant execute on function public.current_user_id() to anon, authenticated, service_role;

-- 2) trigger de sincronización auth.users → public.users
create or replace function public.handle_new_auth_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  insert into public.users (id, supabase_auth_id, email, role, created_at, updated_at)
  values (
    'usr_' || replace(gen_random_uuid()::text, '-', ''),
    new.id::text,
    coalesce(new.email, '') ,
    'USER',
    now(),
    now()
  )
  on conflict (supabase_auth_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- 3) cuando auth.users actualiza email, replicar en public.users
create or replace function public.handle_auth_user_email_update()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.users
       set email = new.email,
           updated_at = now()
     where supabase_auth_id = new.id::text;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update on auth.users
  for each row execute function public.handle_auth_user_email_update();

commit;
