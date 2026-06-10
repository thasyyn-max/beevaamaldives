import Link from "next/link";
import { adminListBookings, adminListGuesthouses } from "@/lib/admin";
import { StatusPill } from "@/components/admin/StatusPill";

export default async function AdminDashboard() {
  const [bookings, guesthouses] = await Promise.all([
    adminListBookings(),
    adminListGuesthouses(),
  ]);
  const pending = bookings.filter((b) => b.status === "pending");
  const live = guesthouses.filter((g) => g.status === "live");

  const stats = [
    { label: "Pending requests", value: pending.length, href: "/admin/bookings" },
    { label: "Total bookings", value: bookings.length, href: "/admin/bookings" },
    { label: "Live guesthouses", value: live.length, href: "/admin/guesthouses" },
    { label: "All listings", value: guesthouses.length, href: "/admin/guesthouses" },
  ];

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Dashboard</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-teal-400"
          >
            <div className="text-2xl font-extrabold text-slate-900">
              {s.value}
            </div>
            <div className="text-xs font-medium text-slate-500">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-bold text-slate-900">Latest booking requests</h2>
        <Link
          href="/admin/bookings"
          className="text-sm font-semibold text-teal-700 hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="mt-3 space-y-2">
        {bookings.slice(0, 5).map((b) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm"
          >
            <div>
              <span className="font-mono text-xs text-slate-400">
                {b.reference}
              </span>{" "}
              <span className="font-semibold text-slate-900">{b.guest_name}</span>{" "}
              <span className="text-slate-500">
                · {b.guesthouse_name} · {b.check_in} → {b.check_out}
              </span>
            </div>
            <StatusPill status={b.status} />
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            No bookings yet — they&apos;ll appear here as soon as a guest
            sends a request.
          </p>
        )}
      </div>
    </div>
  );
}
