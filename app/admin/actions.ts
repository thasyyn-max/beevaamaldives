"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminGetBooking,
  adminUpdateBookingStatus,
  requireAdmin,
} from "@/lib/admin";
import { sendBookingStatusEmail } from "@/lib/email";
import { createDataClient } from "@/lib/supabase/server";

function revalidateAll() {
  revalidatePath("/", "layout");
}

/* ------------------------------ bookings ------------------------------ */

export async function setBookingStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["confirmed", "declined", "cancelled", "completed"].includes(status)) {
    throw new Error("Invalid status");
  }
  await adminUpdateBookingStatus(
    id,
    status as "confirmed" | "declined" | "cancelled" | "completed"
  );
  if (status === "confirmed" || status === "declined") {
    const booking = await adminGetBooking(id);
    if (booking) await sendBookingStatusEmail(booking, status);
  }
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

/* ----------------------------- guesthouses ---------------------------- */

function parseAmenities(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveGuesthouse(formData: FormData) {
  await requireAdmin();
  const db = createDataClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");

  const record = {
    name,
    slug: String(formData.get("slug") || slugify(name)),
    island_id: String(formData.get("island_id")),
    description: String(formData.get("description") ?? ""),
    amenities: parseAmenities(formData.get("amenities")),
    rating: Number(formData.get("rating") ?? 0),
    review_count: Number(formData.get("review_count") ?? 0),
    contact_email: String(formData.get("contact_email") ?? ""),
    contact_phone: String(formData.get("contact_phone") ?? ""),
    status: formData.get("status") === "live" ? "live" : "draft",
  };

  let guesthouseId = id;
  if (id) {
    const { error } = await db.from("guesthouses").update(record).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await db
      .from("guesthouses")
      .insert(record)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    guesthouseId = data.id;
  }
  revalidateAll();
  redirect(`/admin/guesthouses/${guesthouseId}`);
}

export async function deleteGuesthouse(formData: FormData) {
  await requireAdmin();
  const db = createDataClient();
  const { error } = await db
    .from("guesthouses")
    .delete()
    .eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/guesthouses");
}

/* -------------------------------- rooms ------------------------------- */

export async function saveRoom(formData: FormData) {
  await requireAdmin();
  const db = createDataClient();
  const id = String(formData.get("id") ?? "");
  const guesthouseId = String(formData.get("guesthouse_id"));
  const record = {
    guesthouse_id: guesthouseId,
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    max_guests: Math.max(1, Number(formData.get("max_guests") ?? 2)),
    beds: String(formData.get("beds") ?? ""),
    base_price_usd: Number(formData.get("base_price_usd") ?? 0),
    amenities: parseAmenities(formData.get("amenities")),
  };
  if (!record.name) throw new Error("Room name is required");

  const { error } = id
    ? await db.from("rooms").update(record).eq("id", id)
    : await db.from("rooms").insert(record);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteRoom(formData: FormData) {
  await requireAdmin();
  const db = createDataClient();
  const { error } = await db
    .from("rooms")
    .delete()
    .eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidateAll();
}

/* ------------------------------- photos ------------------------------- */

export async function addPhotoRecord(input: {
  guesthouseId?: string;
  roomId?: string;
  url: string;
  alt: string;
}) {
  await requireAdmin();
  if (!input.url || !/^(https:\/\/|\/)/.test(input.url)) {
    throw new Error("Photo URL must start with https:// or /");
  }
  const db = createDataClient();
  const { error } = await db.from("photos").insert({
    guesthouse_id: input.guesthouseId ?? null,
    room_id: input.roomId ?? null,
    url: input.url,
    alt: input.alt,
    sort_order: 999,
  });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deletePhoto(formData: FormData) {
  await requireAdmin();
  const db = createDataClient();
  const { error } = await db
    .from("photos")
    .delete()
    .eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function movePhoto(formData: FormData) {
  await requireAdmin();
  const db = createDataClient();
  const id = String(formData.get("id"));
  const direction = String(formData.get("direction"));
  const guesthouseId = formData.get("guesthouse_id");
  const roomId = formData.get("room_id");

  let query = db.from("photos").select("id, sort_order");
  query = roomId
    ? query.eq("room_id", String(roomId))
    : query.eq("guesthouse_id", String(guesthouseId)).is("room_id", null);
  const { data: photos, error } = await query.order("sort_order");
  if (error) throw new Error(error.message);

  const idx = (photos ?? []).findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= photos!.length) return;

  // Re-number the whole set so legacy 999s normalize, then swap.
  const ordered = photos!.map((p, i) => ({ id: p.id, sort_order: i }));
  [ordered[idx].sort_order, ordered[swapWith].sort_order] = [
    ordered[swapWith].sort_order,
    ordered[idx].sort_order,
  ];
  for (const p of ordered) {
    await db.from("photos").update({ sort_order: p.sort_order }).eq("id", p.id);
  }
  revalidateAll();
}

/* -------------------------------- auth -------------------------------- */

export async function signOut() {
  const { createAuthClient } = await import("@/lib/supabase/server");
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
