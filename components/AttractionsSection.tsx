import { ATTRACTIONS, ATTRACTIONS_INTRO } from "@/lib/dive-data";

/**
 * The "UNESCO Biosphere Reserves" section — a labelled heading, intro line and
 * a grid of protected-atoll cards. Rendered on the Shipwreck experience page.
 */
export function AttractionsSection() {
  return (
    <section className="mt-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
        UNESCO Biosphere Reserves
      </p>
      <h2 className="mt-2 font-display text-3xl font-medium">
        Protected waters worth the trip
      </h2>
      <p className="mt-3 text-muted">{ATTRACTIONS_INTRO}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {ATTRACTIONS.map((a) => (
          <div key={a.name} className="rounded-2xl bg-surface p-6">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-xl font-medium text-ink">
                {a.name}
              </h3>
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand">
              {a.since}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
