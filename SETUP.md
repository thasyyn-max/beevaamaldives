# Beevaa Maldives — Setup & Publishing Guide

A modern, mobile-first site for Beevaa Maldives (resorts, safari boats, guesthouses).
**Total monthly cost: $0** on free tiers.

The site works in stages — stop at any stage and it still works:

| Stage | What works | What you need |
|---|---|---|
| **Bundled** (right now) | Full public site with the real imported catalogue (26 properties + guide), enquiry flow returns a reference | Nothing |
| **Connected** | Real database, admin panel (enquiries, properties, photos), emails | Supabase + Cloudinary + Resend (all free) |
| **Live** | Same, on beevaa.com | Point your domain at Vercel |

---

## Stage 0 — Run it locally (works right now)

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the site runs on the bundled imported content.

## Stage 1 — Publish the test website (Vercel, free, ~15 min)

1. **Push to GitHub**: create a free **private** repo `beevaa`, then:
   ```bash
   git remote add origin https://github.com/<you>/beevaa.git
   git push -u origin main
   ```
2. **Deploy on Vercel**: sign up at vercel.com with GitHub (Hobby = free) →
   "Add New → Project" → import `beevaa` → keep defaults → **Deploy**.
   ~2 min later it's live at `https://beevaa-xxx.vercel.app` (renamable in
   Settings → Domains). Every `git push` auto-deploys.

> The deployed site shows the full catalogue immediately — perfect for review.

## Stage 2 — Connect the backend (admin: enquiries, properties, photo uploads)

### 2a. Supabase (database + admin login) — free
1. Create a project at supabase.com (region: Singapore or Mumbai).
2. **SQL Editor → New query** → paste [`supabase/schema.sql`](supabase/schema.sql) → **Run**
   (creates tables, security policies, seeds the 3 categories).
3. Get keys from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (**keep secret**)
4. Put those in `.env.local` (copy from `.env.example`), then **seed the 26 properties + articles**:
   ```bash
   node --env-file=.env.local scripts/import/seed-supabase.mjs
   ```
5. Create your admin login: **Authentication → Users → Add user** (email + password,
   check Auto confirm). Copy the user's UUID, then in SQL Editor:
   ```sql
   insert into profiles (id, role) values ('PASTE-UUID', 'admin');
   ```

### 2b. Cloudinary (photo uploads) — free
Sign up at cloudinary.com → Dashboard → copy Cloud name, API Key, API Secret into
the three `CLOUDINARY_*` vars. (The bundled catalogue photos already work without this;
Cloudinary is only needed to upload *new* photos from the admin panel.)

### 2c. Resend (enquiry emails) — free (100/day)
Sign up at resend.com → create an API key → `RESEND_API_KEY`; set `ADMIN_EMAIL` to
where enquiries should land. For testing leave `EMAIL_FROM` empty (uses
`onboarding@resend.dev`). For production, verify your domain in Resend and set
`EMAIL_FROM="Beevaa Maldives <inquiry@beevaamaldives.com>"`.

### 2d. Wire it up
- **Locally**: fill `.env.local`, restart `npm run dev`.
- **On Vercel**: Settings → Environment Variables → add the same vars → **Redeploy**.
- Set `NEXT_PUBLIC_SITE_URL` to your live URL.

Then log in at `/admin`:
- **Enquiries** — every request lands here; reply by email (marks as replied).
- **Properties** — edit details, prices, tags, facilities, rooms/villas & dining;
  manage photos (drag-drop → Cloudinary, reorder, first = cover); Draft vs Live.

> Public pages cache for 5 minutes, so admin edits appear within ~5 min.

## Stage 3 — Connect beevaa.com
Vercel → Settings → Domains → add `beevaa.com` + `www` → set the DNS records Vercel
shows at your registrar. Free SSL, ~10 min. Update `NEXT_PUBLIC_SITE_URL`.

## Phase 2 — Online card payments (BML Connect)

Stripe doesn't support Maldives merchants. The practical path:
1. **Start now (paperwork, weeks not code)**: register the business, open a **Bank of
   Maldives business account** (ask for a **USD merchant account**), apply for **BML
   Connect**. Setup fee currently MVR 0; ~2.5–3.5% per international card.
2. **Meanwhile the site runs on enquiries** — guests enquire, you quote, they pay by
   transfer / on arrival.
3. When approved, add: create transaction → redirect to BML's hosted page → webhook
   marks the enquiry paid. Docs: https://bankofmaldives.stoplight.io
4. Backups if BML declines: MIB GlobalPay, MCB (Mastercard MPGS). Avoid PayPal
   (Maldives can't receive) and 2Checkout/Paddle (travel excluded).

## Brand: your colors + logo
- **Colors**: edit the CSS variables at the top of [`app/globals.css`](app/globals.css)
  (`--brand`, `--brand-ink`, `--brand-50`, `--accent`, `--ink`, …). Send hex codes and
  they drop straight in.
- **Logo**: replace the wordmark in [`components/Logo.tsx`](components/Logo.tsx) with
  your image (drop the file in `/public`, swap the `<span>` block for `<Image>`).
- **Fonts**: change the two Google fonts in [`app/layout.tsx`](app/layout.tsx).

## Re-importing / updating the catalogue from the old site

```bash
# 1. (re)scrape pages into ./scrape  — see scripts in scripts/import/
# 2. parse into data/import.json + image list
node scripts/import/parse.mjs
# 3. download + optimize images into public/import/
node scripts/import/download-images.mjs
node scripts/import/optimize-images.mjs
# 4. (if Supabase connected) push to the database
node --env-file=.env.local scripts/import/seed-supabase.mjs
```

## Costs summary
| Item | Cost |
|---|---|
| Hosting (Vercel Hobby) | $0 |
| Database + auth (Supabase free) | $0 |
| Photo uploads (Cloudinary free) | $0 |
| Emails (Resend free) | $0 |
| Domain | you own it |
| **Total** | **$0/month** |
| Phase 2: BML Connect | ~2.5–3.5% per card transaction |
