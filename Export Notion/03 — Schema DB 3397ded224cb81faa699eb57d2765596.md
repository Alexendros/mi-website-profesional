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
```

## RLS Policies (ejecutar en Supabase SQL Editor)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE epks ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- users: solo su propio perfil
CREATE POLICY "users_own" ON users
  FOR ALL USING (supabase_id = auth.uid()::text);

-- artist_profiles: propietario full-access, público solo lectura de perfiles activos
CREATE POLICY "artist_own" ON artist_profiles
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()::text));

-- epks: propietario full-access, público solo EPKs is_public=true
CREATE POLICY "epk_own" ON epks
  FOR ALL USING (artist_id IN (
    SELECT id FROM artist_profiles
    WHERE user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
  ));

CREATE POLICY "epk_public_read" ON epks
  FOR SELECT USING (is_public = true);

-- booking_requests: artista ve las suyas, promotor puede INSERT
CREATE POLICY "booking_artist_read" ON booking_requests
  FOR SELECT USING (artist_id IN (
    SELECT id FROM artist_profiles
    WHERE user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
  ));

CREATE POLICY "booking_public_insert" ON booking_requests
  FOR INSERT WITH CHECK (true);  -- promotores no autenticados pueden enviar
```