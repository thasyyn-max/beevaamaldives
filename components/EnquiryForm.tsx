"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function EnquiryForm({
  propertyId,
  propertyName,
}: {
  propertyId?: string;
  propertyName?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestCountry: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: propertyId ?? null,
          ...form,
          guests: Number(form.guests),
          checkIn: form.checkIn || null,
          checkOut: form.checkOut || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      router.push(`/enquire/sent/${data.reference}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-50";
  const label = "mb-1 block text-xs font-semibold text-muted";

  return (
    <form onSubmit={submit} className="space-y-4">
      {propertyName && (
        <div className="rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm text-brand-ink">
          Enquiring about <b>{propertyName}</b>
        </div>
      )}
      <div>
        <label className={label}>Full name *</label>
        <input required value={form.guestName} onChange={set("guestName")} className={field} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Email *</label>
          <input type="email" required value={form.guestEmail} onChange={set("guestEmail")} className={field} placeholder="you@example.com" />
        </div>
        <div>
          <label className={label}>Phone / WhatsApp *</label>
          <input required value={form.guestPhone} onChange={set("guestPhone")} className={field} placeholder="+44 ..." />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Check-in</label>
          <input type="date" value={form.checkIn} onChange={set("checkIn")} className={field} />
        </div>
        <div>
          <label className={label}>Check-out</label>
          <input type="date" min={form.checkIn || undefined} value={form.checkOut} onChange={set("checkOut")} className={field} />
        </div>
        <div>
          <label className={label}>Guests</label>
          <select value={form.guests} onChange={set("guests")} className={field}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={label}>Country</label>
        <input value={form.guestCountry} onChange={set("guestCountry")} className={field} placeholder="United Kingdom" />
      </div>
      <div>
        <label className={label}>Your message</label>
        <textarea rows={4} value={form.message} onChange={set("message")} className={field} placeholder="What are you looking for? Honeymoon, diving, family trip, budget…" />
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send enquiry"}
      </button>
      <p className="text-center text-xs text-muted">
        No payment now. We reply within 24 hours with a tailored quote.
      </p>
    </form>
  );
}
