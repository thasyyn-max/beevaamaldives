import Link from "next/link";
import type { Property } from "@/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  resorts: "Resort",
  safari: "Safari",
  guesthouses: "Guesthouse",
};

export function PropertyCard({ property }: { property: Property }) {
  const p = property;
  return (
    <Link href={`/property/${p.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.cover}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink backdrop-blur">
          {CATEGORY_LABEL[p.category] ?? p.category}
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-medium text-ink group-hover:text-brand">
            {p.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted">{p.atoll}</p>
        </div>
        {p.from_price_usd ? (
          <div className="shrink-0 text-right">
            <div className="text-[11px] text-muted">from</div>
            <div className="font-semibold text-ink">${p.from_price_usd}</div>
          </div>
        ) : null}
      </div>
      {p.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {p.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
