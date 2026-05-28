-- RLS Policies — alexendros-pro (productos digitales)
-- Ejecutar en Supabase SQL Editor o via psql $DIRECT_URL tras `prisma migrate dev`.
-- Requisito: CLAUDE.md §3 — "RLS habilitado en TODAS las tablas Supabase"
--
-- Convención:
--   service_role → acceso total (Prisma server-side)
--   authenticated → acceso a datos propios (via auth.uid())
--   anon          → solo lectura pública donde corresponda

-- =========================================================================
-- 1. products — catálogo público (lectura), solo admin escribe
-- =========================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Lectura pública de productos activos (anon + authenticated)
CREATE POLICY "products_public_read_active"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Service role: acceso total (server-side Prisma, stripe-populate, seed)
CREATE POLICY "products_service_role_all"
  ON public.products FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =========================================================================
-- 2. orders — usuario ve/modifica solo sus propios pedidos
-- =========================================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Usuario autenticado lee solo sus pedidos (por customer_id vinculado a auth.uid)
CREATE POLICY "orders_user_read_own"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid()::text = customer_id);

-- Anon no puede leer nada (implícito, no hay policy FOR SELECT TO anon)

-- Service role: acceso total (webhooks, fulfillment, admin)
CREATE POLICY "orders_service_role_all"
  ON public.orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =========================================================================
-- 3. stripe_events — solo server-side (idempotencia de webhooks)
-- =========================================================================
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

-- Sin policies para anon ni authenticated → tabla invisible para clientes.
-- Solo service_role puede leer/escribir.
CREATE POLICY "stripe_events_service_role_all"
  ON public.stripe_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =========================================================================
-- 4. users — usuario ve solo su propio perfil
-- =========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Usuario autenticado lee solo su perfil
CREATE POLICY "users_read_own"
  ON public.users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

-- Service role: acceso total
CREATE POLICY "users_service_role_all"
  ON public.users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =========================================================================
-- Verificación post-apply:
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND tablename IN ('products','orders','stripe_events','users');
-- → Todas deben mostrar rowsecurity = true
-- =========================================================================
