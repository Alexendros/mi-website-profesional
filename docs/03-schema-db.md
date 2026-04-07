# 03 — Schema DB

## Prisma Schema

```jsx
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // pooler (port 6543)
  directUrl = env("DIRECT_URL")        // migraciones (port 5432)
}

// ============ KITS (catálogo de productos) ============
model Kit {
  id          String    @id                    // slug: 'stagekit' | 'lexkit' | 'gestkit'
  name        String                           // 'StageKit' | 'LexKit' | 'GestKit'
  domain      String    @unique               // 'stagekit.app'
  status      KitStatus @default(ACTIVE)
  config      Json      @default("{}")         // features habilitadas, límites por plan
  users       User[]
  plans       Plan[]
  affiliates  Affiliate[]
  createdAt   DateTime  @default(now())

  @@map("kits")
}

enum KitStatus {
  ACTIVE
  BETA
  COMING_SOON
  DEPRECATED
}

// ============ USUARIOS ============
model User {
  id            String    @id @default(cuid())
  supabaseId    String    @unique
  email         String    @unique
  name          String?
  avatarUrl     String?
  kitId         String                         // qué Kit tiene contratado
  kit           Kit       @relation(fields: [kitId], references: [id])
  role          UserRole  @default(CLIENT)
  subscription  Subscription?
  profile       ClientProfile?
  referredBy    Affiliate?  @relation("ReferredUsers", fields: [affiliateId], references: [id])
  affiliateId   String?
  affiliate     Affiliate?  @relation("AffiliateUser")  // si el usuario es afiliado
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

enum UserRole {
  CLIENT
  AFFILIATE
  ADMIN
}

// ============ PLANES (por Kit) ============
model Plan {
  id            String    @id @default(cuid())
  kitId         String
  kit           Kit       @relation(fields: [kitId], references: [id])
  name          String                         // 'Free' | 'Pro' | 'Agency'
  slug          String                         // 'free' | 'pro' | 'agency'
  priceMonthly  Decimal   @db.Decimal(10,2)
  priceSetup    Decimal   @default(0) @db.Decimal(10,2)  // pago inicial único
  stripePriceId String?                        // Stripe Price ID mensual
  features      Json      @default("[]")
  limits        Json      @default("{}")        // { profiles: 1, requests: 10, ... }
  subscriptions Subscription[]

  @@unique([kitId, slug])
  @@map("plans")
}

// ============ SUSCRIPCIONES ============
model Subscription {
  id                    String    @id @default(cuid())
  userId                String    @unique
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  planId                String
  plan                  Plan      @relation(fields: [planId], references: [id])
  stripeCustomerId      String    @unique
  stripeSubscriptionId  String?   @unique
  setupPaymentIntentId  String?                // pago inicial único (setup fee)
  status                SubStatus @default(TRIALING)
  currentPeriodStart    DateTime?
  currentPeriodEnd      DateTime?
  cancelAtPeriodEnd     Boolean   @default(false)
  maintenanceActive     Boolean   @default(true)  // mantenimiento incluido en suscripción
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@map("subscriptions")
}

enum SubStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  INCOMPLETE
}

// ============ PERFIL CLIENTE (genérico, multi-Kit) ============
// El contenido de metadata varía por Kit pero la estructura es idéntica
model ClientProfile {
  id          String    @id @default(cuid())
  userId      String    @unique
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  displayName String                           // stageName / firma / nombre comercial
  bio         String?
  bioEn       String?
  location    String?
  socialLinks Json      @default("{}")          // Kit-specific: {instagram,ra} | {linkedin,legalmatch}
  metadata    Json      @default("{}")          // datos específicos del Kit (genres, specialties, etc.)
  assets      String[]  @default([])           // URLs Supabase Storage: fotos, logos, riders
  kitProfiles KitProfile[]                     // perfiles públicos del Kit
  requests    InboundRequest[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("client_profiles")
}

// ============ KIT PROFILE (página pública, equiv. EPK) ============
// StageKit: EPK de artista
// LexKit: ficha de despacho
// GestKit: ficha de asesoría
model KitProfile {
  id          String        @id @default(cuid())
  profileId   String
  profile     ClientProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  kitId       String                           // a qué Kit pertenece este perfil
  title       String
  slug        String        @unique            // URL pública: stagekit.app/[slug]
  isPublic    Boolean       @default(false)
  template    String        @default("default") // plantilla visual del Kit
  content     Json                             // estructura según KitProfileSchema del Kit
  viewCount   Int           @default(0)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@map("kit_profiles")
}

// ============ INBOUND REQUEST (genérica) ============
// StageKit: booking request de promotor
// LexKit: consulta de cliente potencial
// GestKit: solicitud de presupuesto
model InboundRequest {
  id              String          @id @default(cuid())
  profileId       String
  profile         ClientProfile   @relation(fields: [profileId], references: [id])
  kitId           String
  requesterName   String
  requesterEmail  String
  subject         String?                      // asunto libre o categoría según Kit
  details         Json            @default("{}") // campos específicos del Kit
  status          RequestStatus   @default(PENDING)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@map("inbound_requests")
}

enum RequestStatus {
  PENDING
  ACCEPTED
  DECLINED
  IN_PROGRESS
  CLOSED
}

// ============ AFILIADOS ============
model Affiliate {
  id              String    @id @default(cuid())
  kitId           String
  kit             Kit       @relation(fields: [kitId], references: [id])
  userId          String    @unique
  user            User      @relation("AffiliateUser", fields: [userId], references: [id])
  referralCode    String    @unique
  commissionRate  Decimal   @default(0.15) @db.Decimal(4,2)  // 15% por defecto
  referredUsers   User[]    @relation("ReferredUsers")
  payouts         AffiliatePayout[]
  createdAt       DateTime  @default(now())

  @@map("affiliates")
}

model AffiliatePayout {
  id            String    @id @default(cuid())
  affiliateId   String
  affiliate     Affiliate @relation(fields: [affiliateId], references: [id])
  amount        Decimal   @db.Decimal(10,2)
  currency      String    @default("EUR")
  stripeTransferId String?
  status        PayoutStatus @default(PENDING)
  periodStart   DateTime
  periodEnd     DateTime
  createdAt     DateTime  @default(now())

  @@map("affiliate_payouts")
}

enum PayoutStatus {
  PENDING
  PROCESSING
  PAID
  FAILED
}

// ============ AUDIT LOG (RGPD Art. 30 — Registro de Actividades) ============
model AuditLog {
  id          String   @id @default(cuid())
  userId      String?                            // null para acciones de sistema
  entity      String                             // nombre de la tabla/modelo afectado
  entityId    String?                            // ID del registro afectado
  action      String                             // 'create' | 'update' | 'delete' | 'export' | 'anonymize'
  metadata    Json     @default("{}")            // datos relevantes del cambio (diff, motivo, IP anonimizada)
  createdAt   DateTime @default(now())

  @@map("audit_logs")
  @@index([userId])
  @@index([entity, entityId])
  @@index([createdAt(sort: Desc)])
}

// ============ REGISTRO DIGITAL / TOKENIZACIÓN ============
model DigitalRegistration {
  id                String   @id @default(cuid())
  userId            String
  kitId             String
  assetType         String                       // 'epk' | 'brand_manual' | 'contract' | 'template'
  assetHash         String                       // SHA-256 del archivo
  registryPlatform  String                       // 'safecreative' | 'polygon' | 'oepm'
  registryId        String                       // ID del registro externo
  registryUrl       String?                      // URL de verificación pública
  certificateUrl    String?                      // URL del PDF certificado en Supabase Storage
  status            String   @default("pending") // pending | registered | failed
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("digital_registrations")
  @@index([userId])
  @@index([assetHash])
}
```

## RLS Policies (ejecutar en Supabase SQL Editor)

> **IMPORTANTE:** Los nombres de tabla corresponden a los `@@map()` del schema Prisma.

```sql
-- ============ HABILITAR RLS EN TODAS LAS TABLAS ============
ALTER TABLE public.kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbound_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_registrations ENABLE ROW LEVEL SECURITY;

-- ============ KITS (lectura pública, escritura solo service_role) ============
CREATE POLICY "kits_public_read" ON public.kits
  FOR SELECT USING (true);
CREATE POLICY "kits_service_write" ON public.kits
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============ PLANS (lectura pública, escritura solo service_role) ============
CREATE POLICY "plans_public_read" ON public.plans
  FOR SELECT USING (true);
CREATE POLICY "plans_service_write" ON public.plans
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============ USERS (solo su propio perfil) ============
CREATE POLICY "users_own" ON public.users
  FOR ALL TO authenticated
  USING (supabase_id = auth.uid()::text)
  WITH CHECK (supabase_id = auth.uid()::text);
CREATE POLICY "users_service" ON public.users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============ SUBSCRIPTIONS (solo su propia suscripción) ============
CREATE POLICY "subscriptions_own" ON public.subscriptions
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text))
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text));
CREATE POLICY "subscriptions_service" ON public.subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============ CLIENT_PROFILES (propietario full-access) ============
CREATE POLICY "client_profiles_own" ON public.client_profiles
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text))
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text));
CREATE POLICY "client_profiles_service" ON public.client_profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============ KIT_PROFILES (propietario full-access, público lectura si isPublic) ============
CREATE POLICY "kit_profiles_own" ON public.kit_profiles
  FOR ALL TO authenticated
  USING (profile_id IN (
    SELECT id FROM public.client_profiles
    WHERE user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text)
  ));
CREATE POLICY "kit_profiles_public_read" ON public.kit_profiles
  FOR SELECT USING (is_public = true);
CREATE POLICY "kit_profiles_service" ON public.kit_profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============ INBOUND_REQUESTS (profesional ve las suyas, público puede INSERT) ============
CREATE POLICY "inbound_requests_own" ON public.inbound_requests
  FOR SELECT TO authenticated
  USING (profile_id IN (
    SELECT id FROM public.client_profiles
    WHERE user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text)
  ));
CREATE POLICY "inbound_requests_public_insert" ON public.inbound_requests
  FOR INSERT WITH CHECK (true);  -- visitantes no autenticados pueden enviar solicitudes
CREATE POLICY "inbound_requests_service" ON public.inbound_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============ AFFILIATES (solo su propio registro de afiliado) ============
CREATE POLICY "affiliates_own" ON public.affiliates
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text))
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text));
CREATE POLICY "affiliates_service" ON public.affiliates
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============ AFFILIATE_PAYOUTS (solo sus propios payouts) ============
CREATE POLICY "affiliate_payouts_own" ON public.affiliate_payouts
  FOR SELECT TO authenticated
  USING (affiliate_id IN (
    SELECT id FROM public.affiliates
    WHERE user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text)
  ));
CREATE POLICY "affiliate_payouts_service" ON public.affiliate_payouts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============ AUDIT_LOGS (solo lectura service_role, nunca acceso directo) ============
CREATE POLICY "audit_logs_service_only" ON public.audit_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============ DIGITAL_REGISTRATIONS (usuario ve las suyas) ============
CREATE POLICY "digital_registrations_own" ON public.digital_registrations
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text))
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text));
CREATE POLICY "digital_registrations_service" ON public.digital_registrations
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```