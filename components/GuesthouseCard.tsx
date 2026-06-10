import Link from "next/link";
import type { Guesthouse } from "@/lib/types";
import { RatingBadge } from "./RatingBadge";

export function GuesthouseCard({
  guesthouse,
  query,
}: {
  guesthouse: Guesthouse;
  query?: string; // search params to carry into the detail page
}) {
  const g = guesthouse;
  const href = `/stay/${g.slug}${query ? `?${query}` : ""}`;
  const cover = g.photos[0]?.url ?? "/demo/beach-1.svg";

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:flex-row"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cover}
        alt={g.photos[0]?.alt ?? g.name}
        className="h-48 w-full object-cover sm:h-auto sm:w-56 sm:shrink-0"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-700">
              {g.name}
            </h3>
            <p className="text-xs font-medium text-teal-700">
              {g.island?.name} · {g.island?.atoll}
            </p>
          </div>
          <RatingBadge rating={g.rating} />
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">{g.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {g.amenities.slice(0, 4).map((a) => (
            <span
              key={a}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {a}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="text-xs text-slate-500">
            {g.rooms.length} room type{g.rooms.length === 1 ? "" : "s"}
          </span>
          {g.min_price_usd !== undefined && (
            <span className="text-right">
              <span className="text-xs text-slate-500">from </span>
              <span className="text-lg font-extrabold text-slate-900">
                ${g.min_price_usd}
              </span>
              <span className="text-xs text-slate-500"> / night</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
