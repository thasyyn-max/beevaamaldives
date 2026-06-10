import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { getRoomById } from "@/lib/data";

export const metadata: Metadata = { title: "Request to book" };

type Query = { checkIn?: string; checkOut?: string; guests?: string };

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<Query>;
}) {
  const [{ roomId }, query] = await Promise.all([params, searchParams]);
  const found = await getRoomById(roomId);
  if (!found) notFound();
  const { room, guesthouse } = found;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <nav className="mb-3 text-xs text-slate-500">
        <Link href={`/stay/${guesthouse.slug}`} className="hover:text-teal-700">
          ← Back to {guesthouse.name}
        </Link>
      </nav>
      <h1 className="text-2xl font-extrabold text-slate-900">
        Request to book
      </h1>

      <div className="mt-4 flex gap-3 rounded-2xl border border-slate-200 bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.photos[0]?.url ?? guesthouse.photos[0]?.url ?? "/demo/room-1.svg"}
          alt={room.name}
          className="h-20 w-28 shrink-0 rounded-xl object-cover"
        />
        <div className="text-sm">
          <div className="font-bold text-slate-900">{room.name}</div>
          <div className="text-slate-600">
            {guesthouse.name} · {guesthouse.island?.name}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {room.beds} · sleeps {room.max_guests} ·{" "}
            <b className="text-slate-700">${room.base_price_usd}/night</b>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <BookingForm
          roomId={room.id}
          pricePerNight={room.base_price_usd}
          maxGuests={room.max_guests}
          initialCheckIn={query.checkIn}
          initialCheckOut={query.checkOut}
          initialGuests={query.guests ? Number(query.guests) : undefined}
        />
      </div>
    </div>
  );
}
