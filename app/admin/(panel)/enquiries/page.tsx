import { adminListEnquiries } from "@/lib/admin";
import { StatusPill } from "@/components/admin/StatusPill";
import { replyToEnquiry, setEnquiryStatus } from "../../actions";

export const metadata = { title: "Enquiries" };

export default async function AdminEnquiriesPage() {
  const enquiries = await adminListEnquiries();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Enquiries</h1>
      <p className="mt-1 text-sm text-muted">
        Reply by email (marks as replied), or update the status.
      </p>

      <div className="mt-4 space-y-3">
        {enquiries.map((e) => (
          <div key={e.id} className="rounded-2xl border border-line bg-bg p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted">{e.reference}</span>
                  <StatusPill status={e.status} />
                </div>
                <div className="mt-1 font-semibold text-ink">
                  {e.guest_name}{" "}
                  <span className="font-normal text-muted">
                    ({e.guest_country || "—"})
                  </span>
                </div>
                <div className="text-sm text-muted">
                  {e.property_name ?? "General enquiry"}
                  {e.check_in ? ` · ${e.check_in} → ${e.check_out ?? "?"}` : ""} ·{" "}
                  {e.guests} guest{e.guests === 1 ? "" : "s"}
                </div>
                <div className="mt-1 text-xs text-muted">
                  ✉️ {e.guest_email} · 📞 {e.guest_phone || "—"}
                </div>
                {e.message && (
                  <p className="mt-2 rounded-lg bg-surface p-2 text-xs text-muted">
                    “{e.message}”
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1.5">
                <form action={setEnquiryStatus}>
                  <input type="hidden" name="id" value={e.id} />
                  <input type="hidden" name="status" value="closed" />
                  <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-muted hover:bg-surface">
                    Close
                  </button>
                </form>
              </div>
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-brand">
                Reply by email
              </summary>
              <form action={replyToEnquiry} className="mt-2 space-y-2">
                <input type="hidden" name="id" value={e.id} />
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder={`Hi ${e.guest_name}, thanks for your enquiry…`}
                  className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <button className="rounded-lg bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-brand">
                  Send reply
                </button>
              </form>
            </details>
          </div>
        ))}
        {enquiries.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
            No enquiries yet.
          </p>
        )}
      </div>
    </div>
  );
}
