// The three Explore experiences. Each maps to an article (by slug) that holds
// its editable photo + description, and can be ticked on a property.
export const EXPERIENCES = [
  { slug: "shipwreck", label: "Shipwreck" },
  { slug: "surfing-spots", label: "Surf Point" },
  { slug: "diving-spots", label: "Diving Point" },
] as const;

export const EXPERIENCE_SLUGS = EXPERIENCES.map((e) => e.slug) as string[];

export function experienceLabel(slug: string): string {
  return EXPERIENCES.find((e) => e.slug === slug)?.label ?? slug;
}
