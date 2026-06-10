import type { Metadata } from "next";
import { Suspense } from "react";
import { GuesthouseCard } from "@/components/GuesthouseCard";
import { SearchBar } from "@/components/SearchBar";
import { getGuesthouses, getIslands } from "@/lib/data";

export const metadata: Metadata = { title: "Search stays" };

type Params = {
  island?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  maxPrice?: string;
  sort?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const [islands, results] = await Promise.all([
    getIslands(),
    getGuesthouses({
      island: params.island || undefined,
      guests: params.guests ? Number(params.guests) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      sort: params.sort === "price" ? "price" : "rating",
    }),
  ]);

  const carried = new URLSearchParams();
  if (params.checkIn) carried.set("checkIn", params.checkIn);
  if (params.checkOut) carried.set("checkOut", params.checkOut);
  if (params.guests) carried.set("guests", params.guests);
  const carriedQuery = carried.toString();

  function linkWith(overrides: Record<string, string | undefined>) {
    const q = new URLSearchParams();
    const merged: Record<string, string | undefined> = { ...params, ...overrides };
    for (const [k, v] of Object.entries(merged)) if (v) q.set(k, v);
    return `/search?${q.toString()}`;
  }

  const islandName = params.island
    ? islands.find((i) => i.slug === params.island)?.name
    : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Suspense>
        <SearchBar islands={islands} compact />
      </Suspense>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
          {islandName ? `Stays on ${islandName}` : "All guesthouses"}{" "}
          <span className="font-normal text-slate-500">
            ({results.length} found)
          </span>
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="text-slate-500">Max price:</span>
          {[undefined, "50", "70", "100"].map((p) => (
            <a
              key={p ?? "any"}
              href={linkWith({ maxPrice: p })}
              className={`rounded-full border px-3 py-1 ${
                (params.maxPrice ?? undefined) === p
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-300 text-slate-700 hover:border-teal-500"
              }`}
            >
              {p ? `$${p}` : "Any"}
            </a>
          ))}
          <span className="ml-2 text-slate-500">Sort:</span>
          {[
            { key: undefined, label: "Top rated" },
            { key: "price", label: "Lowest price" },
          ].map((s) => (
            <a
              key={s.label}
              href={linkWith({ sort: s.key })}
              className={`rounded-full border px-3 py-1 ${
                (params.sort ?? undefined) === s.key
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-300 text-slate-700 hover:border-teal-500"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        {results.map((g) => (
          <GuesthouseCard key={g.id} guesthouse={g} query={carriedQuery} />
        ))}
        {results.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No guesthouses match those filters yet — try removing the price
            filter or choosing another island.
          </div>
        )}
      </div>
    </div>
  );
}
