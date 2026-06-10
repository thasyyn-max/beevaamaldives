import "server-only";
import { createAuthClient, createDataClient } from "./supabase/server";
import type { Enquiry, Property } from "./types";

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

/* ------------------------------ enquiries ------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEnquiry(row: any): Enquiry {
  return { ...row, property_name: row.property?.name };
}

export async function adminListEnquiries(): Promise<Enquiry[]> {
  const db = createDataClient();
  const { data, error } = await db
    .from("enquiries")
    .select("*, property:properties(name)")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapEnquiry);
}

export async function adminGetEnquiry(id: string): Promise<Enquiry | null> {
  const db = createDataClient();
  const { data } = await db
    .from("enquiries")
    .select("*, property:properties(name)")
    .eq("id", id)
    .maybeSingle();
  return data ? mapEnquiry(data) : null;
}

export async function adminSetEnquiryStatus(
  id: string,
  status: "new" | "replied" | "closed"
) {
  const db = createDataClient();
  const { error } = await db.from("enquiries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

/* ------------------------------ properties ----------------------------- */

export async function adminListProperties() {
  const db = createDataClient();
  const { data, error } = await db
    .from("properties")
    .select("id, slug, name, category, atoll, status, from_price_usd, cover")
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminGetProperty(id: string): Promise<Property | null> {
  const db = createDataClient();
  const { data, error } = await db
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any) ?? null;
}

export async function adminListCategories() {
  const db = createDataClient();
  const { data, error } = await db
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
}
