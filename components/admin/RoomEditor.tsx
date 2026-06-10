import { deleteRoom, saveRoom } from "@/app/admin/actions";
import type { Photo } from "@/lib/types";
import { PhotoGrid } from "./PhotoGrid";
import { PhotoUploader } from "./PhotoUploader";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function RoomEditor({
  guesthouseId,
  room,
}: {
  guesthouseId: string;
  room?: any; // undefined = "add new room" form
}) {
  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500";
  const label = "mb-1 block text-xs font-semibold text-slate-600";

  return (
    <details
      className="rounded-2xl border border-slate-200 bg-white"
      open={!room}
    >
      <summary className="cursor-pointer select-none p-4 text-sm font-bold text-slate-900">
        {room ? (
          <>
            {room.name}{" "}
            <span className="font-normal text-slate-500">
              · ${Number(room.base_price_usd)}/night · sleeps {room.max_guests}
            </span>
          </>
        ) : (
          "+ Add a room"
        )}
      </summary>
      <div className="space-y-4 border-t border-slate-100 p-4">
        <form action={saveRoom} className="grid gap-3 sm:grid-cols-2">
          {room && <input type="hidden" name="id" value={room.id} />}
          <input type="hidden" name="guesthouse_id" value={guesthouseId} />
          <div>
            <label className={label}>Room name *</label>
            <input name="name" required defaultValue={room?.name ?? ""} className={field} placeholder="Deluxe Double Room" />
          </div>
          <div>
            <label className={label}>Beds</label>
            <input name="beds" defaultValue={room?.beds ?? ""} className={field} placeholder="1 queen bed" />
          </div>
          <div>
            <label className={label}>Price per night (USD) *</label>
            <input name="base_price_usd" type="number" min="0" step="1" required defaultValue={room ? Number(room.base_price_usd) : ""} className={field} />
          </div>
          <div>
            <label className={label}>Max guests</label>
            <input name="max_guests" type="number" min="1" max="10" defaultValue={room?.max_guests ?? 2} className={field} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Description</label>
            <textarea name="description" rows={2} defaultValue={room?.description ?? ""} className={field} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Amenities (comma separated)</label>
            <input name="amenities" defaultValue={(room?.amenities ?? []).join(", ")} className={field} placeholder="Balcony, Sea view" />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700">
              {room ? "Save room" : "Add room"}
            </button>
          </div>
        </form>

        {room && (
          <>
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                Room photos
              </div>
              <PhotoGrid photos={(room.photos ?? []) as Photo[]} roomId={room.id} />
              <div className="mt-2">
                <PhotoUploader roomId={room.id} defaultAlt={room.name} />
              </div>
            </div>
            <form action={deleteRoom}>
              <input type="hidden" name="id" value={room.id} />
              <button className="text-xs font-bold text-red-600 hover:underline">
                Delete this room
              </button>
            </form>
          </>
        )}
      </div>
    </details>
  );
}
