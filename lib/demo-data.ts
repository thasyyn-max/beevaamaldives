// Bundled real Beevaa Maldives content (imported from the existing site).
// Used when Supabase is not configured. Regenerate with scripts/import/parse.mjs.
import importData from "@/data/import.json";
import type { Article, Category, Property } from "./types";

type RawProperty = (typeof importData)["properties"][number];

export const demoCategories: Category[] = importData.categories;

export const demoBanners: string[] = importData.banners;

export const demoProperties: Property[] = (
  importData.properties as RawProperty[]
).map((p) => ({
  id: `prop-${p.legacy_id}`,
  legacy_id: p.legacy_id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  atoll: p.atoll || "Maldives",
  tags: p.tags ?? [],
  description: p.description ?? "",
  short_description: p.short_description ?? "",
  facilities: p.facilities ?? [],
  accommodations: p.accommodations ?? [],
  dining: p.dining ?? [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  experiences: ((p as any).experiences as string[]) ?? [],
  gallery: p.gallery?.length ? p.gallery : [p.cover],
  cover: p.cover,
  from_price_usd: p.from_price_usd ?? null,
  status: "live",
}));

type RawArticle = (typeof importData)["articles"][number];

export const demoArticles: Article[] = (
  importData.articles as RawArticle[]
).map((a, i) => ({
  id: `art-${i + 1}`,
  slug: a.slug,
  title: a.title,
  body: a.body,
  images: (a.images as string[]) ?? [],
}));
