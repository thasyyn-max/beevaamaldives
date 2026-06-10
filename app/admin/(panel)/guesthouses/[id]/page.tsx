import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteGuesthouse } from "@/app/admin/actions";
import { adminGetGuesthouse, adminListIslands } from "@/lib/admin";
import { GuesthouseForm } from "@/components/admin/GuesthouseForm";
import { PhotoGrid } from "@/components/admin/PhotoGrid";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { RoomEditor } from "@/components/admin/RoomEditor";
import type { Photo } from "@/lib/types";

export const metadata = { title: "Edit guesthouse" };

export default async function EditGuesthousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [guesthouse, islands] = await Promise.all([
    adminGetGuesthouse(id),
    adminListIslands(),
  ]);
  if (!guesthouse) notFound();
  // Gallery = photos attached to the guesthouse itself (not room photos)
  const galleryPhotos = ((guesthouse.photos ?? []) as (Photo & { room_id?: string | null })[]).filter(
    (p) => !p.room_id
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-extrabold text-slate-900">
          {guesthouse.name}
        </h1>
        <Link
          href={`/stay/${guesthouse.slug}`}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-white"
        >
          View public page →
        </Link>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Listing details
        </h2>
        <GuesthouseForm guesthouse={guesthouse} islands={islands} />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Gallery photos
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <PhotoGrid photos={galleryPhotos} guesthouseId={guesthouse.id} />
          <div className="mt-3">
            <PhotoUploader
              guesthouseId={guesthouse.id}
              defaultAlt={guesthouse.name}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Rooms & prices
        </h2>
        <div className="space-y-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(guesthouse.rooms ?? []).map((room: any) => (
            <RoomEditor key={room.id} guesthouseId={guesthouse.id} room={room} />
          ))}
          <RoomEditor guesthouseId={guesthouse.id} />
        </div>
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50/50 p-4">
        <h2 className="text-sm font-bold text-red-700">Danger zone</h2>
        <p className="mt-1 text-xs text-red-600">
          Deleting removes the listing, its rooms and photos permanently.
        </p>
        <form action={deleteGuesthouse} className="mt-2">
          <input type="hidden" name="id" value={guesthouse.id} />
          <button className="rounded-lg border border-red-300 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100">
            Delete guesthouse
          </button>
        </form>
      </section>
    </div>
  );
}
