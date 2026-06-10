import { deletePhoto, movePhoto } from "@/app/admin/actions";
import type { Photo } from "@/lib/types";

export function PhotoGrid({
  photos,
  guesthouseId,
  roomId,
}: {
  photos: Photo[];
  guesthouseId?: string;
  roomId?: string;
}) {
  const sorted = [...photos].sort((a, b) => a.sort_order - b.sort_order);
  if (sorted.length === 0) {
    return <p className="text-xs text-slate-400">No photos yet.</p>;
  }
  const btn =
    "rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-bold text-slate-700 shadow hover:bg-white";
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {sorted.map((p, i) => (
        <div key={p.id} className="group relative overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.url} alt={p.alt} className="h-24 w-full object-cover" />
          {i === 0 && (
            <span className="absolute left-1 top-1 rounded bg-teal-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              Cover
            </span>
          )}
          <div className="absolute bottom-1 right-1 flex gap-1">
            <form action={movePhoto}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="direction" value="up" />
              {guesthouseId && (
                <input type="hidden" name="guesthouse_id" value={guesthouseId} />
              )}
              {roomId && <input type="hidden" name="room_id" value={roomId} />}
              <button className={btn} title="Move earlier">←</button>
            </form>
            <form action={movePhoto}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="direction" value="down" />
              {guesthouseId && (
                <input type="hidden" name="guesthouse_id" value={guesthouseId} />
              )}
              {roomId && <input type="hidden" name="room_id" value={roomId} />}
              <button className={btn} title="Move later">→</button>
            </form>
            <form action={deletePhoto}>
              <input type="hidden" name="id" value={p.id} />
              <button className={`${btn} text-red-600`} title="Delete">✕</button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
