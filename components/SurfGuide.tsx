import Link from "next/link";
import {
  GOOD_TO_KNOW,
  SEASON_DETAILS,
  SEASON_INTRO,
  SEASON_TABLE,
  SURF_HERO,
  SURF_OUTRO,
  SURF_REGIONS,
  TRAVEL_FACTS,
  WAVE_CHART,
} from "@/lib/surf-data";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
      {children}
    </p>
  );
}

export function SurfGuide() {
  return (
    <div className="pb-4">
      {/* ------------------------------------------------ hero */}
      <header className="relative">
        <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SURF_HERO.image}
            alt="Surfing in the Maldives"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/20" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                {SURF_HERO.eyebrow}
              </p>
              <h1 className="mt-2 font-display text-4xl font-medium text-white sm:text-5xl">
                {SURF_HERO.title}
              </h1>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
          <p className="text-lg leading-relaxed text-muted">{SURF_HERO.intro}</p>
        </div>
      </header>

      {/* ------------------------------------------------ season */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <SectionLabel>Surf Season</SectionLabel>
        <h2 className="mt-2 font-display text-3xl font-medium">
          {SEASON_INTRO.question}
        </h2>
        <p className="mt-3 max-w-3xl text-muted">{SEASON_INTRO.answer}</p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="bg-surface text-sm uppercase tracking-wide text-ink">
                <th className="px-5 py-3 font-semibold">Season</th>
                <th className="px-5 py-3 font-semibold">Best Time</th>
                <th className="px-5 py-3 font-semibold">
                  Swell Consistency &amp; Conditions
                </th>
              </tr>
            </thead>
            <tbody>
              {SEASON_TABLE.map((row) => (
                <tr key={row.season} className="border-t border-line align-top">
                  <td className="px-5 py-4 font-display text-lg font-medium text-ink">
                    {row.season}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-brand">
                    {row.when}
                  </td>
                  <td className="px-5 py-4 text-muted">{row.conditions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {SEASON_DETAILS.map((d) => (
            <div
              key={d.heading}
              className="rounded-2xl border border-line p-6"
            >
              <h3 className="font-display text-xl font-medium text-ink">
                {d.heading}
              </h3>
              {d.body.map((p, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ regions */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <SectionLabel>Surf Regions</SectionLabel>
        <h2 className="mt-2 font-display text-3xl font-medium">
          Where to surf, atoll by atoll
        </h2>
        <p className="mt-3 max-w-3xl text-muted">
          Four distinct regions, from the busy, world-class reef passes of the
          Malé Atolls to remote, uncrowded lineups in the far south and north.
          Explore the breaks below and we&apos;ll build the trip around them.
        </p>

        <div className="mt-10 space-y-16">
          {SURF_REGIONS.map((region) => (
            <div
              key={region.key}
              className="scroll-mt-24 border-t border-line pt-10 first:border-t-0 first:pt-0"
              id={region.key}
            >
              <h3 className="font-display text-2xl font-medium text-ink">
                {region.name}
              </h3>
              <p className="mt-3 max-w-3xl text-muted">{region.intro}</p>

              {region.spotMap && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={region.spotMap}
                    alt={`${region.name} surf break map`}
                    loading="lazy"
                    className="mx-auto w-full max-w-2xl object-contain p-4"
                  />
                </div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {region.spots.map((spot) => (
                  <div
                    key={spot.name}
                    className="flex flex-col rounded-2xl border border-line p-5 transition hover:border-brand"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-display text-lg font-medium text-ink">
                        {spot.name}
                      </h4>
                      {spot.location && (
                        <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand">
                          {spot.location}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {spot.description}
                    </p>
                  </div>
                ))}
              </div>

              {region.routeMap && (
                <div className="mt-6 grid items-center gap-5 rounded-2xl bg-surface p-5 sm:grid-cols-[1.2fr_1fr]">
                  <div className="overflow-hidden rounded-xl bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={region.routeMap}
                      alt={`${region.name} travel route map`}
                      loading="lazy"
                      className="mx-auto w-full max-w-md object-contain p-3"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                      Getting there
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {region.routeNote}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ wave chart */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <SectionLabel>Reading the Forecast</SectionLabel>
        <h2 className="mt-2 font-display text-3xl font-medium">
          How to read a surf chart
        </h2>
        <p className="mt-3 max-w-3xl text-muted">{WAVE_CHART.intro}</p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={WAVE_CHART.image}
            alt="Surf forecast chart legend"
            loading="lazy"
            className="w-full object-contain"
          />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WAVE_CHART.legend.map((item) => (
            <div key={item.label} className="rounded-2xl border border-line p-5">
              <dt className="font-display text-base font-medium text-ink">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------ good to know */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <SectionLabel>Good to Know</SectionLabel>
        <h2 className="mt-2 font-display text-3xl font-medium">
          Planning your trip
        </h2>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TRAVEL_FACTS.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl bg-surface px-4 py-5 text-center"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                {f.label}
              </dt>
              <dd className="mt-1 font-display text-lg font-medium text-ink">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {GOOD_TO_KNOW.map((g) => (
            <div key={g.heading}>
              <h3 className="font-display text-lg font-medium text-ink">
                {g.heading}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ outro / cta */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <div className="rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12">
          <p className="mx-auto max-w-2xl font-display text-2xl font-medium">
            {SURF_OUTRO.lead}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            {SURF_OUTRO.body}
          </p>
          <Link
            href="/enquire"
            className="mt-8 inline-block rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-ink"
          >
            Plan my surf trip
          </Link>
        </div>
      </section>
    </div>
  );
}
