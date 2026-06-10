import { saveGuesthouse } from "@/app/admin/actions";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function GuesthouseForm({
  guesthouse,
  islands,
}: {
  guesthouse?: any;
  islands: any[];
}) {
  const g = guesthouse;
  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500";
  const label = "mb-1 block text-xs font-semibold text-slate-600";

  return (
    <form
      action={saveGuesthouse}
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2"
    >
      {g && <input type="hidden" name="id" value={g.id} />}
      <div>
        <label className={label}>Name *</label>
        <input name="name" required defaultValue={g?.name ?? ""} className={field} />
      </div>
      <div>
        <label className={label}>URL slug (auto if empty)</label>
        <input name="slug" defaultValue={g?.slug ?? ""} className={field} placeholder="coral-sands-inn" />
      </div>
      <div>
        <label className={label}>Island *</label>
        <select name="island_id" required defaultValue={g?.island_id ?? ""} className={field}>
          <option value="" disabled>Choose island…</option>
          {islands.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} · {i.atoll}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Status</label>
        <select name="status" defaultValue={g?.status ?? "draft"} className={field}>
          <option value="draft">Draft (hidden)</option>
          <option value="live">Live (public)</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Description</label>
        <textarea name="description" rows={3} defaultValue={g?.description ?? ""} className={field} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Amenities (comma separated)</label>
        <input
          name="amenities"
          defaultValue={(g?.amenities ?? []).join(", ")}
          className={field}
          placeholder="Free WiFi, Air conditioning, Breakfast included"
        />
      </div>
      <div>
        <label className={label}>Rating (0–10)</label>
        <input name="rating" type="number" step="0.1" min="0" max="10" defaultValue={g?.rating ?? 0} className={field} />
      </div>
      <div>
        <label className={label}>Review count</label>
        <input name="review_count" type="number" min="0" defaultValue={g?.review_count ?? 0} className={field} />
      </div>
      <div>
        <label className={label}>Contact email</label>
        <input name="contact_email" type="email" defaultValue={g?.contact_email ?? ""} className={field} />
      </div>
      <div>
        <label className={label}>Contact phone</label>
        <input name="contact_phone" defaultValue={g?.contact_phone ?? ""} className={field} />
      </div>
      <div className="sm:col-span-2">
        <button className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700">
          {g ? "Save changes" : "Create guesthouse"}
        </button>
      </div>
    </form>
  );
}
