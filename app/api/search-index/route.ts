import { NextResponse } from "next/server";
import { getArticles, getProperties } from "@/lib/data";

// Lightweight index for the instant-search overlay.
export const revalidate = 300;

export async function GET() {
  const [properties, articles] = await Promise.all([
    getProperties(),
    getArticles(),
  ]);
  return NextResponse.json({
    properties: properties.map((p) => ({
      name: p.name,
      slug: p.slug,
      category: p.category,
      atoll: p.atoll,
      tags: p.tags,
      cover: p.cover,
      price: p.from_price_usd,
    })),
    articles: articles.map((a) => ({ title: a.title, slug: a.slug })),
  });
}
