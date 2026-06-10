# Beevaa

A mobile-first, booking.com-style marketplace for **Maldives guesthouses and local islands**.

- **Public site**: search by island/dates/guests, guesthouse pages with photo galleries, rooms & prices, booking-request flow (no prepayment).
- **Admin panel** (`/admin`): bookings inbox (confirm/decline with automatic guest emails), guesthouse & room management, drag-and-drop photo uploads.
- **Stack**: Next.js (App Router) + Tailwind CSS · Supabase (Postgres, auth) · Cloudinary (photos) · Resend (emails) · Vercel (hosting). All free tiers — **$0/month**.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no configuration the site runs in **demo mode** with built-in sample data.

## Going live

See **[SETUP.md](SETUP.md)** for the full step-by-step guide:

1. Publish the test site on Vercel (free)
2. Connect Supabase / Cloudinary / Resend to enable the admin backend
3. Point beevaa.com at Vercel
4. Phase 2: BML Connect card payments

## Project layout

```
app/(site)/        public pages (home, search, islands, stay, booking)
app/admin/         admin panel (login, dashboard, bookings, guesthouses)
app/api/           booking creation + Cloudinary upload signing
components/        UI components (public + admin)
lib/               data layer (Supabase or demo fallback), email, types
supabase/schema.sql  database schema + RLS + seed data
scripts/           demo image generator
```
