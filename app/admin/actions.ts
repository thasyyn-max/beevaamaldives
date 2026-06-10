"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminGetEnquiry,
  adminGetProperty,
  adminSetEnquiryStatus,
  requireAdmin,
} from "@/lib/admin";
import { sendEnquiryReplyEmail } from "@/lib/email";
import { createDataClient } from "@/lib/supabase/server";

function revalidateAll() {
  revalidatePath("/", "layout");
}

/* ------------------------------ enquiries ------------------------------ */

export async function setEnquiryStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["new", "replied", "closed"].includes(status)) {
    throw new Error("Invalid status");
  }
  await adminSetEnquiryStatus(id, status as "new" | "replied" | "closed");
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function replyToEnquiry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const message = String(formData.get("message") ?? "").trim();
  if (!message) throw new Error("Write a reply first");
  const enquiry = await adminGetEnquiry(id);
  if (!enquiry) throw new Error("Enquiry not found");
  await sendEnquiryReplyEmail(enquiry, message);
  await adminSetEnquiryStatus(id, "replied");
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

/* ------------------------------ properties ----------------------------- */

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function csv(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
function parseJsonField(raw: FormDataEntryValue | null) {
  const s = String(raw ?? "").trim();
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    throw new Error("Invalid JSON in rooms/dining field");
  }
}

export async function saveProperty(formData: FormData) {
  await requireAdmin();
  const db = createDataClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");
  const priceRaw = String(formData.get("from_price_usd") ?? "").trim();

  const record = {
    name,
    slug: String(formData.get("slug") || slugify(name)),
    category: String(formData.get("category")),
    atoll: String(formData.get("atoll") ?? "Maldives"),
    description: String(formData.get("description") ?? ""),
    short_description: String(formData.get("short_description") ?? ""),
    tags: csv(formData.get("tags")),
    facilities: csv(formData.get("facilities")),
    accommodations: parseJsonField(formData.get("accommodations")),
    dining: parseJsonField(formData.get("dining")),
    from_price_usd: priceRaw ? Number(priceRaw) : null,
    status: formData.get("status") === "live" ? "live" : "draft",
  };

  let propertyId = id;
  if (id) {
    const { error } = await db.from("properties").update(record).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await db
      .from("properties")
      .insert({ ...record, gallery: [], cover: "" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    propertyId = data.id;
  }
  revalidateAll();
  redirect(`/admin/properties/${propertyId}`);
}

export async function deleteProperty(formData: FormData) {
  await requireAdmin();
  const db = createDataClient();
  const { error } = await db
    .from("properties")
    .delete()
    .eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/properties");
}

/* -------------------------- property gallery --------------------------- */

async function getGallery(propertyId: string): Promise<string[]> {
  const p = await adminGetProperty(propertyId);
  return (p?.gallery as string[]) ?? [];
}

async function saveGallery(propertyId: string, gallery: string[]) {
  const db = createDataClient();
  const cover = gallery[0] ?? "";
  const { error } = await db
    .from("properties")
    .update({ gallery, cover })
    .eq("id", propertyId);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function addPropertyPhoto(input: {
  propertyId: string;
  url: string;
}) {
  await requireAdmin();
  if (!/^(https:\/\/|\/)/.test(input.url)) {
    throw new Error("Photo URL must start with https:// or /");
  }
  const gallery = await getGallery(input.propertyId);
  gallery.push(input.url);
  await saveGallery(input.propertyId, gallery);
}

export async function deletePropertyPhoto(formData: FormData) {
  await requireAdmin();
  const propertyId = String(formData.get("property_id"));
  const url = String(formData.get("url"));
  const gallery = (await getGallery(propertyId)).filter((u) => u !== url);
  await saveGallery(propertyId, gallery);
}

export async function movePropertyPhoto(formData: FormData) {
  await requireAdmin();
  const propertyId = String(formData.get("property_id"));
  const url = String(formData.get("url"));
  const dir = String(formData.get("direction"));
  const gallery = await getGallery(propertyId);
  const i = gallery.indexOf(url);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= gallery.length) return;
  [gallery[i], gallery[j]] = [gallery[j], gallery[i]];
  await saveGallery(propertyId, gallery);
}

/* -------------------------------- auth -------------------------------- */

export async function signOut() {
  const { createAuthClient } = await import("@/lib/supabase/server");
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
