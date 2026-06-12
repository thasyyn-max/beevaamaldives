import { createDataClient } from "@/lib/supabase/server";
import { HeroSlidesManager } from "@/components/admin/HeroSlidesManager";
import type { HeroSlide } from "@/lib/types";

export const metadata = { title: "Hero slides" };

export default async function AdminHeroPage() {
  const db = createDataClient();
  const { data } = await db
    .from("hero_slides")
    .select("*")
    .order("sort_order");
  const slides = (data ?? []) as HeroSlide[];

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Hero slides</h1>
      <p className="mt-1 text-sm text-muted">
        Up to 5 photos or short videos for the home page hero. Each shows for
        15 seconds; the first slide always loads instantly as a photo.
      </p>
      <div className="mt-4 rounded-2xl border border-line bg-bg p-4">
        <HeroSlidesManager slides={slides} />
      </div>
    </div>
  );
}
