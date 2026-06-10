-- Beevaa marketplace schema for Supabase (Postgres)
-- Run this in the Supabase Dashboard → SQL Editor → New query → paste → Run.

-- ============================================== tables

create table if not exists islands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  atoll text not null default '',
  description text not null default '',
  hero_url text not null default '',
  transfer_info text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists guesthouses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  island_id uuid not null references islands(id) on delete restrict,
  description text not null default '',
  amenities jsonb not null default '[]',
  rating numeric(3,1) not null default 0,
  review_count int not null default 0,
  contact_email text not null default '',
  contact_phone text not null default '',
  status text not null default 'draft' check (status in ('draft','live')),
  created_at timestamptz not null default now()
);

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  guesthouse_id uuid not null references guesthouses(id) on delete cascade,
  name text not null,
  description text not null default '',
  max_guests int not null default 2,
  beds text not null default '',
  base_price_usd numeric(10,2) not null default 0,
  amenities jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- One photo table for both guesthouse galleries and room photos.
-- Guesthouse photos: guesthouse_id set, room_id null. Room photos: room_id set.
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  guesthouse_id uuid references guesthouses(id) on delete cascade,
  room_id uuid references rooms(id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  check (guesthouse_id is not null or room_id is not null)
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  room_id uuid not null references rooms(id) on delete restrict,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null default '',
  guest_country text not null default '',
  check_in date not null,
  check_out date not null,
  guests int not null default 2,
  nights int not null default 1,
  total_usd numeric(10,2) not null default 0,
  message text not null default '',
  status text not null default 'pending'
    check (status in ('pending','confirmed','declined','cancelled','completed')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','paid','refunded')), -- used in Phase 2 (BML Connect)
  created_at timestamptz not null default now()
);

-- Admin/owner roles. Add a row here after creating a user in Supabase Auth.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','owner')),
  guesthouse_id uuid references guesthouses(id) on delete set null, -- for owner logins later
  created_at timestamptz not null default now()
);

create index if not exists idx_guesthouses_island on guesthouses(island_id);
create index if not exists idx_rooms_guesthouse on rooms(guesthouse_id);
create index if not exists idx_photos_guesthouse on photos(guesthouse_id);
create index if not exists idx_photos_room on photos(room_id);
create index if not exists idx_bookings_room on bookings(room_id);
create index if not exists idx_bookings_status on bookings(status);

-- ============================================== row level security
-- The app's server uses the service-role key for writes (bypasses RLS).
-- These policies only allow anonymous READ access to live public content.

alter table islands enable row level security;
alter table guesthouses enable row level security;
alter table rooms enable row level security;
alter table photos enable row level security;
alter table bookings enable row level security;
alter table profiles enable row level security;

create policy "public read islands" on islands for select using (true);

create policy "public read live guesthouses" on guesthouses
  for select using (status = 'live');

create policy "public read rooms of live guesthouses" on rooms
  for select using (
    exists (select 1 from guesthouses g where g.id = rooms.guesthouse_id and g.status = 'live')
  );

create policy "public read photos of live guesthouses" on photos
  for select using (
    exists (select 1 from guesthouses g where g.id = photos.guesthouse_id and g.status = 'live')
    or exists (
      select 1 from rooms r join guesthouses g on g.id = r.guesthouse_id
      where r.id = photos.room_id and g.status = 'live'
    )
  );

-- No anon policies on bookings/profiles: all access goes through the server.

-- Authenticated admins can read their own profile (used by the admin panel).
create policy "users read own profile" on profiles
  for select using (auth.uid() = id);

-- ============================================== seed data (optional but recommended)
-- Gives the site real-looking content immediately. Edit/delete in the admin panel later.

with isl as (
  insert into islands (slug, name, atoll, description, hero_url, transfer_info) values
  ('maafushi','Maafushi','Kaafu Atoll','The original local-island destination: a lively guesthouse scene, a long bikini beach, sandbank trips and every excursion imaginable — 45 minutes from Malé by speedboat.','/demo/beach-1.svg','Speedboat from Malé, ~45 min (USD 25–30) or public ferry (USD 2)'),
  ('thoddoo','Thoddoo','Alif Alif Atoll','A green farming island famous for papaya and watermelon plantations, a wide bikini beach with calm turquoise water, and a relaxed, uncrowded vibe.','/demo/beach-2.svg','Speedboat from Malé, ~1h 45min (USD 50–55)'),
  ('dhigurah','Dhigurah','Alif Dhaal Atoll','A 3 km strip of white sand next to year-round whale shark territory. Snorkel the house reef in the morning, walk the endless beach at sunset.','/demo/beach-3.svg','Speedboat from Malé, ~2h (USD 55–65) or domestic flight to Maamigili'),
  ('fulidhoo','Fulidhoo','Vaavu Atoll','Tiny, postcard-pretty island where stingrays and nurse sharks glide along the jetty at dusk. Famous for traditional Boduberu drumming evenings.','/demo/beach-4.svg','Speedboat from Malé, ~1h 15min (USD 40–50)'),
  ('ukulhas','Ukulhas','Alif Alif Atoll','An award-winning eco island known for spotless streets, green initiatives, manta point nearby and one of the prettiest bikini beaches in the atolls.','/demo/beach-5.svg','Speedboat from Malé, ~1h 30min (USD 50)')
  returning id, slug
),
gh as (
  insert into guesthouses (slug, name, island_id, description, amenities, rating, review_count, contact_email, contact_phone, status)
  select v.slug, v.name, isl.id, v.description, v.amenities::jsonb, v.rating, v.review_count, v.email, v.phone, 'live'
  from (values
    ('coral-sands-inn','Coral Sands Inn','maafushi','A family-run guesthouse 2 minutes'' walk from Maafushi bikini beach. Rooftop breakfast terrace, daily sandbank and snorkelling trips, and rooms refreshed in 2025.','["Free WiFi","Air conditioning","Hot water","Breakfast included","Airport transfer","Excursions desk","Bikini beach nearby"]',9.2,184,'stay@coralsands.example','+960 777-0001'),
    ('bikini-beach-view','Bikini Beach View','maafushi','Budget-friendly rooms literally across the path from the bikini beach. Hammocks, a sunset swing and the best smoothies on Maafushi.','["Free WiFi","Air conditioning","Hot water","Bikini beach nearby","Excursions desk","Café / restaurant"]',8.7,96,'hello@bikinibeachview.example','+960 777-0002'),
    ('thoddoo-retreat-garden','Thoddoo Retreat Garden','thoddoo','Set in a tropical fruit garden five minutes from Thoddoo''s famous beach. Breakfast comes with papaya picked the same morning.','["Free WiFi","Air conditioning","Hot water","Breakfast included","Free bicycles","Bikini beach nearby"]',9.5,142,'stay@thoddooretreat.example','+960 777-0003'),
    ('whale-shark-lodge','Whale Shark Lodge','dhigurah','Dive-and-snorkel lodge at the quiet end of Dhigurah''s 3 km beach. Daily whale shark search trips with in-house guides, gear included.','["Free WiFi","Air conditioning","Hot water","Breakfast included","Excursions desk","Airport transfer","Café / restaurant"]',9.0,121,'dive@whalesharklodge.example','+960 777-0004'),
    ('stingray-villa','Stingray Villa','fulidhoo','Boutique four-room villa a minute from Fulidhoo jetty, where stingrays gather every evening. Boduberu nights on Fridays.','["Free WiFi","Air conditioning","Hot water","Breakfast included","Bikini beach nearby","Excursions desk"]',9.3,77,'stay@stingrayvilla.example','+960 777-0005'),
    ('ukulhas-sunset-house','Ukulhas Sunset House','ukulhas','West-facing rooms built for sunset views on the Maldives'' cleanest island. Manta snorkelling trips in season and free bikes for every guest.','["Free WiFi","Air conditioning","Hot water","Breakfast included","Free bicycles","Bikini beach nearby","Family rooms"]',8.9,104,'hello@ukulhassunset.example','+960 777-0006')
  ) as v(slug, name, island_slug, description, amenities, rating, review_count, email, phone)
  join isl on isl.slug = v.island_slug
  returning id, slug
),
rm as (
  insert into rooms (guesthouse_id, name, description, max_guests, beds, base_price_usd, amenities)
  select gh.id, v.name, v.description, v.max_guests, v.beds, v.price, v.amenities::jsonb
  from (values
    ('coral-sands-inn','Deluxe Double Room','Queen bed, rain shower, balcony with island views.',2,'1 queen bed',55,'["Balcony","Rain shower","Mini fridge"]'),
    ('coral-sands-inn','Sea View Deluxe','Corner room with direct lagoon views and a daybed.',3,'1 queen bed + daybed',70,'["Sea view","Daybed","Coffee maker"]'),
    ('coral-sands-inn','Family Room','Two connecting rooms sleeping up to five, ideal for families.',5,'1 queen + 3 singles',95,'["Connecting rooms","Bathtub","Mini fridge"]'),
    ('bikini-beach-view','Standard Double','Cosy double steps from the sand.',2,'1 double bed',48,'["Beach access","Desk"]'),
    ('bikini-beach-view','Triple Room','Roomy triple for friends travelling together.',3,'3 single beds',65,'["Beach access","Reading lights"]'),
    ('thoddoo-retreat-garden','Garden Villa','Private villa with outdoor seating in the fruit garden.',2,'1 king bed',42,'["Garden terrace","Outdoor seating"]'),
    ('thoddoo-retreat-garden','Family Garden Suite','Two-room suite opening onto the garden.',4,'1 king + 2 singles',78,'["Two rooms","Garden terrace"]'),
    ('whale-shark-lodge','Ocean Room','Bright double with reef views from the balcony.',2,'1 queen bed',65,'["Balcony","Sea view","Dive storage"]'),
    ('whale-shark-lodge','Beach Bungalow','Stand-alone bungalow with direct beach access.',3,'1 king + 1 single',85,'["Beach access","Outdoor shower"]'),
    ('stingray-villa','Villa Double','Calm, minimal double with handmade coral-wood furniture.',2,'1 queen bed',50,'["Veranda","Hammock"]'),
    ('ukulhas-sunset-house','Sunset Double','West-facing double with a balcony made for golden hour.',2,'1 queen bed',58,'["Sunset balcony","Coffee maker"]'),
    ('ukulhas-sunset-house','Family Loft','Split-level loft sleeping four, kids love the upstairs nook.',4,'1 queen + 2 singles',88,'["Split level","Two bathrooms"]')
  ) as v(gh_slug, name, description, max_guests, beds, price, amenities)
  join gh on gh.slug = v.gh_slug
  returning id, guesthouse_id, name
)
insert into photos (guesthouse_id, room_id, url, alt, sort_order)
select gh.id, null, v.url, v.alt, v.sort_order
from (values
  ('coral-sands-inn','/demo/beach-1.svg','Coral Sands Inn beachfront',0),
  ('coral-sands-inn','/demo/room-1.svg','Deluxe double room',1),
  ('coral-sands-inn','/demo/beach-6.svg','Lagoon view',2),
  ('bikini-beach-view','/demo/beach-6.svg','Beachfront at Bikini Beach View',0),
  ('bikini-beach-view','/demo/room-2.svg','Standard double room',1),
  ('thoddoo-retreat-garden','/demo/beach-2.svg','Thoddoo beach',0),
  ('thoddoo-retreat-garden','/demo/room-3.svg','Garden villa room',1),
  ('whale-shark-lodge','/demo/beach-3.svg','Dhigurah long beach',0),
  ('whale-shark-lodge','/demo/room-4.svg','Ocean room',1),
  ('stingray-villa','/demo/beach-4.svg','Fulidhoo lagoon',0),
  ('stingray-villa','/demo/room-1.svg','Villa room',1),
  ('ukulhas-sunset-house','/demo/beach-5.svg','Ukulhas sunset',0),
  ('ukulhas-sunset-house','/demo/room-2.svg','Sunset room',1)
) as v(gh_slug, url, alt, sort_order)
join gh on gh.slug = v.gh_slug;

-- Give every room one photo (uses room name to pick a placeholder).
insert into photos (room_id, url, alt, sort_order)
select r.id,
  '/demo/room-' || (1 + (abs(hashtext(r.name)) % 4))::text || '.svg',
  r.name, 0
from rooms r
where not exists (select 1 from photos p where p.room_id = r.id);

-- ============================================== after running this file:
-- 1. Supabase Dashboard → Authentication → Users → "Add user" → create your
--    admin login (email + password, check "Auto confirm user").
-- 2. Copy the new user's UUID, then run:
--      insert into profiles (id, role) values ('<that-uuid>', 'admin');
