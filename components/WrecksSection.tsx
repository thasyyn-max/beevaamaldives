import { WRECKS, WRECKS_INTRO } from "@/lib/dive-data";

/**
 * The "Historic shipwrecks" section — a labelled heading, intro line and a
 * grid of wreck cards. Rendered on the Shipwreck experience page.
 */
export function WrecksSection() {
  return (
    <section className="mt-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
        Wrecks &amp; Wonders
      </p>
      <h2 className="mt-2 font-display text-3xl font-medium">
        Historic shipwrecks
      </h2>
      <p className="mt-3 text-muted">{WRECKS_INTRO}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {WRECKS.map((wreck) => (
          <div
            key={wreck.name}
            className="flex flex-col rounded-2xl border border-line p-5 transition hover:border-brand"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-medium text-ink">
                {wreck.name}
              </h3>
              {wreck.location && (
                <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand">
                  {wreck.location}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {wreck.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
