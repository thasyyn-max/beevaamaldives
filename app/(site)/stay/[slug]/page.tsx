import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/PhotoGallery";
import { RatingBadge } from "@/components/RatingBadge";
import { getGuesthouseBySlug } from "@/lib/data";
import { nightsBetween } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const gh = await getGuesthouseBySlug((await params).slug);
  return { title: gh ? gh.name : "Guesthouse" };
}

type Query = { checkIn?: string; checkOut?: string; guests?: string };

export default async function GuesthousePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Query>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const gh = await getGuesthouseBySlug(slug);
  if (!gh) notFound();

  const nights =
    query.checkIn && query.checkOut
      ? nightsBetween(query.checkIn, query.checkOut)
      : 0;
  const carried = new URLSearchParams();
  if (query.checkIn) carried.set("checkIn", query.checkIn);
  if (query.checkOut) carried.set("checkOut", query.checkOut);
  if (query.guests) carried.set("guests", query.guests);
  const carriedQuery = carried.toString();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-3 text-xs text-slate-500">
        <Link href="/search" className="hover:text-teal-700">
          Guesthouses
        </Link>{" "}
        ›{" "}
        <Link
          href={`/islands/${gh.island?.slug}`}
          className="hover:text-teal-700"
        >
          {gh.island?.name}
        </Link>{" "}
        › <span className="text-slate-700">{gh.name}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {gh.name}
          </h1>
          <p className="mt-0.5 text-sm font-medium text-teal-700">
            {gh.island?.name} · {gh.island?.atoll}
          </p>
        </div>
        <RatingBadge rating={gh.rating} reviewCount={gh.review_count} size="lg" />
      </div>

      <div className="mt-4">
        <PhotoGallery photos={gh.photos} name={gh.name} />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">About this stay</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
            {gh.description}
          </p>

          <h3 className="mt-6 font-bold text-slate-900">Amenities</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {gh.amenities.map((a) => (
              <span
                key={a}
                className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800"
              >
                ✓ {a}
              </span>
            ))}
          </div>

          {gh.island?.transfer_info && (
            <p className="mt-6 rounded-xl bg-cyan-50 p-3 text-xs text-cyan-900">
              🛥️ <span className="font-semibold">Getting there:</span>{" "}
              {gh.island.transfer_info}
            </p>
          )}
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm lg:sticky lg:top-20 lg:self-start">
          <div className="font-bold text-slate-900">Good to know</div>
          <ul className="mt-2 space-y-1.5 text-slate-600">
            <li>✓ No prepayment — request first, pay later</li>
            <li>✓ Guesthouse confirms within 24 hours</li>
            <li>✓ Free cancellation until confirmed</li>
          </ul>
          {nights > 0 && (
            <p className="mt-3 rounded-lg bg-white p-2 text-xs text-slate-600">
              Your dates: <b>{query.checkIn}</b> → <b>{query.checkOut}</b> (
              {nights} night{nights === 1 ? "" : "s"},{" "}
              {query.guests ?? 2} guest{Number(query.guests ?? 2) > 1 ? "s" : ""})
            </p>
          )}
        </aside>
      </div>

      {/* Rooms */}
      <h2 id="rooms" className="mt-10 text-lg font-bold text-slate-900 sm:text-xl">
        Choose your room
      </h2>
      <div className="mt-4 grid gap-4">
        {gh.rooms.map((room) => (
          <div
            key={room.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white sm:flex-row"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={room.photos[0]?.url ?? gh.photos[0]?.url ?? "/demo/room-1.svg"}
              alt={room.photos[0]?.alt ?? room.name}
              className="h-40 w-full object-cover sm:h-auto sm:w-48 sm:shrink-0"
              loading="lazy"
            />
            <div className="flex flex-1 flex-col p-4 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{room.name}</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {room.beds} · sleeps {room.max_guests}
                </p>
                <p className="mt-1.5 text-sm text-slate-600">{room.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {room.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 sm:mt-0 sm:flex-col sm:items-end">
                <div className="text-right">
                  <div className="text-xl font-extrabold text-slate-900">
                    ${room.base_price_usd}
                  </div>
                  <div className="text-xs text-slate-500">per night</div>
                  {nights > 0 && (
                    <div className="text-xs font-semibold text-teal-700">
                      ${room.base_price_usd * nights} for {nights} night
                      {nights === 1 ? "" : "s"}
                    </div>
                  )}
                </div>
                <Link
                  href={`/book/${room.id}${carriedQuery ? `?${carriedQuery}` : ""}`}
                  className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
                >
                  Reserve
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
