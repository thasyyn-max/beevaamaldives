"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { nightsBetween } from "@/lib/types";

export function BookingForm({
  roomId,
  pricePerNight,
  maxGuests,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: {
  roomId: string;
  pricePerNight: number;
  maxGuests: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn ?? "");
  const [checkOut, setCheckOut] = useState(initialCheckOut ?? "");
  const [guests, setGuests] = useState(
    Math.min(initialGuests ?? 2, maxGuests)
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights = useMemo(
    () => (checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0),
    [checkIn, checkOut]
  );
  const total = nights * pricePerNight;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (nights < 1) {
      setError("Please choose a check-out date after your check-in date.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          guestCountry: country,
          checkIn,
          checkOut,
          guests,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      router.push(`/book/confirmed/${data.reference}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";
  const label = "mb-1 block text-xs font-semibold text-slate-600";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="bf-checkin">Check-in *</label>
          <input
            id="bf-checkin"
            type="date"
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="bf-checkout">Check-out *</label>
          <input
            id="bf-checkout"
            type="date"
            required
            min={checkIn || undefined}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={field}
          />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="bf-guests">Guests *</label>
        <select
          id="bf-guests"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className={field}
        >
          {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} guest{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="bf-name">Full name *</label>
        <input
          id="bf-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
          placeholder="As in your passport"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="bf-email">Email *</label>
          <input
            id="bf-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className={label} htmlFor="bf-phone">Phone / WhatsApp *</label>
          <input
            id="bf-phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={field}
            placeholder="+44 ..."
          />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="bf-country">Country *</label>
        <input
          id="bf-country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={field}
          placeholder="United Kingdom"
        />
      </div>
      <div>
        <label className={label} htmlFor="bf-message">
          Message to the guesthouse (optional)
        </label>
        <textarea
          id="bf-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={field}
          placeholder="Arrival time, dietary needs, excursion wishes…"
        />
      </div>

      {nights > 0 && (
        <div className="rounded-xl bg-teal-50 p-3 text-sm text-teal-900">
          <div className="flex justify-between">
            <span>
              ${pricePerNight} × {nights} night{nights === 1 ? "" : "s"}
            </span>
            <span className="font-bold">${total}</span>
          </div>
          <p className="mt-1 text-xs text-teal-700">
            No payment now — the guesthouse confirms first.
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60"
      >
        {submitting ? "Sending request…" : "Request to book"}
      </button>
      <p className="text-center text-xs text-slate-500">
        Free cancellation until the guesthouse confirms.
      </p>
    </form>
  );
}
