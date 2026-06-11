import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProperty } from "@/app/admin/actions";
import { adminGetProperty, adminListCategories } from "@/lib/admin";
import { BlocksEditor } from "@/components/admin/BlocksEditor";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { PropertyPhotos } from "@/components/admin/PropertyPhotos";
import type { ContentBlock } from "@/lib/types";

export const metadata = { title: "Edit property" };

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, categories] = await Promise.all([
    adminGetProperty(id),
    adminListCategories(),
  ]);
  if (!property) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-2xl font-medium text-ink">{property.name}</h1>
        <Link
          href={`/property/${property.slug}`}
          className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-muted hover:bg-bg"
        >
          View public page →
        </Link>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">
          Photos
        </h2>
        <div className="rounded-2xl border border-line bg-bg p-4">
          <PropertyPhotos
            propertyId={property.id}
            gallery={(property.gallery as string[]) ?? []}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">
          {property.category === "safari" ? "Cabins & rooms" : "Rooms & villas"}
        </h2>
        <div className="rounded-2xl border border-line bg-bg p-4">
          <BlocksEditor
            propertyId={property.id}
            field="accommodations"
            blocks={(property.accommodations as ContentBlock[]) ?? []}
            noun="room"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">
          Dining
        </h2>
        <div className="rounded-2xl border border-line bg-bg p-4">
          <BlocksEditor
            propertyId={property.id}
            field="dining"
            blocks={(property.dining as ContentBlock[]) ?? []}
            noun="venue"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">
          Details
        </h2>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <PropertyForm property={property} categories={categories as any} />
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50/50 p-4">
        <h2 className="text-sm font-bold text-red-700">Danger zone</h2>
        <form action={deleteProperty} className="mt-2">
          <input type="hidden" name="id" value={property.id} />
          <button className="rounded-lg border border-red-300 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100">
            Delete property
          </button>
        </form>
      </section>
    </div>
  );
}
