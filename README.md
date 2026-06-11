# Beevaa Maldives

A mobile-first, modern-minimal website for **Beevaa Maldives** — a local travel agency
offering **resorts, safari boats and guesthouses** across the atolls.

- **Public site**: category browsing (Resort / Safari / Guesthouse), rich
  property pages (gallery, rooms & villas, dining, facilities), a Maldives guide,
  and an enquiry flow (WhatsApp + email, no prepayment).
- **Admin panel** (`/admin`): enquiries inbox (reply by email), property management,
  drag-and-drop photo uploads.
- **Content**: the real Beevaa catalogue (26 properties + guide articles) imported
  from the existing site and bundled, so the site looks complete out of the box.
- **Stack**: Next.js (App Router) + Tailwind CSS · Supabase (Postgres, auth) ·
  Cloudinary (photo uploads) · Resend (emails) · Vercel (hosting). All free tiers — **$0/month**.
- **Payments**: Phase 2 via **BML Connect** (Bank of Maldives) — Stripe doesn't
  support Maldives merchants. See SETUP.md.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no configuration the site runs on the **bundled
imported content** — no database needed to preview.

## Theming (your colors + logo)

Everything is driven by a few CSS variables in [`app/globals.css`](app/globals.css)
(`--brand`, `--accent`, `--ink`, …). Send hex codes and they drop straight in.
The wordmark lives in [`components/Logo.tsx`](components/Logo.tsx) — replace it with
your logo image in one edit.

## Going live

See **[SETUP.md](SETUP.md)** for the full guide: deploy to Vercel (free), connect
Supabase/Cloudinary/Resend for the admin backend, point beevaa.com at Vercel, and
add BML Connect payments in Phase 2.

## Re-importing content

The importer scripts live in `scripts/import/` (parse → download → optimize →
optionally seed Supabase). The bundled dataset is `data/import.json` + `public/import/`.

## Project layout

```
app/(site)/        public pages (home, category, property, guide, enquire)
app/admin/         admin panel (login, dashboard, enquiries, properties)
app/api/           enquiry creation + Cloudinary upload signing
components/        UI components (public + admin)
lib/               data layer (Supabase or bundled import), email, config, types
data/import.json   imported Beevaa catalogue (26 properties + articles)
public/import/     optimized photos for the catalogue
supabase/schema.sql  database schema + RLS + category seed
scripts/import/    scrape → parse → download → optimize → seed pipeline
```
