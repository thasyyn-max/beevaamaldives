import { adminListIslands } from "@/lib/admin";
import { GuesthouseForm } from "@/components/admin/GuesthouseForm";

export const metadata = { title: "New guesthouse" };

export default async function NewGuesthousePage() {
  const islands = await adminListIslands();
  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">New guesthouse</h1>
      <p className="mt-1 text-sm text-slate-500">
        Create the listing as a draft first — add rooms and photos, then set
        it to Live.
      </p>
      <div className="mt-4">
        <GuesthouseForm islands={islands} />
      </div>
    </div>
  );
}
