import type { ReactNode } from "react";

/**
 * "Most popular facilities" row, booking.com style — matches known
 * facility keywords to icons; unmatched facilities stay in the full list.
 */
const ICONS: { match: RegExp; label: string; icon: ReactNode }[] = [
  {
    match: /wifi|wi-fi/i,
    label: "Free WiFi",
    icon: <path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01" />,
  },
  {
    match: /beach/i,
    label: "Beach access",
    icon: (
      <>
        <path d="M2 20h20" />
        <path d="M12 4a7 7 0 0 1 7 7H5a7 7 0 0 1 7-7Z" />
        <path d="M12 11v9" />
      </>
    ),
  },
  {
    match: /airport|shuttle|transfer/i,
    label: "Airport transfer",
    icon: (
      <>
        <path d="M2 16h20" />
        <path d="m4 13 4-1 3-6 2-.5-1 6.5 5-1 2-2.5 2 .5-2 5-15 .5Z" />
      </>
    ),
  },
  {
    match: /restaurant|dining|cafe|café/i,
    label: "Restaurant",
    icon: <path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M16 3c-1.5 0-3 1.5-3 4v4h3m0-8v18M7 14v7" />,
  },
  {
    match: /breakfast/i,
    label: "Breakfast",
    icon: (
      <>
        <path d="M4 8h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" />
        <path d="M16 9h2a2 2 0 0 1 0 4h-2M6 3v2M10 3v2M14 3v2" />
      </>
    ),
  },
  {
    match: /family/i,
    label: "Family rooms",
    icon: (
      <>
        <circle cx="8" cy="6" r="2.5" />
        <circle cx="16" cy="7.5" r="2" />
        <path d="M3.5 20v-4a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v4M14 20v-3a3 3 0 0 1 3-3h.5a3 3 0 0 1 3 3v3" />
      </>
    ),
  },
  {
    match: /bar\b|lounge/i,
    label: "Bar",
    icon: <path d="M5 3h14l-7 8v7m-4 3h8m-9-15h10" />,
  },
  {
    match: /pool/i,
    label: "Pool",
    icon: (
      <>
        <path d="M2 18c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
        <path d="M8 15V5a2 2 0 0 1 4 0M14 15V5a2 2 0 0 1 4 0" />
      </>
    ),
  },
  {
    match: /div(e|ing)|snorkel|water ?sport/i,
    label: "Water sports",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M9 11.5 5 20l4-2 3 2 3-2 4 2-4-8.5" />
      </>
    ),
  },
  {
    match: /air ?con/i,
    label: "Air conditioning",
    icon: <path d="M12 3v18M5 6.5 19 17.5M19 6.5 5 17.5M8 4l4 3 4-3M8 20l4-3 4 3" />,
  },
  {
    match: /spa|massage|wellness/i,
    label: "Spa",
    icon: (
      <>
        <path d="M12 21c-5 0-9-3-9-8 3 0 5 1 6.5 2.5C10 12 11 7 12 3c1 4 2 9 2.5 12.5C16 14 18 13 21 13c0 5-4 8-9 8Z" />
      </>
    ),
  },
  {
    match: /24[- ]?hour|security|reception/i,
    label: "24-hour service",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
];

export function FacilityIcons({ facilities }: { facilities: string[] }) {
  const seen = new Set<string>();
  const matched: { label: string; icon: ReactNode }[] = [];
  for (const f of facilities) {
    for (const def of ICONS) {
      if (def.match.test(f) && !seen.has(def.label)) {
        seen.add(def.label);
        matched.push({ label: def.label, icon: def.icon });
        break;
      }
    }
    if (matched.length >= 8) break;
  }
  if (matched.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {matched.map((m) => (
        <span key={m.label} className="flex items-center gap-2 text-sm text-ink">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-brand"
          >
            {m.icon}
          </svg>
          {m.label}
        </span>
      ))}
    </div>
  );
}
