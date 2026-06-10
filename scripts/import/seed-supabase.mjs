// Pushes data/import.json into Supabase. Requires env vars:
//   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Usage: node --env-file=.env.local scripts/import/seed-supabase.mjs
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const data = JSON.parse(readFileSync(join(root, "data", "import.json"), "utf8"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/import/seed-supabase.mjs"
  );
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  // Categories (also seeded by schema.sql; upsert keeps them in sync)
  const cats = data.categories.map((c, i) => ({ ...c, sort_order: i + 1 }));
  let r = await db.from("categories").upsert(cats, { onConflict: "slug" });
  if (r.error) throw r.error;
  console.log(`categories: ${cats.length}`);

  // Properties
  const props = data.properties.map((p) => ({
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
    gallery: p.gallery ?? [],
    cover: p.cover ?? "",
    from_price_usd: p.from_price_usd,
    status: "live",
  }));
  r = await db.from("properties").upsert(props, { onConflict: "slug" });
  if (r.error) throw r.error;
  console.log(`properties: ${props.length}`);

  // Articles
  const articles = data.articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    body: a.body,
    images: a.images ?? [],
  }));
  r = await db.from("articles").upsert(articles, { onConflict: "slug" });
  if (r.error) throw r.error;
  console.log(`articles: ${articles.length}`);

  console.log("\nDone. Set a property to draft to hide it; edit anything in /admin.");
}
main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
