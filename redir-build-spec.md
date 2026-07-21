# Klick — Build Spec

A URL shortener with analytics, built to showcase Next.js 16 architecture
patterns: `proxy.ts` redirect handling, a Redis-in-front-of-Postgres caching
layer, Cache Components (`"use cache"`), and Server Actions over API routes
where appropriate.

Some of this project is already scaffolded (see "Already built" below).
Your job is to complete the remaining pieces and verify/fix anything in the
existing scaffold that doesn't match current Next.js 16 / Auth.js v5 APIs.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack default)
- Auth.js v5 (credentials provider — email/password, no email verification by design)
- Prisma + Postgres (Neon or Supabase free tier)
- Upstash Redis (free tier) — caching + rate limiting
- Recharts for analytics charts
- `ua-parser-js` for device/browser/OS parsing
- `qrcode` for QR generation
- `nanoid` for slug generation
- `zod` for input validation
- Everything must run on free tiers only — no paid infra, ever.

## Already built (verify, don't redo)

- Prisma schema: `User`, `Link`, `Click` models
- `src/proxy.ts` — resolves `/[slug]` via `/api/links/resolve`, captures geo
  (via `@vercel/functions`'s `geolocation()`) and user-agent, fires an async
  fire-and-forget click log, then redirects. Reserved paths (`dashboard`,
  `login`, `signup`, `api`) are passed through, not treated as slugs.
- `/api/links/resolve` — Redis-first slug lookup, Postgres fallback, repopulates cache on miss
- `/api/clicks/log` — parses user-agent, writes a `Click` row
- `src/lib/analytics.ts` — `getLinkAnalytics()` using `"use cache"`, aggregates
  total clicks, device breakdown, country breakdown, clicks-by-day
- Server Actions: `createLink` (rate-limited via Upstash, zod-validated,
  custom slug or nanoid-generated), `signup`, `login`
- Pages: `/dashboard` (link list), `/dashboard/links/[id]` (analytics detail
  with 3 Recharts charts in a separate Client Component so the page itself
  stays server-rendered), `/login`, `/signup`, `/expired`, `/not-found`

**Before continuing:** verify against current docs:
1. Auth.js v5's compatibility with `proxy.ts` (not `middleware.ts`) — confirm
   the version in `package.json` actually supports this before wiring auth
   further.
2. The `cacheComponents` flag name in `next.config.ts` — this was scoped from
   search results and may not match the current stable API surface.
3. `@vercel/functions`'s `geolocation()` behavior under proxy.ts's Node.js
   runtime default (Next.js 16 changed the default runtime from Edge to
   Node.js for this file) — confirm geo capture still works as expected, or
   whether the file needs an explicit edge runtime opt-in for lowest latency.

## Still to build

### 1. Marketing page (`/`)
Currently missing entirely — visiting `/` 404s. Build:
- Hero section: one-line value prop, e.g. "Short links with real analytics"
- A "try it" input where a visitor pastes a long URL and gets a short link back
- 3–4 feature highlights (geo/device tracking, expiration, custom slugs, caching architecture)
- CTA to `/signup`

**Decision needed on the "try it" box — recommended default:** ship it as a
**visual-only demo** that, on submit, shows a mocked short-link result and
then prompts sign-up to make it real — this avoids adding an
`anonymous: true` link path to the data model and keeps scope tight. If you'd
rather make it functional (real anonymous short links), that requires:
  - Making `Link.userId` nullable in the Prisma schema
  - A stricter, lower rate limit for anonymous creation than authenticated
  - A cleanup job/TTL for anonymous links so they don't accumulate forever
  Only go this route if asked to — default to the visual-only version.

### 2. QR code generation
On `/dashboard/links/[id]`, generate a QR code for the short link using the
`qrcode` package. Render as a data URL `<img>` or inline SVG. Should be
generated client-side or in a Server Component — no need for a dedicated API
route.

### 3. Copy-to-clipboard
On both the dashboard link list and the link detail page, add a
copy-to-clipboard button next to each short link (`navigator.clipboard.writeText`).
Needs a small Client Component since it requires an event handler — keep it
as small and leaf-level as possible to avoid expanding the client boundary
unnecessarily (this project's whole point is disciplined Server/Client
separation).

### 4. Search/filter on the dashboard
Add a search input on `/dashboard` that filters the link list by slug or
original URL. Prefer URL search params (`?q=...`) over client-side-only state
so the filter is shareable/bookmarkable and can be read server-side in the
page's `searchParams` prop — avoids adding a Context or unnecessary client
state for something that's really just a query param.

### 5. Styling
Everything so far is unstyled semantic markup. Apply a real design pass —
consistent spacing, typography, color system. Keep it clean and minimal;
this is a portfolio piece, not a brand exercise. Tailwind is fine if already
configured, otherwise plain CSS modules are acceptable.

**Visual direction (agreed reference style):**
- Dark/slate sidebar nav (Links, Analytics, Settings) with a light main content area
- One bold, high-contrast "hero" stat card for the single most important
  number (total clicks) — solid accent-color background, large numeral
- Secondary stats (active links, top country, expiring soon, avg CTR) as a
  2x2 grid of smaller neutral cards next to the hero card
- Link list as a clean table inside a single rounded card, not bare rows
- On the link detail page: replace the country-breakdown bar chart with a
  world map showing markers sized/colored by click volume per country —
  this is a much better fit for that dataset than a bar chart
- Skip decorative illustration work (no custom character art, no gauge-style
  "popularity score" widgets, no team/member avatars) — none of that maps to
  what this product actually tracks, and custom illustration isn't worth the
  time for a portfolio piece. Borrow the reference's *structure* (cards, map,
  spacing), not its specific illustrations or color palette.

### 6. Link management actions
Edit and delete actions for existing links (currently only create exists).
Both should be Server Actions, not API routes, since they're only ever
triggered from within the app itself — consistent with the "Server Actions
over Route Handlers for internal-only mutations" principle this project is
built around. Both need to invalidate the relevant cache: the Redis slug
cache entry (on edit/delete) and `revalidatePath("/dashboard")`.

## Design principles to hold to throughout

- No Context for anything server-fetchable — prop drilling or re-fetching in
  Server Components, per the project's own thesis.
- Client Components should be as small/leaf-level as possible (donut
  pattern) — never mark a whole page `"use client"` just because one button
  needs an `onClick`.
- Server Actions for anything only ever called from within this app;
  Route Handlers only for things genuinely needing to be called externally
  (there currently are none besides the two internal API routes already
  built, which exist to keep `proxy.ts` itself lightweight — don't add new
  Route Handlers without a reason).
- No email verification — deliberate scope decision, don't add it back in.
- Every dependency and hosting choice must stay on a free tier.
