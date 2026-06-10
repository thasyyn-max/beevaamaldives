import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/data";

export const metadata: Metadata = { title: "Maldives Guide" };

export default async function GuidePage() {
  const articles = await getArticles();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-medium">Maldives Guide</h1>
      <p className="mt-2 max-w-xl text-muted">
        Everything you need to plan the trip — islands, seasons, diving and surf.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link key={a.id} href={`/guide/${a.slug}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.images[0] ?? "/import/about/about_image_001.jpg"}
                alt={a.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <h2 className="mt-3 font-display text-xl font-medium group-hover:text-brand">
              {a.title}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted">{a.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
