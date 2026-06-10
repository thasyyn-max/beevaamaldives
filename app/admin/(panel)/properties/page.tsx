import Link from "next/link";
import { adminListProperties } from "@/lib/admin";
import { StatusPill } from "@/components/admin/StatusPill";

export const metadata = { title: "Properties" };

const LABEL: Record<string, string> = {
  resorts: "Resort",
  liveaboards: "Liveaboard",
  "city-hotels": "City Hotel",
};

export default async function AdminPropertiesPage() {
  const properties = await adminListProperties();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Properties</h1>
          <p className="mt-1 text-sm text-muted">
            {properties.length} listings · edit details, photos and status.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white hover:bg-brand"
        >
          + Add property
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {properties.map((p: any) => (
          <Link
            key={p.id}
            href={`/admin/properties/${p.id}`}
            className="flex gap-3 rounded-2xl border border-line bg-bg p-3 hover:border-brand"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.cover || "/import/about/about_image_001.jpg"}
              alt=""
              className="h-16 w-20 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate font-semibold text-ink">{p.name}</div>
                <StatusPill status={p.status} />
              </div>
              <div className="text-xs text-muted">
                {LABEL[p.category] ?? p.category} · {p.atoll}
                {p.from_price_usd ? ` · from $${p.from_price_usd}` : ""}
              </div>
            </div>
          </Link>
        ))}
        {properties.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted sm:col-span-2">
            No properties yet.
          </p>
        )}
      </div>
    </div>
  );
}
