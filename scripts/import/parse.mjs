// Parses the scraped riphxan.com HTML into structured JSON.
// Usage: node scripts/import/parse.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const scrapeDir = join(root, "scrape");
const outDir = join(root, "data");
mkdirSync(outDir, { recursive: true });

// Verified against category page <h1> titles: cat1=Resorts, cat2=Liveaboards,
// cat3=City Hotels (renamed to Guesthouses on the new site).
const CATEGORY_OF = {
  resorts: [1, 3, 4, 5, 6, 8, 11],
  liveaboards: [12, 14, 15, 19, 25, 26, 27, 28],
  guesthouses: [7, 13, 16, 17, 18, 20, 21, 22, 23, 24, 29],
};
const categoryForId = (id) => {
  for (const [cat, ids] of Object.entries(CATEGORY_OF)) {
    if (ids.includes(id)) return cat;
  }
  return "resorts";
};

const LOCAL = (url) =>
  url
    ? url.replace(/^https?:\/\/riphxan\.com\/mua\/images\//i, "/import/")
    : "";

const txt = (s) =>
  s
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

// Convert an element's inner HTML with <br> into newline-separated text.
function brText($, el) {
  const html = $(el).html() ?? "";
  const out = cheerio.load(
    "<div>" + html.replace(/<br\s*\/?>/gi, "\n") + "</div>"
  );
  return txt(out("div").text());
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[''".,&/]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function parseProperty(id) {
  const file = join(scrapeDir, `property_${id}.html`);
  const $ = cheerio.load(readFileSync(file, "utf8"));

  const name = txt($("#main h1").first().text()) || `Property ${id}`;
  const atoll = txt($("#main h5").first().text());

  // Experience tags (Diving, Honeymoon, …)
  const tags = [];
  $("div.border.rounded-3").each((_, el) => {
    const t = txt($(el).text());
    if (t && t.length < 40 && !tags.includes(t)) tags.push(t);
  });

  // Description
  const description = brText($, $("p.mb-lg-5").first());

  // Facilities: the Facilities <h3> then check-circle items
  const facilities = [];
  const facHeader = $("#main h3")
    .filter((_, el) => txt($(el).text()).toLowerCase() === "facilities")
    .first();
  if (facHeader.length) {
    facHeader
      .closest(".col-12, .my-3, div")
      .find("i.fa-check-circle")
      .each((_, el) => {
        // text is the node right after the <i>
        const parent = $(el).parent();
        const t = txt(parent.text());
        if (t && !facilities.includes(t)) facilities.push(t);
      });
  }

  // Gallery images (cap to keep the repo lean)
  const gallery = [];
  $("a[data-lightbox] img, img.gallery_image").each((_, el) => {
    const src = $(el).attr("src");
    if (src) {
      const u = LOCAL(src);
      if (!gallery.includes(u)) gallery.push(u);
    }
  });
  const galleryCapped = gallery.slice(0, 10);

  // Accommodations + Dining: cards with an h4 + p, grouped by preceding h3.
  const sections = { accommodations: [], dining: [] };
  let current = null;
  $("#main h3, #main .card").each((_, el) => {
    const tag = el.tagName?.toLowerCase();
    if (tag === "h3") {
      const h = txt($(el).text()).toLowerCase();
      if (h.startsWith("accommodation")) current = "accommodations";
      else if (h.startsWith("dining")) current = "dining";
      else current = null;
      return;
    }
    if (!current) return;
    const h4 = $(el).find("h4").first();
    if (!h4.length) return;
    const img = $(el).find("img").first().attr("src");
    const p = $(el).find("p").first();
    sections[current].push({
      title: txt(h4.text()),
      description: p.length ? brText($, p) : "",
      image: LOCAL(img),
    });
  });

  // Price (first "$NNN" on the page, if any)
  const priceMatch = readFileSync(file, "utf8").match(/\$\s?(\d[\d,]{1,6})/);
  const from_price_usd = priceMatch
    ? Number(priceMatch[1].replace(/,/g, ""))
    : null;

  // Cover: property_image_<id> if present in page, else first gallery.
  const padded = String(id).padStart(3, "0");
  const coverCandidate = `/import/property/property_image_${padded}.jpg`;
  const cover = gallery[0] ?? coverCandidate;
  const galleryFinal = galleryCapped;

  return {
    legacy_id: id,
    name,
    slug: slugify(name),
    category: categoryForId(id),
    atoll,
    tags,
    description,
    short_description: description.split("\n").find((l) => l.trim().length > 30) ?? "",
    facilities,
    accommodations: sections.accommodations,
    dining: sections.dining,
    gallery: galleryFinal,
    cover,
    from_price_usd,
  };
}

function parseContent(id) {
  const file = join(scrapeDir, `content_${id}.html`);
  const $ = cheerio.load(readFileSync(file, "utf8"));
  const title =
    txt($("#main h1").first().text()) || txt($("#main h2").first().text());
  const paras = [];
  $("#main p").each((_, el) => {
    const t = brText($, el);
    if (t && t.length > 20) paras.push(t);
  });
  const images = [];
  $("#main img, #main a[data-lightbox]").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("href");
    if (src && /images\//i.test(src)) {
      const u = LOCAL(src);
      if (!images.includes(u)) images.push(u);
    }
  });
  return {
    legacy_id: id,
    title,
    slug: slugify(title || `article-${id}`),
    body: paras.join("\n\n"),
    images: images.slice(0, 6),
  };
}

const allIds = Object.values(CATEGORY_OF).flat().sort((a, b) => a - b);
const properties = allIds.map(parseProperty);
const articles = [1, 2, 3, 4, 5].map(parseContent);

const categories = [
  {
    slug: "resorts",
    name: "Resorts",
    image: "/import/category/category_image_001.jpg",
    tagline: "Private-island luxury — one island, one resort.",
  },
  {
    slug: "liveaboards",
    name: "Liveaboards",
    image: "/import/category/category_image_002.jpeg",
    tagline: "Sail the atolls — dive, surf and explore aboard.",
  },
  {
    slug: "guesthouses",
    name: "Guesthouses",
    image: "/import/category/category_image_003.png",
    tagline: "Stay local — guesthouses and hotels on inhabited islands.",
  },
];

const banners = [
  "/import/banner/banner_image_003.jpg",
  "/import/banner/banner_image_004.jpg",
  "/import/banner/banner_image_005.jpg",
];

writeFileSync(
  join(outDir, "import.json"),
  JSON.stringify({ categories, banners, properties, articles }, null, 2)
);

// Build the download list = only the images the new site references.
const used = new Set();
const add = (p) => {
  if (p && p.startsWith("/import/")) used.add(p);
};
for (const c of categories) add(c.image);
banners.forEach(add);
for (const p of properties) {
  add(p.cover);
  p.gallery.forEach(add);
  p.accommodations.forEach((a) => add(a.image));
  p.dining.forEach((d) => add(d.image));
}
for (const a of articles) a.images.forEach(add);
add("/import/about/about_image_001.jpg");
add("/import/logo.png");

const urls = [...used]
  .map((p) => "http://riphxan.com/mua/images/" + p.replace(/^\/import\//, ""))
  .sort();
writeFileSync(join(outDir, "image-urls.txt"), urls.join("\n"));

const counts = {
  properties: properties.length,
  withDescription: properties.filter((p) => p.description.length > 40).length,
  withAccommodations: properties.filter((p) => p.accommodations.length).length,
  withDining: properties.filter((p) => p.dining.length).length,
  withGallery: properties.filter((p) => p.gallery.length).length,
  withFacilities: properties.filter((p) => p.facilities.length).length,
  withPrice: properties.filter((p) => p.from_price_usd).length,
  articles: articles.length,
  imagesToDownload: used.size,
};
console.log(JSON.stringify(counts, null, 2));
console.log(
  "\nSample:",
  properties[0].name,
  "|",
  properties[0].category,
  "|",
  properties[0].atoll,
  "| acc:",
  properties[0].accommodations.length,
  "| dining:",
  properties[0].dining.length,
  "| gallery:",
  properties[0].gallery.length,
  "| facil:",
  properties[0].facilities.length
);
