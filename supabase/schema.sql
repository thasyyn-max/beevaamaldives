-- Beevaa Maldives schema for Supabase (Postgres)
-- Run in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Then seed content with: node scripts/import/seed-supabase.mjs

create table if not exists categories (
  slug text primary key,
  name text not null,
  tagline text not null default '',
  image text not null default '',
  sort_order int not null default 0
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  legacy_id int,
  slug text not null unique,
  name text not null,
  category text not null references categories(slug),
  atoll text not null default 'Maldives',
  tags jsonb not null default '[]',
  description text not null default '',
  short_description text not null default '',
  facilities jsonb not null default '[]',
  accommodations jsonb not null default '[]',
  dining jsonb not null default '[]',
  gallery jsonb not null default '[]',
  cover text not null default '',
  from_price_usd numeric(10,2),
  status text not null default 'draft' check (status in ('draft','live')),
  created_at timestamptz not null default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null default '',
  images jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  property_id uuid references properties(id) on delete set null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null default '',
  guest_country text not null default '',
  check_in date,
  check_out date,
  guests int not null default 2,
  message text not null default '',
  status text not null default 'new' check (status in ('new','replied','closed')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','paid','refunded')), -- Phase 2: BML Connect
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','owner')),
  created_at timestamptz not null default now()
);

create index if not exists idx_properties_category on properties(category);
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_enquiries_status on enquiries(status);

-- ============================================== row level security
alter table categories enable row level security;
alter table properties enable row level security;
alter table articles enable row level security;
alter table enquiries enable row level security;
alter table profiles enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read articles" on articles for select using (true);
create policy "public read live properties" on properties
  for select using (status = 'live');
-- enquiries/profiles: no anon policies; all access goes through the server (service role).
create policy "users read own profile" on profiles
  for select using (auth.uid() = id);

-- ============================================== categories seed
insert into categories (slug, name, tagline, image, sort_order) values
  ('resorts','Resorts','Private-island luxury — one island, one resort.','/import/category/category_image_001.jpg',1),
  ('liveaboards','Liveaboards','Sail the atolls — dive, surf and explore aboard.','/import/category/category_image_002.jpeg',2),
  ('city-hotels','City Hotels','Stay local — guesthouses and hotels on inhabited islands.','/import/category/category_image_003.png',3)
on conflict (slug) do update set
  name = excluded.name, tagline = excluded.tagline, image = excluded.image;

-- ============================================== after running this file:
-- 1. node scripts/import/seed-supabase.mjs   (pushes the 26 properties + articles)
-- 2. Authentication → Users → Add user (your admin email + password, Auto confirm)
-- 3. insert into profiles (id, role) values ('<that-user-uuid>', 'admin');
