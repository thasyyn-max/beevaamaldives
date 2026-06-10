# Beevaa — Setup & Publishing Guide

A booking.com-style marketplace for Maldives guesthouses. **Total monthly cost: $0** (free tiers).

The site works in three stages — you can stop at any stage and it still works:

| Stage | What works | What you need |
|---|---|---|
| **Demo mode** (right now) | Full public site with sample guesthouses, booking flow returns a reference | Nothing |
| **Connected** | Real database, admin panel (bookings inbox, listings, photos), emails | Supabase + Cloudinary + Resend (all free) |
| **Live** | Same, on beevaa.com | Point your domain at Vercel |

---

## Stage 0 — Run it locally (works right now)

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the site runs on built-in demo data.

---

## Stage 1 — Publish the test website (Vercel, free, ~15 minutes)

1. **Push to GitHub**
   - Create a free account at https://github.com and create a new **private** repository named `beevaa`.
   - In this folder:
     ```bash
     git remote add origin https://github.com/<your-username>/beevaa.git
     git push -u origin main
     ```
2. **Deploy on Vercel**
   - Sign up at https://vercel.com with your GitHub account (Hobby plan, free).
   - "Add New → Project" → import the `beevaa` repo → keep all defaults → **Deploy**.
   - ~2 minutes later your test site is live at `https://beevaa-<something>.vercel.app`.
   - You can rename it: Project → Settings → Domains → edit the `.vercel.app` subdomain.
3. **From now on**: every `git push` auto-deploys. Pull requests get their own preview URLs.

> The deployed site runs in demo mode until you do Stage 2 — perfect for showing people the design.

## Stage 2 — Connect the backend (admin panel, real bookings, photo uploads)

### 2a. Supabase (database + admin login) — free

1. Create a project at https://supabase.com (choose a region close to you, e.g. Singapore/Mumbai).
2. Open **SQL Editor → New query**, paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates all tables, security policies, and seeds the 5 sample islands + 6 sample guesthouses.
3. Create your admin login: **Authentication → Users → Add user** → your email + a strong password → check **Auto confirm user**.
4. Copy the new user's UUID (click the user), then run in SQL Editor:
   ```sql
   insert into profiles (id, role) values ('PASTE-UUID-HERE', 'admin');
   ```
5. Get your keys from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**keep secret**)

### 2b. Cloudinary (photo storage + auto-optimization) — free

1. Sign up at https://cloudinary.com (free plan: ~25GB).
2. From the **Dashboard**, copy: Cloud name, API Key, API Secret → the three `CLOUDINARY_*` variables.

### 2c. Resend (booking emails) — free (100 emails/day)

1. Sign up at https://resend.com, create an API key → `RESEND_API_KEY`.
2. Set `ADMIN_EMAIL` to the address that should receive new booking requests.
3. **For testing**, leave `EMAIL_FROM` empty (uses `onboarding@resend.dev` — it can only email *your own* Resend signup address).
   **For production**, add your domain in Resend (Domains → Add → set the DNS records they show), then set `EMAIL_FROM="Beevaa <bookings@beevaa.com>"`.

### 2d. Wire it up

- **Locally**: copy `.env.example` to `.env.local`, fill in the values, restart `npm run dev`.
- **On Vercel**: Project → Settings → Environment Variables → add the same variables → **Redeploy**.
- Also set `NEXT_PUBLIC_SITE_URL` to your live URL (e.g. `https://beevaa.vercel.app`).

Now log in at `/admin`:
- **Bookings** — confirm/decline requests; guests are emailed automatically.
- **Guesthouses** — add/edit listings, rooms and prices. New listings start as *Draft*; switch to *Live* to publish.
- **Photos** — drag & drop uploads (goes to Cloudinary) or paste an image URL. First photo = cover photo; reorder with ←/→.

> Public pages cache for 5 minutes, so admin edits can take up to 5 minutes to appear on the site (instantly on hard refresh of a new deploy).

## Stage 3 — Connect beevaa.com

1. Vercel → Project → **Settings → Domains** → Add `beevaa.com` (and `www.beevaa.com`).
2. At your domain registrar, set the DNS records Vercel shows (an `A` record to `76.76.21.21` and a `CNAME` for `www`).
3. Wait for DNS (minutes to a few hours). SSL is automatic and free.
4. Update `NEXT_PUBLIC_SITE_URL=https://beevaa.com` in Vercel env vars.

## Phase 2 — Online card payments (when you're ready)

Stripe doesn't support Maldives merchants. The practical path:

1. **Start the paperwork now** (it takes weeks, not code):
   - Register your business in the Maldives (if not already).
   - Open a **Bank of Maldives business account** — ask for a **USD merchant account** (tourists pay in USD).
   - Apply for **BML Connect** (their e-commerce payment gateway). Setup fee is currently MVR 0; expect ~2.5–3.5% per international card transaction. Confirm they approve you as a *travel agent / marketplace* merchant (you collect, then pay guesthouses).
2. **Meanwhile the site runs on booking requests** — guests request, you confirm, they pay at the property or by transfer. This is how most Maldives guesthouses already operate.
3. When BML approves you, the integration is: create transaction → redirect guest to BML's hosted payment page → webhook marks the booking paid. API docs: https://bankofmaldives.stoplight.io / https://github.com/bankofmaldives/bml-connect
4. Backup options if BML declines: MIB GlobalPay, MCB (Mastercard MPGS). Avoid PayPal (Maldives accounts can't receive funds) and 2Checkout/Paddle (travel excluded).

## Costs summary

| Item | Cost |
|---|---|
| Hosting (Vercel Hobby) | $0 |
| Database + auth (Supabase free) | $0 |
| Photos (Cloudinary free) | $0 |
| Emails (Resend free, 100/day) | $0 |
| Domain | you already own it |
| **Total** | **$0/month** |
| Phase 2: BML Connect | ~2.5–3.5% per card transaction |

First paid upgrade, only if you outgrow free tiers (~100+ listings / heavy traffic): Supabase Pro $25/mo.

## Day-to-day workflow

- **Content** (listings, rooms, prices, photos, bookings): do it in `/admin` — no redeploy needed.
- **Design/code changes**: ask Claude Code to make them → `git push` → Vercel auto-deploys.
- **Islands**: currently added via SQL (Supabase → SQL Editor → `insert into islands ...`). Ask Claude Code to add an island manager page when you need one.
