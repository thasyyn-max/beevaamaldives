"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Island } from "@/lib/types";

export function SearchBar({
  islands,
  compact = false,
}: {
  islands: Island[];
  compact?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [island, setIsland] = useState(params.get("island") ?? "");
  const [checkIn, setCheckIn] = useState(params.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(params.get("checkOut") ?? "");
  const [guests, setGuests] = useState(params.get("guests") ?? "2");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (island) q.set("island", island);
    if (checkIn) q.set("checkIn", checkIn);
    if (checkOut) q.set("checkOut", checkOut);
    if (guests) q.set("guests", guests);
    router.push(`/search?${q.toString()}`);
  }

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";
  const label = "mb-1 block text-xs font-semibold text-slate-600";

  return (
    <form
      onSubmit={submit}
      className={`grid gap-3 rounded-2xl border border-amber-300/70 bg-white p-3 shadow-lg sm:grid-cols-2 ${
        compact ? "lg:grid-cols-5" : "lg:grid-cols-5 lg:p-4"
      }`}
    >
      <div>
        <label className={label} htmlFor="island">Island</label>
        <select
          id="island"
          value={island}
          onChange={(e) => setIsland(e.target.value)}
          className={field}
        >
          <option value="">All islands</option>
          {islands.map((i) => (
            <option key={i.id} value={i.slug}>
              {i.name} · {i.atoll}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="checkIn">Check-in</label>
        <input
          id="checkIn"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className={field}
        />
      </div>
      <div>
        <label className={label} htmlFor="checkOut">Check-out</label>
        <input
          id="checkOut"
          type="date"
          value={checkOut}
          min={checkIn || undefined}
          onChange={(e) => setCheckOut(e.target.value)}
          className={field}
        />
      </div>
      <div>
        <label className={label} htmlFor="guests">Guests</label>
        <select
          id="guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className={field}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} guest{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="self-end rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700 sm:col-span-2 lg:col-span-1"
      >
        Search stays
      </button>
    </form>
  );
}
