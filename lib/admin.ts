import "server-only";
import { createAuthClient, createDataClient } from "./supabase/server";
import type { Booking } from "./types";

/**
 * Returns the logged-in admin user, or null. Used by the admin layout
 * and re-checked inside every server action before any write.
 */
export async function getAdminUser() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") return null;
  return user;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorized");
  return user;
}

/* ------------------------------ bookings ------------------------------ */

const BOOKING_SELECT =
  "*, room:rooms(name, guesthouse:guesthouses(name, island:islands(name)))";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBooking(row: any): Booking {
  return {
    ...row,
    total_usd: Number(row.total_usd),
    room_name: row.room?.name,
    guesthouse_name: row.room?.guesthouse?.name,
    island_name: row.room?.guesthouse?.island?.name,
  };
}

export async function adminListBookings(): Promise<Booking[]> {
  const db = createDataClient();
  const { data, error } = await db
    .from("bookings")
    .select(BOOKING_SELECT)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapBooking);
}

export async function adminGetBooking(id: string): Promise<Booking | null> {
  const db = createDataClient();
  const { data } = await db
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("id", id)
    .maybeSingle();
  return data ? mapBooking(data) : null;
}

export async function adminUpdateBookingStatus(
  id: string,
  status: "confirmed" | "declined" | "cancelled" | "completed"
) {
  const db = createDataClient();
  const { error } = await db.from("bookings").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

/* ----------------------------- guesthouses ---------------------------- */

export async function adminListGuesthouses() {
  const db = createDataClient();
  const { data, error } = await db
    .from("guesthouses")
    .select("*, island:islands(name), rooms(id), photos(id)")
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminGetGuesthouse(id: string) {
  const db = createDataClient();
  const { data, error } = await db
    .from("guesthouses")
    .select("*, island:islands(*), rooms(*, photos(*)), photos(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminListIslands() {
  const db = createDataClient();
  const { data, error } = await db.from("islands").select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}
