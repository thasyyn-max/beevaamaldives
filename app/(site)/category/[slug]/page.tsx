import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyCard } from "@/components/PropertyCard";
import { getCategories, getCategoryBySlug, getProperties } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const cat = await getCategoryBySlug((await params).slug);
  return { title: cat ? cat.name : "Stays" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; maxPrice?: string }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const [allCategories, properties] = await Promise.all([
    getCategories(),
    getProperties({
      category: slug,
      sort: sp.sort === "price" ? "price" : "name",
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    }),
  ]);

  return (
    <div>
      {/* Header band */}
      <section className="relative h-56 w-full overflow-hidden sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={category.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4 text-white sm:px-6">
            <h1 className="font-display text-4xl font-medium sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-2 max-w-xl text-white/85">{category.tagline}</p>
          </div>
        </div>
      </section>

      {/* Category switch + sort */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {allCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  c.slug === slug
                    ? "bg-ink text-white"
                    : "border border-line text-muted hover:text-ink"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">{properties.length} stays</span>
            <Link
              href={`/category/${slug}?sort=name`}
              className={`rounded-full border px-3 py-1.5 ${
                sp.sort !== "price" ? "border-brand text-brand" : "border-line text-muted"
              }`}
            >
              A–Z
            </Link>
            <Link
              href={`/category/${slug}?sort=price`}
              className={`rounded-full border px-3 py-1.5 ${
                sp.sort === "price" ? "border-brand text-brand" : "border-line text-muted"
              }`}
            >
              Price
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        {properties.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-12 text-center text-muted">
            No stays in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
