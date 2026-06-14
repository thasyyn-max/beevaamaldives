import { adminListArticles } from "@/lib/admin";
import { ExperiencesManager } from "@/components/admin/ExperiencesManager";

export const metadata = { title: "Explore" };

export default async function AdminExplorePage() {
  const articles = await adminListArticles();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Explore</h1>
      <p className="mt-1 text-sm text-muted">
        Edit the photo, title and description for each experience. These show
        on the Explore page and on any property you&apos;ve ticked them for.
      </p>
      <div className="mt-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ExperiencesManager articles={articles as any} />
      </div>
    </div>
  );
}
