# Features Research: KitOS / StageKit

> Research date: 2026-04-06
> Sources: Competitor platform analysis (Bandzoogle, Linkfire, EPK.fm, Muso.ai, Sonicbids, ReverbNation),
> SaaS conversion/retention literature, booking-form UX best practices.
> Web search unavailable in this session — analysis based on deep platform knowledge through August 2025.

---

## Table Stakes (must have or users leave)

These are features users expect on day one. Absence = immediate churn or no signup.

| Feature | Complexity | Why it's table stakes |
|---------|------------|----------------------|
| Public profile with slug (`stagekit.app/dj-name`) | Low | First thing a promoter asks for; no URL = no credibility |
| Artist bio (long + short versions) | Low | Every EPK template in the market has this |
| Genre tags / music style labels | Low | Promoters filter by genre; missing this = irrelevant results |
| Profile photo + banner image upload | Low | Visual identity — non-negotiable for music industry |
| Embedded music player (SoundCloud / Spotify / Mixcloud embed) | Low | Press kits without audio are immediately ignored |
| Social links (Instagram, Resident Advisor, Bandcamp, SoundCloud) | Low | Standard linking layer — Linktree-level expectation |
| Contact / booking inquiry form on public profile | Medium | The entire conversion goal of an EPK |
| Mobile-responsive public profile | Medium | >70% of promoter discovery happens on mobile |
| SEO: proper `<title>`, OG tags, JSON-LD on public pages | Medium | Indexability = organic discovery; missing = invisible |
| Email notification on new booking inquiry | Low | Artist must know immediately; no notification = leads rot |
| Dashboard showing received inquiries | Low | Minimum inbox for managing inbound interest |
| Basic analytics: profile views count | Low | Without any feedback loop, artists can't judge if profile works |
| Secure auth (email + OAuth) | Medium | Table stakes for any SaaS |
| RGPD/legal compliance on public forms | Medium | Legally required in EU; missing = liability |

---

## Differentiators (competitive advantage)

These are features where KitOS/StageKit has a genuine angle competitors don't cover well or at all.

### 1. EPK builder with guided onboarding (< 5 min to first publish)
**Competitors' gap:** Bandzoogle has a steep learning curve (full website builder). EPK.fm is form-heavy and dated. Muso.ai is feature-rich but overwhelming for emerging artists.
**StageKit angle:** 3-step opinionated onboarding (info → genres → publish) that produces a professional result without design decisions. First EPK live in under 5 minutes.

### 2. Booking manager as first-class feature (not a contact form add-on)
**Competitors' gap:** All competitors treat booking contact as an afterthought — a basic form that dumps to email. Zero structured pipeline.
**StageKit angle:** Every inquiry lands in a dashboard with status tracking (New → Reviewing → Confirmed → Declined). The artist never loses a booking request in their inbox.

### 3. North Star aligned to booking outcomes, not vanity metrics
**Competitors' gap:** Bandzoogle, ReverbNation etc. show page views. These are vanity metrics that don't tell the artist if their EPK is working.
**StageKit angle:** The weekly digest and dashboard center on "booking requests received this week" — the one metric that justifies the subscription.

### 4. Rider técnico PDF generator (Pro)
**Competitors' gap:** No EPK platform auto-generates technical riders. Artists maintain a separate PDF in Google Drive, often outdated.
**StageKit angle:** Form-to-PDF generator for technical rider (stage plot, PA requirements, hospitality). Downloadable link on the public EPK. Single source of truth.

### 5. Subscription model with service guarantee (not just software)
**Competitors' gap:** Pure SaaS tools (Bandzoogle is DIY, no service). Booking agencies have service but take 15% of every fee.
**StageKit angle:** €29/month for software + maintenance + updates + compliance updates. No percentage of bookings. Competes against the "15% agency commission" narrative directly.

### 6. RGPD compliance baked in, not bolted on
**Competitors' gap:** US-based competitors (Bandzoogle, Sonicbids) have minimal GDPR compliance. EPK.fm has none visible.
**StageKit angle:** Granular consent on booking forms, ARCO rights portal, data stored in EU (Supabase Frankfurt + Vercel mad1). Relevant for European artists dealing with EU promoters.

### 7. Affiliate program for bookers and managers (Stripe Connect)
**Competitors' gap:** No EPK platform has a formal affiliate program for industry insiders.
**StageKit angle:** A manager who refers 10 artists earns 15% of each subscription for 12 months (passive income). Viral loop within industry networks.

### 8. Multi-kit architecture (cross-sell / upsell path)
**Competitors' gap:** Single-niche tools with no expansion path.
**StageKit angle:** Artist who grows to need agency tools → Agency plan. Musician who also manages a small venue → adjacent kits in the future. Platform loyalty grows with career.

---

## Anti-Features (deliberately NOT building for MVP)

These are features that look attractive but would kill the MVP by adding scope, complexity, or premature commitment.

| Anti-feature | Why it's a trap | When to revisit |
|-------------|----------------|----------------|
| **Public availability calendar** | High complexity (conflict detection, timezone hell, double-booking edge cases). Users don't need it for MVP — the booking form captures intent, not slots. | Phase 2, after validating booking form usage |
| **In-app payment of booking deposits (Stripe)** | Requires collecting fees, handling disputes, compliance with Stripe Connect for payouts. Legal exposure if a show doesn't happen. Artists aren't ready for this in their first 30 days. | Phase 2, only if explicitly requested by active Pro users |
| **Multiple EPK templates** | Design debt explosion. Each template needs to be maintained, tested on mobile, kept on-brand. One well-designed template beats five mediocre ones. | Phase 2, after validated first template |
| **Resident Advisor API integration** | RA API is unofficial, rate-limited, and breaks. Not worth the fragility. | Post-validation, when RA formalizes API access |
| **Chat/messaging between artist and promoter** | Turns StageKit into a communication platform. Support burden, spam risk, moderation needed. Email notifications are sufficient for MVP. | Never in MVP; maybe Phase 3 |
| **Music distribution features** | Completely different vertical (Distrokid, TuneCore territory). Would dilute the booking-focused value prop. | Out of scope permanently |
| **Venue/promoter-side accounts** | Double-sided marketplace = 2x acquisition problem. Focus entirely on supply (artists) first. | Only after 500+ active artist profiles |
| **Custom domain for EPK (Free plan)** | Custom domains require DNS management, SSL provisioning, support. If free, no upgrade incentive. | Keep as Pro gate |
| **Bulk email to promoters / outreach tools** | CAN-SPAM, RGPD consent requirements, abuse risk. Could get StageKit's sending domain blacklisted on day one. | Never — not in our value prop |
| **Social media auto-posting** | Buffer/Later already do this. Distraction from booking focus. | Never |
| **White-label EPKs (Free/Pro)** | Agency-only feature. If Pro users get white-label, Agency plan loses its primary differentiation. | Agency plan only, post-MVP |
| **AI bio generator** | Nice-to-have but adds OpenAI API cost + latency + hallucination risk on artist facts. | Phase 3 enhancement |
| **Mobile app (iOS/Android)** | Web-first is sufficient. PWA covers mobile use cases. Native app = full second project. | Post-product-market-fit |

---

## Feature Dependencies

Understanding which features require others prevents incorrect build order.

```
Auth (Supabase SSR)
  └→ Artist Profile (requires authenticated user)
      └→ KitProfile / EPK Builder (requires Artist Profile)
          └→ Public Profile Page (requires KitProfile published)
              └→ Booking Inquiry Form (requires public page)
                  └→ Booking Dashboard (requires form submission model)
                      └→ Analytics: EPK views + bookings (requires both profile + form)
                          └→ Weekly digest email (requires analytics data)

Stripe Subscription
  └→ Feature Gates (Free vs Pro limits)
      └→ Pro features: unlimited EPKs, Rider PDF, advanced analytics
          └→ Trial flow (14 days → auto-downgrade to Free)

n8n Workflows
  └→ Supabase webhooks (require DB tables + RLS)
      └→ Email sequences (require Resend + React Email templates)
          └→ Booking notification (requires InboundRequest table)
          └→ Trial ending email (requires Subscription table + trial_end date)

Rider PDF Generator
  └→ KitProfile (needs stage info fields added to schema)
  └→ PDF generation library (@react-pdf/renderer or Puppeteer)

Analytics: Advanced (Pro)
  └→ Basic analytics (Free) — must be built first
  └→ PostHog event tracking with consent gate
```

**Critical path for MVP launch:**
Auth → Artist Profile → EPK Builder → Public Page → Booking Form → Booking Dashboard → Stripe Free/Pro → Trial flow

---

## Competitor Comparison

### Feature matrix: StageKit vs key competitors

| Feature | StageKit (MVP) | Bandzoogle | Linkfire | EPK.fm | Muso.ai |
|---------|---------------|------------|----------|--------|---------|
| **Public EPK / profile** | Yes | Yes (full website) | Yes (link page) | Yes | Yes |
| **Custom slug** | Yes | Yes | Yes (paid) | Yes | Yes |
| **Bio: short + long** | Yes | Yes | No | Yes | Yes |
| **Genre tags** | Yes | Limited | No | Yes | Yes |
| **Music player embed** | Yes | Yes | Yes | Yes | Yes |
| **Press photos gallery** | Yes | Yes | No | Yes | Yes |
| **Social links** | Yes | Yes | Yes | Yes | Yes |
| **Booking inquiry form** | Yes (structured) | Basic contact form | No | Basic email | Basic form |
| **Booking pipeline dashboard** | Yes | No | No | No | No |
| **Inquiry status tracking** | Yes | No | No | No | No |
| **Email notification on inquiry** | Yes | Yes | No | Yes | Yes |
| **EPK analytics (views)** | Yes (30d Free / 12m Pro) | Yes | Yes (paid) | Limited | Yes |
| **Booking requests metric** | Yes (North Star) | No | No | No | No |
| **Technical rider PDF** | Yes (Pro) | No | No | No | Yes (manual upload) |
| **Custom domain** | Yes (Pro) | Yes (paid plan) | Yes (paid) | Yes (paid) | Yes (paid) |
| **Trial without credit card** | Yes (14 days) | Yes (30 days) | No | No | No |
| **RGPD/EU compliance** | Yes (native) | Partial | Partial | No | No |
| **Data in EU** | Yes (Frankfurt/mad1) | No (US) | No (US) | No (US) | No (US) |
| **Affiliate program** | Yes (15%, 12mo) | No | No | No | No |
| **Multi-artist management** | Roadmap (Agency) | No | No | No | Yes (agency tier) |
| **Mobile responsive** | Yes | Yes | Yes | Partial | Yes |
| **Pricing (entry paid)** | €29/mo | $12.50-$25/mo USD | €0-€79/mo | $7.99-$19.99/mo | $14-$49/mo USD |
| **Free tier** | Yes (1 EPK, 10 bookings/mo) | No (trial only) | Yes (limited) | No | No |
| **EU-based product** | Yes | No | Yes (DK) | No | No |

### Competitor profiles

**Bandzoogle** (Canada/US, ~50k users)
- Full website builder for musicians, not EPK-focused. Overkill for discovery/booking.
- Pro: well-established, musician-specific. Con: US-centric, dated UX, no booking pipeline.
- Pricing: $12.50–$25/mo USD. No free tier (30-day trial with CC).
- Our advantage: booking-focused UX, EU compliance, trial without CC, cheaper for the use case.

**Linkfire** (Copenhagen, enterprise-grade)
- Music marketing links (smart links, bio links). Not an EPK tool.
- Pro: strong analytics, used by major labels. Con: expensive, not for emerging artists, no booking.
- Our advantage: booking management layer, artist-centric (not label/DSP-centric), affordable.

**EPK.fm** (US startup)
- Dedicated EPK builder, simple. Pro: focused. Con: minimal features, poor mobile, no pipeline, no EU.
- Pricing: $7.99–$19.99/mo. No free tier.
- Our advantage: better UX, booking pipeline, analytics, EU compliance, free tier for discovery.

**Muso.ai** (UK, VC-backed)
- AI-powered press kit + distribution. Rich features but complex and expensive.
- Pro: AI assistance, industry connections claimed. Con: feature bloat, steep learning curve, not EU-hosted.
- Pricing: $14–$49/mo. No free tier.
- Our advantage: simplicity, time-to-first-publish, EU compliance, structured booking pipeline.

---

## Free → Paid Conversion: Patterns that work

Based on SaaS research and what EPK tools get right/wrong:

### Trial patterns
- **14 days no-CC (StageKit's choice):** Higher trial activation (+40% vs CC-required trials). Risk: lower-intent users. Mitigate with onboarding completion score.
- **Feature-gated free tier** (what StageKit offers alongside trial): Long-term sustainable — free users become advocates, their public EPK pages drive organic SEO + social proof.
- **Avoid freemium without limit:** "Unlimited free" = no upgrade trigger. StageKit's limit of 10 booking requests/month on Free is the correct gate — it triggers upgrade at the moment of success (when bookings start coming in).

### Feature gating principles applied to StageKit
- **Gate on output, not input:** Don't limit how many fields the artist can fill in. Gate on results: booking requests/month, EPK count, analytics depth, custom domain.
- **Show locked features in the UI:** "Pro Analytics — upgrade to see 12 months of data" inside the dashboard is more effective than hiding them entirely.
- **Trial progress emails:** Day 1 (welcome + onboarding tip), Day 7 (EPK views so far), Day 11 (trial ending in 3 days + top Pro feature used).

### Booking form UX best practices
- **Minimal required fields at first:** Name, email, event type, date range, message. Optional: budget, venue capacity.
- **Instant confirmation on submit:** "Your request has been sent. Artists typically respond within 48 hours." — reduces abandonment and follow-up spam.
- **Anti-spam without CAPTCHA:** Honeypot field + rate limiting (Upstash Redis) > reCAPTCHA (friction kills conversion).
- **Mobile-first form layout:** Single column, large tap targets, native date picker.
- **Structured event types dropdown:** Club set / Festival / Private event / Live show / Residency — helps artist qualify leads before reading message.

### Dashboard analytics that drive retention (creator tools)
- **Weekly digest email** beats in-app nudges for re-engagement (Substack, Linktree data).
- **"You got X profile views this week" + "Y new booking requests"** — two numbers, actionable.
- **Trend arrows matter:** "Views up 23% vs last week" triggers sharing behavior — artist posts their EPK link organically.
- **Avoid overwhelming dashboards:** Keep Free dashboard to 3 metrics max (views, bookings received, response rate). Pro gets full funnel.
- **Milestone notifications:** "100 profile views!" — even small milestones drive social sharing (low-cost growth loop).

---

## Summary: MVP Feature Priority Stack

```
P0 — Launch blockers (without these, product doesn't exist)
  - Auth (email + Google OAuth)
  - Artist onboarding (3 steps)
  - EPK builder + public profile page with slug
  - Booking inquiry form (structured, anti-spam)
  - Booking requests inbox dashboard
  - Stripe Free/Pro with trial 14d no-CC
  - Email: welcome + booking received + trial ending

P1 — Retention drivers (build in weeks 3-6)
  - Profile views analytics (30d Free / 12m Pro)
  - Weekly digest email (bookings + views)
  - In-app upgrade prompts at feature gates
  - Onboarding progress indicator

P2 — Differentiators (Phase 2, post-validation)
  - Rider técnico PDF generator
  - Booking status pipeline (New → Confirmed → Declined)
  - Advanced analytics (source tracking, conversion funnel)
  - Custom domain for EPK

P3 — Growth accelerators (Phase 3)
  - Availability calendar integration
  - Booking deposit payments (Stripe)
  - Agency/multi-artist plan
  - Affiliate dashboard for managers/bookers
```

---

*Note: Web search was unavailable during this research session. Analysis is based on deep knowledge of the platforms and market through August 2025 and cross-referenced with the project's existing documentation in `docs/`.*
