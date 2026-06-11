import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore the Maldives",
  description:
    "Shipwrecks, surfing points and diving points across the atolls — explore the Maldives beyond the beach.",
};

// The three featured experiences (imported guide articles), with imagery.
const FEATURED = [
  {
    slug: "shipwreck",
    title: "Shipwrecks",
    blurb: "Sunken stories — wreck dives and snorkel sites across the atolls.",
    image: "/import/banner/banner_image_004.jpg",
  },
  {
    slug: "surfing-spots",
    title: "Surfing Points",
    blurb: "From Chickens to Cokes — the breaks every surfer should know.",
    image: "/import/banner/banner_image_003.jpg",
  },
  {
    slug: "diving-spots",
    title: "Diving Points",
    blurb: "Mantas, whale sharks and channels teeming with life.",
    image: "/import/banner/banner_image_005.jpg",
  },
];

export default async function ExplorePage() {
  const articles = await getArticles();
  const featuredSlugs = new Set(FEATURED.map((f) => f.slug));
  const more = articles.filter((a) => !featuredSlugs.has(a.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
        Explore
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium">
        The Maldives beyond the beach
      </h1>
      <p className="mt-2 max-w-xl text-muted">
        Shipwrecks to dive, waves to chase and reefs to remember — pick your
        adventure and we&apos;ll build the trip around it.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {FEATURED.map((f) => (
          <Link key={f.slug} href={`/guide/${f.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.image}
                alt={f.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h2 className="font-display text-2xl font-medium text-white">
                  {f.title}
                </h2>
                <p className="mt-1 text-sm text-white/85">{f.blurb}</p>
                <span className="mt-3 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur transition group-hover:bg-brand">
                  Discover →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {more.length > 0 && (
        <>
          <h2 className="mt-14 font-display text-2xl font-medium">
            Plan smarter
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {more.map((a) => (
              <Link
                key={a.id}
                href={`/guide/${a.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition hover:border-brand"
              >
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-medium group-hover:text-brand">
                    {a.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {a.body}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
