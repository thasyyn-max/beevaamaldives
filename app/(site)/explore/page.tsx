import type { Metadata } from "next";
import Link from "next/link";
import { getArticles, getExperiences } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore the Maldives",
  description:
    "Shipwrecks, surfing points and diving points across the atolls — explore the Maldives beyond the beach.",
};

// Fallback imagery if an experience has no photo set in the admin yet.
const FALLBACK: Record<string, string> = {
  shipwreck: "/import/banner/banner_image_004.jpg",
  "surfing-spots": "/import/banner/banner_image_003.jpg",
  "diving-spots": "/import/banner/banner_image_005.jpg",
};

function blurb(body: string): string {
  return body.split("\n").find((l) => l.trim().length > 20) ?? "";
}

export default async function ExplorePage() {
  const [experiences, allArticles] = await Promise.all([
    getExperiences(),
    getArticles(),
  ]);
  const expSlugs = new Set(experiences.map((e) => e.slug));
  const more = allArticles.filter((a) => !expSlugs.has(a.slug));

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
        {experiences.map((e) => (
          <Link key={e.slug} href={`/guide/${e.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={e.images[0] ?? FALLBACK[e.slug] ?? "/import/about/about_image_001.jpg"}
                alt={e.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h2 className="font-display text-2xl font-medium text-white">
                  {e.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-white/85">
                  {blurb(e.body)}
                </p>
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
          <h2 className="mt-14 font-display text-2xl font-medium">Plan smarter</h2>
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
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{a.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
