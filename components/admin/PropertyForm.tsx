import { saveProperty } from "@/app/admin/actions";
import type { Category, Property } from "@/lib/types";

export function PropertyForm({
  property,
  categories,
}: {
  property?: Property;
  categories: Category[];
}) {
  const p = property;
  const field =
    "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand";
  const label = "mb-1 block text-xs font-semibold text-muted";

  return (
    <form
      action={saveProperty}
      className="grid gap-4 rounded-2xl border border-line bg-bg p-4 sm:grid-cols-2"
    >
      {p && <input type="hidden" name="id" value={p.id} />}
      <div>
        <label className={label}>Name *</label>
        <input name="name" required defaultValue={p?.name ?? ""} className={field} />
      </div>
      <div>
        <label className={label}>URL slug (auto if empty)</label>
        <input name="slug" defaultValue={p?.slug ?? ""} className={field} />
      </div>
      <div>
        <label className={label}>Category *</label>
        <select name="category" required defaultValue={p?.category ?? ""} className={field}>
          <option value="" disabled>Choose…</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Atoll / location</label>
        <input name="atoll" defaultValue={p?.atoll ?? ""} className={field} placeholder="North Male Atoll" />
      </div>
      <div>
        <label className={label}>From price (USD/night, optional)</label>
        <input name="from_price_usd" type="number" min="0" step="1" defaultValue={p?.from_price_usd ?? ""} className={field} />
      </div>
      <div>
        <label className={label}>Status</label>
        <select name="status" defaultValue={p?.status ?? "draft"} className={field}>
          <option value="draft">Draft (hidden)</option>
          <option value="live">Live (public)</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Short description (one line for cards)</label>
        <input name="short_description" defaultValue={p?.short_description ?? ""} className={field} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Full description</label>
        <textarea name="description" rows={6} defaultValue={p?.description ?? ""} className={field} />
        <p className="mt-1 text-[11px] text-muted">Tip: an ALL-CAPS line on its own becomes a subheading.</p>
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Tags (comma separated)</label>
        <input name="tags" defaultValue={(p?.tags ?? []).join(", ")} className={field} placeholder="Honeymoon, Diving, All Inclusive" />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Facilities (comma separated)</label>
        <textarea name="facilities" rows={2} defaultValue={(p?.facilities ?? []).join(", ")} className={field} />
      </div>
      <div className="sm:col-span-2">
        <button className="rounded-lg bg-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-brand">
          {p ? "Save changes" : "Create property"}
        </button>
      </div>
    </form>
  );
}
