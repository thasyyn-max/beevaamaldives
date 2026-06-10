import Link from "next/link";
import { Suspense } from "react";
import { GuesthouseCard } from "@/components/GuesthouseCard";
import { SearchBar } from "@/components/SearchBar";
import { getGuesthouses, getIslands } from "@/lib/data";

export default async function HomePage() {
  const [islands, guesthouses] = await Promise.all([
    getIslands(),
    getGuesthouses({ sort: "rating" }),
  ]);
  const featured = guesthouses.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-700 via-teal-600 to-cyan-500 pb-20 pt-10 text-white sm:pt-16">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
            The Maldives, the local way
          </h1>
          <p className="mt-3 max-w-xl text-sm text-teal-50 sm:text-base">
            Stay in family-run guesthouses on real inhabited islands — whale
            sharks, sandbanks and bikini beaches at a fraction of resort
            prices.
          </p>
        </div>
      </section>

      {/* Search card overlapping the hero, booking.com style */}
      <div className="mx-auto -mt-12 max-w-6xl px-4">
        <Suspense>
          <SearchBar islands={islands} />
        </Suspense>
      </div>

      {/* Islands */}
      <section id="islands" className="mx-auto mt-14 max-w-6xl scroll-mt-20 px-4">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Explore local islands
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Each island has its own personality — pick yours.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {islands.map((island) => (
            <Link
              key={island.id}
              href={`/islands/${island.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={island.hero_url}
                alt={island.name}
                className="h-24 w-full object-cover sm:h-28"
                loading="lazy"
              />
              <div className="p-3">
                <div className="font-bold text-slate-900 group-hover:text-teal-700">
                  {island.name}
                </div>
                <div className="text-xs text-slate-500">{island.atoll}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured guesthouses */}
      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Top-rated guesthouses
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Loved by travellers, run by locals.
            </p>
          </div>
          <Link
            href="/search"
            className="text-sm font-semibold text-teal-700 hover:underline"
          >
            See all →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {featured.map((g) => (
            <GuesthouseCard key={g.id} guesthouse={g} />
          ))}
        </div>
      </section>

      {/* Why book local */}
      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="grid gap-4 rounded-2xl bg-slate-50 p-6 sm:grid-cols-3">
          {[
            {
              title: "Pay a fraction of resort prices",
              body: "Beautiful rooms from ~$40/night, steps from the same turquoise water.",
            },
            {
              title: "Real island life",
              body: "Local cafés, fishing harbours, island schools — experience the Maldives Maldivians live in.",
            },
            {
              title: "No prepayment needed",
              body: "Request your dates, the guesthouse confirms within 24h. Pay on arrival or by transfer.",
            },
          ].map((f) => (
            <div key={f.title}>
              <div className="font-bold text-slate-900">{f.title}</div>
              <p className="mt-1 text-sm text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
