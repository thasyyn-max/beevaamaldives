import Link from "next/link";
import { adminListGuesthouses } from "@/lib/admin";

export const metadata = { title: "Guesthouses" };

export default async function AdminGuesthousesPage() {
  const guesthouses = await adminListGuesthouses();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Guesthouses</h1>
          <p className="mt-1 text-sm text-slate-500">
            Listings, rooms, prices and photos.
          </p>
        </div>
        <Link
          href="/admin/guesthouses/new"
          className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
        >
          + Add guesthouse
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {guesthouses.map((g) => (
          <Link
            key={g.id}
            href={`/admin/guesthouses/${g.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-teal-400"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold text-slate-900">{g.name}</div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  g.status === "live"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {g.status}
              </span>
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(g as any).island?.name} · {(g.rooms ?? []).length} rooms ·{" "}
              {(g.photos ?? []).length} photos
            </div>
          </Link>
        ))}
        {guesthouses.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 sm:col-span-2">
            No guesthouses yet — add your first one.
          </p>
        )}
      </div>
    </div>
  );
}
