import Link from "next/link";
import { PropertyCard } from "@/components/PropertyCard";
import { getBanners, getCategories, getFeaturedProperties } from "@/lib/data";

export default async function HomePage() {
  const [banners, categories, featured] = await Promise.all([
    getBanners(),
    getCategories(),
    getFeaturedProperties(6),
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
        {/* Mobile: swipeable rail with next-card peek; desktop: 3-col grid */}
        <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group relative aspect-[3/4] w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl sm:aspect-[4/5] sm:w-auto"
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
        {/* Mobile: swipeable rail with next-card peek; desktop: grid */}
        <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {featured.map((p) => (
            <div key={p.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
