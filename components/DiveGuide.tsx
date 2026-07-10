import Link from "next/link";
import {
  ATTRACTIONS,
  ATTRACTIONS_INTRO,
  DIVE_HERO,
  DIVE_OUTRO,
  DIVE_SITES,
  DIVE_STATS,
} from "@/lib/dive-data";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
      {children}
    </p>
  );
}

export function DiveGuide() {
  return (
    <div className="pb-4">
      {/* ------------------------------------------------ hero */}
      <header className="relative">
        <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DIVE_HERO.image}
            alt="Diving in the Maldives"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/20" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                {DIVE_HERO.eyebrow}
              </p>
              <h1 className="mt-2 font-display text-4xl font-medium text-white sm:text-5xl">
                {DIVE_HERO.title}
              </h1>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
          <p className="text-lg leading-relaxed text-muted">{DIVE_HERO.intro}</p>
        </div>

        {/* stat strip */}
        <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DIVE_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-surface px-4 py-5 text-center"
              >
                <dt className="font-display text-3xl font-medium text-ink">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ------------------------------------------------ dive sites */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <SectionLabel>Dive Sites</SectionLabel>
        <h2 className="mt-2 font-display text-3xl font-medium">
          The best dive sites, atoll by atoll
        </h2>
        <p className="mt-3 max-w-3xl text-muted">
          Shark channels, coral thilas, walls and gentle house reefs across the
          atolls — from beginner-friendly gardens to advanced current dives.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIVE_SITES.map((site) => (
            <div
              key={site.name}
              className="flex flex-col rounded-2xl border border-line p-5 transition hover:border-brand"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-medium text-ink">
                  {site.name}
                </h3>
                {site.location && (
                  <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand">
                    {site.location}
                  </span>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {site.description}
              </p>

              {(site.types?.length || site.entry) && (
                <div className="mt-4 border-t border-line pt-3">
                  {site.types && site.types.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {site.types.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {site.entry && (
                    <p className="mt-2 text-xs font-medium text-ink/70">
                      Entry: <span className="text-brand">{site.entry}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ unesco attractions */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <SectionLabel>UNESCO Biosphere Reserves</SectionLabel>
        <h2 className="mt-2 font-display text-3xl font-medium">
          Protected waters worth the trip
        </h2>
        <p className="mt-3 max-w-3xl text-muted">{ATTRACTIONS_INTRO}</p>

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

      {/* ------------------------------------------------ outro / cta */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <div className="rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12">
          <p className="mx-auto max-w-2xl font-display text-2xl font-medium">
            {DIVE_OUTRO.lead}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">{DIVE_OUTRO.body}</p>
          <Link
            href="/enquire"
            className="mt-8 inline-block rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-ink"
          >
            Plan my dive trip
          </Link>
        </div>
      </section>
    </div>
  );
}
