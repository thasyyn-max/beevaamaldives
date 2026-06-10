import "server-only";
import { isSupabaseConfigured } from "./config";
import { demoGuesthouses, demoIslands } from "./demo-data";
import { createDataClient } from "./supabase/server";
import type {
  Booking,
  Guesthouse,
  Island,
  Photo,
  Room,
  SearchFilters,
} from "./types";
import { nightsBetween } from "./types";

export const isDemoMode = () => !isSupabaseConfigured();

/* ---------------------------------- mapping --------------------------------- */

type PhotoRow = {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number | null;
};

function mapPhotos(rows: PhotoRow[] | null | undefined): Photo[] {
  return (rows ?? [])
    .map((p) => ({
      id: p.id,
      url: p.url,
      alt: p.alt ?? "",
      sort_order: p.sort_order ?? 0,
    }))
    .sort((a, b) => a.sort_order - b.sort_order);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRoom(row: any): Room {
  return {
    id: row.id,
    guesthouse_id: row.guesthouse_id,
    name: row.name,
    description: row.description ?? "",
    max_guests: row.max_guests ?? 2,
    beds: row.beds ?? "",
    base_price_usd: Number(row.base_price_usd ?? 0),
    amenities: (row.amenities as string[]) ?? [],
    photos: mapPhotos(row.photos),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGuesthouse(row: any): Guesthouse {
  const rooms: Room[] = (row.rooms ?? []).map(mapRoom);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    island_id: row.island_id,
    island: row.island ?? undefined,
    description: row.description ?? "",
    amenities: (row.amenities as string[]) ?? [],
    rating: Number(row.rating ?? 0),
    review_count: row.review_count ?? 0,
    contact_email: row.contact_email ?? "",
    contact_phone: row.contact_phone ?? "",
    status: row.status ?? "live",
    photos: mapPhotos(row.photos),
    rooms: rooms.sort((a, b) => a.base_price_usd - b.base_price_usd),
    min_price_usd: rooms.length
      ? Math.min(...rooms.map((r) => r.base_price_usd))
      : undefined,
  };
}

const GH_SELECT =
  "*, island:islands(*), rooms(*, photos(*)), photos(*)";

function withDemoExtras(gh: Guesthouse): Guesthouse {
  return {
    ...gh,
    island: demoIslands.find((i) => i.id === gh.island_id),
    min_price_usd: gh.rooms.length
      ? Math.min(...gh.rooms.map((r) => r.base_price_usd))
      : undefined,
  };
}

/* ---------------------------------- islands --------------------------------- */

export async function getIslands(): Promise<Island[]> {
  if (isDemoMode()) return demoIslands;
  const db = createDataClient();
  const { data, error } = await db.from("islands").select("*").order("name");
  if (error) throw new Error(`islands: ${error.message}`);
  return data as Island[];
}

export async function getIslandBySlug(slug: string): Promise<Island | null> {
  if (isDemoMode()) return demoIslands.find((i) => i.slug === slug) ?? null;
  const db = createDataClient();
  const { data } = await db.from("islands").select("*").eq("slug", slug).maybeSingle();
  return (data as Island) ?? null;
}

/* -------------------------------- guesthouses ------------------------------- */

export async function getGuesthouses(
  filters: SearchFilters = {}
): Promise<Guesthouse[]> {
  let list: Guesthouse[];
  if (isDemoMode()) {
    list = demoGuesthouses.map(withDemoExtras);
  } else {
    const db = createDataClient();
    const { data, error } = await db
      .from("guesthouses")
      .select(GH_SELECT)
      .eq("status", "live");
    if (error) throw new Error(`guesthouses: ${error.message}`);
    list = (data ?? []).map(mapGuesthouse);
  }

  if (filters.island) {
    list = list.filter((g) => g.island?.slug === filters.island);
  }
  if (filters.guests) {
    list = list.filter((g) =>
      g.rooms.some((r) => r.max_guests >= filters.guests!)
    );
  }
  if (filters.maxPrice) {
    list = list.filter(
      (g) => (g.min_price_usd ?? Infinity) <= filters.maxPrice!
    );
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.island?.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
    );
  }
  if (filters.sort === "price") {
    list = [...list].sort(
      (a, b) => (a.min_price_usd ?? 9999) - (b.min_price_usd ?? 9999)
    );
  } else {
    list = [...list].sort((a, b) => b.rating - a.rating);
  }
  return list;
}

export async function getGuesthouseBySlug(
  slug: string
): Promise<Guesthouse | null> {
  if (isDemoMode()) {
    const gh = demoGuesthouses.find((g) => g.slug === slug);
    return gh ? withDemoExtras(gh) : null;
  }
  const db = createDataClient();
  const { data } = await db
    .from("guesthouses")
    .select(GH_SELECT)
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();
  return data ? mapGuesthouse(data) : null;
}

export async function getRoomById(
  roomId: string
): Promise<{ room: Room; guesthouse: Guesthouse } | null> {
  if (isDemoMode()) {
    for (const gh of demoGuesthouses) {
      const room = gh.rooms.find((r) => r.id === roomId);
      if (room) return { room, guesthouse: withDemoExtras(gh) };
    }
    return null;
  }
  const db = createDataClient();
  const { data } = await db
    .from("rooms")
    .select("*, photos(*), guesthouse:guesthouses(" + GH_SELECT + ")")
    .eq("id", roomId)
    .maybeSingle();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = data as any;
  if (!row || !row.guesthouse) return null;
  return { room: mapRoom(row), guesthouse: mapGuesthouse(row.guesthouse) };
}

/* ---------------------------------- bookings -------------------------------- */

export type BookingInput = {
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
};

function makeReference(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  return `BV-${time}${rand}`;
}

// Demo-mode bookings live in memory (reset on server restart) — good enough
// for previewing the flow before Supabase is connected.
const demoBookings: Booking[] = [];

export async function createBooking(input: BookingInput): Promise<Booking> {
  const found = await getRoomById(input.roomId);
  if (!found) throw new Error("Room not found");
  const { room, guesthouse } = found;

  const nights = nightsBetween(input.checkIn, input.checkOut);
  if (nights < 1) throw new Error("Check-out must be after check-in");
  if (input.guests > room.max_guests)
    throw new Error(`This room sleeps up to ${room.max_guests} guests`);

  const base = {
    reference: makeReference(),
    room_id: room.id,
    guest_name: input.guestName,
    guest_email: input.guestEmail,
    guest_phone: input.guestPhone,
    guest_country: input.guestCountry,
    check_in: input.checkIn,
    check_out: input.checkOut,
    guests: input.guests,
    nights,
    total_usd: nights * room.base_price_usd,
    message: input.message,
    status: "pending" as const,
  };

  if (isDemoMode()) {
    const booking: Booking = {
      ...base,
      id: `demo-${base.reference}`,
      created_at: new Date().toISOString(),
      room_name: room.name,
      guesthouse_name: guesthouse.name,
      island_name: guesthouse.island?.name,
    };
    demoBookings.unshift(booking);
    return booking;
  }

  const db = createDataClient();
  const { data, error } = await db
    .from("bookings")
    .insert(base)
    .select("*")
    .single();
  if (error) throw new Error(`booking: ${error.message}`);
  return {
    ...(data as Booking),
    room_name: room.name,
    guesthouse_name: guesthouse.name,
    island_name: guesthouse.island?.name,
  };
}

export async function getBookingByReference(
  reference: string
): Promise<Booking | null> {
  if (isDemoMode()) {
    return demoBookings.find((b) => b.reference === reference) ?? null;
  }
  const db = createDataClient();
  const { data } = await db
    .from("bookings")
    .select("*, room:rooms(name, guesthouse:guesthouses(name, island:islands(name)))")
    .eq("reference", reference)
    .maybeSingle();
  if (!data) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = data as any;
  return {
    ...row,
    total_usd: Number(row.total_usd),
    room_name: row.room?.name,
    guesthouse_name: row.room?.guesthouse?.name,
    island_name: row.room?.guesthouse?.island?.name,
  };
}
