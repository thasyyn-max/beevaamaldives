import { adminListCategories } from "@/lib/admin";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const metadata = { title: "New property" };

export default async function NewPropertyPage() {
  const categories = await adminListCategories();
  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">New property</h1>
      <p className="mt-1 text-sm text-muted">
        Create it as a draft, add photos, then set it to Live.
      </p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <div className="mt-4">
        <PropertyForm categories={categories as any} />
      </div>
    </div>
  );
}
