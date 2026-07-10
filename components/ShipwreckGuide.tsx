import Link from "next/link";
import {
  SHIPWRECK_HERO,
  SHIPWRECK_OUTRO,
  WRECKS,
  WRECKS_INTRO,
} from "@/lib/dive-data";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
      {children}
    </p>
  );
}

export function ShipwreckGuide() {
  return (
    <div className="pb-4">
      {/* ------------------------------------------------ hero */}
      <header className="relative">
        <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SHIPWRECK_HERO.image}
            alt="Shipwreck diving in the Maldives"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/20" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                {SHIPWRECK_HERO.eyebrow}
              </p>
              <h1 className="mt-2 font-display text-4xl font-medium text-white sm:text-5xl">
                {SHIPWRECK_HERO.title}
              </h1>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
          <p className="text-lg leading-relaxed text-muted">
            {SHIPWRECK_HERO.intro}
          </p>
        </div>
      </header>

      {/* ------------------------------------------------ wrecks */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <SectionLabel>Wrecks &amp; Wonders</SectionLabel>
        <h2 className="mt-2 font-display text-3xl font-medium">
          Wrecks to dive, atoll by atoll
        </h2>
        <p className="mt-3 max-w-3xl text-muted">{WRECKS_INTRO}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ------------------------------------------------ outro / cta */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <div className="rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12">
          <p className="mx-auto max-w-2xl font-display text-2xl font-medium">
            {SHIPWRECK_OUTRO.lead}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            {SHIPWRECK_OUTRO.body}
          </p>
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
