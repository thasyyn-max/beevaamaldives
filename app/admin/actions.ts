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
export async function saveProperty(formData: FormData) {
  await requireAdmin();
  const db = createDataClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");
  const priceRaw = String(formData.get("from_price_usd") ?? "").trim();

  // Rooms (accommodations) and dining are managed by their own editor —
  // deliberately not part of this record so saving details never wipes them.
  const record = {
    name,
    slug: String(formData.get("slug") || slugify(name)),
    category: String(formData.get("category")),
    atoll: String(formData.get("atoll") ?? "Maldives"),
    description: String(formData.get("description") ?? ""),
    short_description: String(formData.get("short_description") ?? ""),
    tags: csv(formData.get("tags")),
    facilities: csv(formData.get("facilities")),
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
      .insert({
        ...record,
        gallery: [],
        cover: "",
        accommodations: [],
        dining: [],
      })
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

/* --------------------- rooms & dining (content blocks) ------------------ */

type BlockField = "accommodations" | "dining";
type Block = {
  title: string;
  description: string;
  image: string;
  beds?: string;
  sleeps?: string;
};

async function getBlocks(propertyId: string, field: BlockField): Promise<Block[]> {
  const p = await adminGetProperty(propertyId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((p as any)?.[field] as Block[]) ?? [];
}

async function saveBlocks(propertyId: string, field: BlockField, blocks: Block[]) {
  const db = createDataClient();
  const { error } = await db
    .from("properties")
    .update({ [field]: blocks })
    .eq("id", propertyId);
  if (error) throw new Error(error.message);
  revalidateAll();
}

function assertField(field: string): BlockField {
  if (field !== "accommodations" && field !== "dining")
    throw new Error("Invalid field");
  return field;
}

/** Add (index = -1) or update (index >= 0) a room/dining block. */
export async function saveBlock(input: {
  propertyId: string;
  field: string;
  index: number;
  title: string;
  description: string;
  image: string;
  beds?: string;
  sleeps?: string;
}) {
  await requireAdmin();
  const field = assertField(input.field);
  const title = input.title.trim();
  if (!title) throw new Error("Name is required");
  if (input.image && !/^(https:\/\/|\/)/.test(input.image))
    throw new Error("Image URL must start with https:// or /");
  const blocks = await getBlocks(input.propertyId, field);
  const block: Block = {
    title,
    description: input.description.trim(),
    image: input.image.trim(),
    beds: (input.beds ?? "").trim(),
    sleeps: (input.sleeps ?? "").trim(),
  };
  if (input.index >= 0 && input.index < blocks.length) {
    blocks[input.index] = block;
  } else {
    blocks.push(block);
  }
  await saveBlocks(input.propertyId, field, blocks);
}

export async function deleteBlock(input: {
  propertyId: string;
  field: string;
  index: number;
}) {
  await requireAdmin();
  const field = assertField(input.field);
  const blocks = await getBlocks(input.propertyId, field);
  blocks.splice(input.index, 1);
  await saveBlocks(input.propertyId, field, blocks);
}

export async function moveBlock(input: {
  propertyId: string;
  field: string;
  index: number;
  direction: "up" | "down";
}) {
  await requireAdmin();
  const field = assertField(input.field);
  const blocks = await getBlocks(input.propertyId, field);
  const j = input.direction === "up" ? input.index - 1 : input.index + 1;
  if (input.index < 0 || j < 0 || j >= blocks.length) return;
  [blocks[input.index], blocks[j]] = [blocks[j], blocks[input.index]];
  await saveBlocks(input.propertyId, field, blocks);
}

/* ------------------------------ hero slides ----------------------------- */

export async function addHeroSlide(input: {
  kind: "image" | "video";
  url: string;
  poster?: string;
}) {
  await requireAdmin();
  if (!/^(https:\/\/|\/)/.test(input.url))
    throw new Error("URL must start with https:// or /");
  const db = createDataClient();
  const { count } = await db
    .from("hero_slides")
    .select("id", { count: "exact", head: true });
  if ((count ?? 0) >= 5) throw new Error("Maximum 5 slides — delete one first");
  const { error } = await db.from("hero_slides").insert({
    kind: input.kind,
    url: input.url,
    poster: input.poster ?? "",
    sort_order: (count ?? 0) + 1,
  });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteHeroSlide(id: string) {
  await requireAdmin();
  const db = createDataClient();
  const { error } = await db.from("hero_slides").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function moveHeroSlide(id: string, direction: "up" | "down") {
  await requireAdmin();
  const db = createDataClient();
  const { data, error } = await db
    .from("hero_slides")
    .select("id")
    .order("sort_order");
  if (error) throw new Error(error.message);
  const ids = (data ?? []).map((r) => r.id);
  const i = ids.indexOf(id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  for (let k = 0; k < ids.length; k++) {
    await db.from("hero_slides").update({ sort_order: k }).eq("id", ids[k]);
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
