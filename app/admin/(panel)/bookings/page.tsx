import { adminListBookings } from "@/lib/admin";
import { StatusPill } from "@/components/admin/StatusPill";
import { setBookingStatus } from "../../actions";

export const metadata = { title: "Bookings" };

export default async function AdminBookingsPage() {
  const bookings = await adminListBookings();

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Bookings</h1>
      <p className="mt-1 text-sm text-slate-500">
        Confirm or decline requests — the guest is emailed automatically.
      </p>

      <div className="mt-4 space-y-3">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">
                    {b.reference}
                  </span>
                  <StatusPill status={b.status} />
                </div>
                <div className="mt-1 font-bold text-slate-900">
                  {b.guest_name}{" "}
                  <span className="font-normal text-slate-500">
                    ({b.guest_country || "—"})
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  {b.guesthouse_name} · {b.room_name} · {b.island_name}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  📅 {b.check_in} → {b.check_out} · {b.nights} night
                  {b.nights === 1 ? "" : "s"} · {b.guests} guest
                  {b.guests === 1 ? "" : "s"} ·{" "}
                  <b className="text-slate-900">${b.total_usd}</b>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  ✉️ {b.guest_email} · 📞 {b.guest_phone || "—"}
                </div>
                {b.message && (
                  <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
                    “{b.message}”
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                {b.status === "pending" && (
                  <>
                    <form action={setBookingStatus}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="confirmed" />
                      <button className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                        ✓ Confirm
                      </button>
                    </form>
                    <form action={setBookingStatus}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="declined" />
                      <button className="w-full rounded-lg border border-red-300 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                        ✕ Decline
                      </button>
                    </form>
                  </>
                )}
                {b.status === "confirmed" && (
                  <>
                    <form action={setBookingStatus}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="completed" />
                      <button className="w-full rounded-lg border border-blue-300 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50">
                        Mark completed
                      </button>
                    </form>
                    <form action={setBookingStatus}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <button className="w-full rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                        Cancel
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No bookings yet.
          </p>
        )}
      </div>
    </div>
  );
}
