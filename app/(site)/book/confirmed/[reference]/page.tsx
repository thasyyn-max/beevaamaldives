import type { Metadata } from "next";
import Link from "next/link";
import { getBookingByReference } from "@/lib/data";

export const metadata: Metadata = { title: "Booking request sent" };

export default async function ConfirmedPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const booking = await getBookingByReference(reference);

  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-3xl">
        ✓
      </div>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Booking request sent!
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Your reference is{" "}
        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-bold text-slate-900">
          {reference}
        </span>
        . The guesthouse will confirm availability within 24 hours — watch
        your email (and spam folder).
      </p>

      {booking && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm">
          <div className="font-bold text-slate-900">
            {booking.guesthouse_name}
            {booking.island_name ? ` · ${booking.island_name}` : ""}
          </div>
          <dl className="mt-2 space-y-1 text-slate-600">
            <div className="flex justify-between">
              <dt>Room</dt>
              <dd className="font-medium text-slate-900">{booking.room_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Dates</dt>
              <dd className="font-medium text-slate-900">
                {booking.check_in} → {booking.check_out} ({booking.nights}{" "}
                night{booking.nights === 1 ? "" : "s"})
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Guests</dt>
              <dd className="font-medium text-slate-900">{booking.guests}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-1">
              <dt>Total (pay later)</dt>
              <dd className="font-extrabold text-slate-900">
                ${booking.total_usd}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <Link
        href="/search"
        className="mt-8 inline-block rounded-lg bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700"
      >
        Browse more stays
      </Link>
    </div>
  );
}
