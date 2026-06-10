import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuesthouseCard } from "@/components/GuesthouseCard";
import { getGuesthouses, getIslandBySlug } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const island = await getIslandBySlug((await params).slug);
  return { title: island ? `${island.name} guesthouses` : "Island" };
}

export default async function IslandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const island = await getIslandBySlug(slug);
  if (!island) notFound();
  const guesthouses = await getGuesthouses({ island: slug });

  return (
    <div>
      <section className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={island.hero_url}
          alt={island.name}
          className="h-48 w-full object-cover sm:h-64"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 w-full">
          <div className="mx-auto max-w-6xl px-4 pb-4 text-white">
            <h1 className="text-2xl font-extrabold sm:text-4xl">{island.name}</h1>
            <p className="text-sm text-white/90">{island.atoll}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <p className="max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base">
          {island.description}
        </p>
        {island.transfer_info && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-900">
            🛥️ Getting there: {island.transfer_info}
          </p>
        )}

        <h2 className="mt-8 text-lg font-bold text-slate-900 sm:text-xl">
          Guesthouses on {island.name}{" "}
          <span className="font-normal text-slate-500">
            ({guesthouses.length})
          </span>
        </h2>
        <div className="mt-4 grid gap-4">
          {guesthouses.map((g) => (
            <GuesthouseCard key={g.id} guesthouse={g} />
          ))}
          {guesthouses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No live guesthouses on this island yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
