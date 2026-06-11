import Link from "next/link";
import { PropertyCard } from "@/components/PropertyCard";
import {
  getArticles,
  getBanners,
  getCategories,
  getFeaturedProperties,
} from "@/lib/data";

export default async function HomePage() {
  const [banners, categories, featured, articles] = await Promise.all([
    getBanners(),
    getCategories(),
    getFeaturedProperties(6),
    getArticles(),
  ]);
  const hero = banners[0] ?? "/import/banner/banner_image_003.jpg";

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[460px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
              <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                Your journey to tropical paradise
              </p>
              <h1 className="animate-fade-up mt-3 max-w-2xl font-display text-4xl font-medium leading-[1.05] text-white sm:text-6xl">
                Find your perfect island.
              </h1>
              <p className="animate-fade-up mt-4 max-w-xl text-base text-white/85">
                Hand-picked resorts, safari boats and guesthouses —
                booked with a local team who knows every atoll.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium sm:text-3xl">
              Three ways to stay
            </h2>
            <p className="mt-1 text-muted">From private islands to safari boats.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl sm:aspect-[4/5]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <h3 className="font-display text-2xl font-medium">{c.name}</h3>
                <p className="mt-1 text-sm text-white/80">{c.tagline}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-white">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured properties */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-medium sm:text-3xl">
            Featured stays
          </h2>
          <Link
            href="/category/resorts"
            className="text-sm font-semibold text-brand hover:text-brand-ink"
          >
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 rounded-3xl bg-surface p-8 sm:grid-cols-3 sm:p-12">
          {[
            { t: "Local expertise", b: "Based in the Maldives — we know the islands, transfers and seasons first-hand." },
            { t: "Best-value rates", b: "Direct relationships with resorts, safari boats and guesthouses across the atolls." },
            { t: "One team, end to end", b: "From your first question to your seaplane transfer, one team handles it all." },
          ].map((f) => (
            <div key={f.t}>
              <div className="font-display text-xl font-medium text-ink">{f.t}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guide teaser */}
      {articles.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-medium sm:text-3xl">
              Maldives guide
            </h2>
            <Link href="/guide" className="text-sm font-semibold text-brand hover:text-brand-ink">
              All articles →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {articles.slice(0, 4).map((a) => (
              <Link key={a.id} href={`/guide/${a.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.images[0] ?? "/import/about/about_image_001.jpg"}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 font-display text-lg font-medium group-hover:text-brand">
                  {a.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center text-white sm:px-12">
          <h2 className="font-display text-3xl font-medium sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/80">
            Tell us your dates and what you love — we&apos;ll design a Maldives
            trip around you, with a quote in 24 hours.
          </p>
          <Link
            href="/enquire"
            className="mt-7 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-ink transition hover:bg-brand hover:text-white"
          >
            Start your enquiry
          </Link>
        </div>
      </section>
    </div>
  );
}
