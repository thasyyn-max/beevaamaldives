import Link from "next/link";
import { adminListEnquiries, adminListProperties } from "@/lib/admin";
import { StatusPill } from "@/components/admin/StatusPill";

export default async function AdminDashboard() {
  const [enquiries, properties] = await Promise.all([
    adminListEnquiries(),
    adminListProperties(),
  ]);
  const newCount = enquiries.filter((e) => e.status === "new").length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const live = properties.filter((p: any) => p.status === "live").length;

  const stats = [
    { label: "New bookings", value: newCount, href: "/admin/enquiries" },
    { label: "All bookings", value: enquiries.length, href: "/admin/enquiries" },
    { label: "Live properties", value: live, href: "/admin/properties" },
    { label: "All properties", value: properties.length, href: "/admin/properties" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Dashboard</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-line bg-bg p-4 hover:border-brand"
          >
            <div className="text-2xl font-bold text-ink">{s.value}</div>
            <div className="text-xs font-medium text-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-semibold text-ink">Latest bookings</h2>
        <Link href="/admin/enquiries" className="text-sm font-semibold text-brand">
          View all →
        </Link>
      </div>
      <div className="mt-3 space-y-2">
        {enquiries.slice(0, 6).map((e) => (
          <div
            key={e.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-bg p-3 text-sm"
          >
            <div>
              <span className="font-mono text-xs text-muted">{e.reference}</span>{" "}
              <span className="font-semibold text-ink">{e.guest_name}</span>{" "}
              <span className="text-muted">
                · {e.property_name ?? "General enquiry"}
              </span>
            </div>
            <StatusPill status={e.status} />
          </div>
        ))}
        {enquiries.length === 0 && (
          <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
            No bookings yet.
          </p>
        )}
      </div>
    </div>
  );
}
