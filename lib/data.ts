import "server-only";
import { isSupabaseConfigured } from "./config";
import { EXPERIENCE_SLUGS } from "./experiences";
import {
  demoArticles,
  demoBanners,
  demoCategories,
  demoProperties,
} from "./demo-data";
import { createDataClient } from "./supabase/server";
import type {
  Article,
  Category,
  Enquiry,
  HeroSlide,
  Property,
  PropertyFilters,
} from "./types";

export const isDemoMode = () => !isSupabaseConfigured();

export async function getBanners(): Promise<string[]> {
  return demoBanners;
}

/* --------------------------------- hero slides ------------------------------- */

export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (!isDemoMode()) {
    const db = createDataClient();
    const { data } = await db
      .from("hero_slides")
      .select("*")
      .order("sort_order")
      .limit(5);
    if (data && data.length > 0) return data as HeroSlide[];
  }
  // Fallback: the bundled banner photos as image slides.
  return demoBanners.map((url, i) => ({
    id: `banner-${i}`,
    kind: "image" as const,
    url,
    poster: "",
    sort_order: i,
  }));
}

/* --------------------------------- categories -------------------------------- */

export async function getCategories(): Promise<Category[]> {
  if (isDemoMode()) return demoCategories;
  const db = createDataClient();
  const { data, error } = await db.from("categories").select("*").order("name");
  if (error) throw new Error(`categories: ${error.message}`);
  return (data as Category[]) ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) ?? null;
}

/* --------------------------------- properties -------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProperty(row: any): Property {
  return {
    id: row.id,
    legacy_id: row.legacy_id ?? undefined,
    slug: row.slug,
    name: row.name,
    category: row.category,
    atoll: row.atoll ?? "Maldives",
    tags: row.tags ?? [],
    description: row.description ?? "",
    short_description: row.short_description ?? "",
    facilities: row.facilities ?? [],
    accommodations: row.accommodations ?? [],
    dining: row.dining ?? [],
    experiences: row.experiences ?? [],
    gallery: row.gallery ?? [],
    cover: row.cover ?? "",
    from_price_usd: row.from_price_usd ?? null,
    status: row.status ?? "live",
  };
}

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<Property[]> {
  let list: Property[];
  if (isDemoMode()) {
    list = demoProperties.filter((p) => p.status === "live");
  } else {
    const db = createDataClient();
    const { data, error } = await db
      .from("properties")
      .select("*")
      .eq("status", "live");
    if (error) throw new Error(`properties: ${error.message}`);
    list = (data ?? []).map(mapProperty);
  }

  if (filters.category)
    list = list.filter((p) => p.category === filters.category);
  if (filters.maxPrice)
    list = list.filter(
      (p) => p.from_price_usd !== null && p.from_price_usd <= filters.maxPrice!
    );
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.atoll.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (filters.sort === "price") {
    list = [...list].sort(
      (a, b) => (a.from_price_usd ?? 1e9) - (b.from_price_usd ?? 1e9)
    );
  } else if (filters.sort === "name") {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  }
  return list;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (isDemoMode()) {
    return demoProperties.find((p) => p.slug === slug) ?? null;
  }
  const db = createDataClient();
  const { data } = await db
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ? mapProperty(data) : null;
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const all = await getProperties();
  // One or two from each category, priced first, for a balanced home page.
  const byCat = new Map<string, Property[]>();
  for (const p of all) {
    if (!byCat.has(p.category)) byCat.set(p.category, []);
    byCat.get(p.category)!.push(p);
  }
  const featured: Property[] = [];
  let round = 0;
  while (featured.length < limit && round < 6) {
    for (const list of byCat.values()) {
      if (list[round]) featured.push(list[round]);
      if (featured.length >= limit) break;
    }
    round++;
  }
  return featured;
}

/* --------------------------------- articles ---------------------------------- */

export async function getArticles(): Promise<Article[]> {
  if (isDemoMode()) return demoArticles;
  const db = createDataClient();
  const { data, error } = await db.from("articles").select("*").order("title");
  if (error) throw new Error(`articles: ${error.message}`);
  return (data as Article[]) ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

/** The 3 Explore experiences, in order, resolved to their article content. */
export async function getExperiences(): Promise<Article[]> {
  const articles = await getArticles();
  return EXPERIENCE_SLUGS.map((s) => articles.find((a) => a.slug === s)).filter(
    Boolean
  ) as Article[];
}

/* --------------------------------- enquiries --------------------------------- */

export type EnquiryInput = {
  propertyId: string | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  message: string;
};

function makeReference(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  return `BV-${time}${rand}`;
}

const demoEnquiries: Enquiry[] = [];

export async function createEnquiry(input: EnquiryInput): Promise<Enquiry> {
  let propertyName: string | undefined;
  if (input.propertyId) {
    const all = isDemoMode()
      ? demoProperties
      : (await getProperties()).concat();
    propertyName = all.find((p) => p.id === input.propertyId)?.name;
  }

  const base = {
    reference: makeReference(),
    property_id: input.propertyId,
    guest_name: input.guestName,
    guest_email: input.guestEmail,
    guest_phone: input.guestPhone,
    guest_country: input.guestCountry,
    check_in: input.checkIn,
    check_out: input.checkOut,
    guests: input.guests,
    message: input.message,
    status: "new" as const,
  };

  if (isDemoMode()) {
    const enquiry: Enquiry = {
      ...base,
      id: `demo-${base.reference}`,
      created_at: new Date().toISOString(),
      property_name: propertyName,
    };
    demoEnquiries.unshift(enquiry);
    return enquiry;
  }

  const db = createDataClient();
  const { data, error } = await db
    .from("enquiries")
    .insert(base)
    .select("*")
    .single();
  if (error) throw new Error(`enquiry: ${error.message}`);
  return { ...(data as Enquiry), property_name: propertyName };
}

export async function getEnquiryByReference(
  reference: string
): Promise<Enquiry | null> {
  if (isDemoMode())
    return demoEnquiries.find((e) => e.reference === reference) ?? null;
  const db = createDataClient();
  const { data } = await db
    .from("enquiries")
    .select("*, property:properties(name)")
    .eq("reference", reference)
    .maybeSingle();
  if (!data) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = data as any;
  return { ...row, property_name: row.property?.name };
}
