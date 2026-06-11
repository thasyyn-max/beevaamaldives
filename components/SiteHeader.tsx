import Link from "next/link";
import { Logo } from "./Logo";
import { SearchOverlay } from "./SearchOverlay";

const NAV = [
  { href: "/category/resorts", label: "Resort" },
  { href: "/category/safari", label: "Safari" },
  { href: "/category/guesthouses", label: "Guesthouse" },
];

const EXPLORE = [
  { href: "/guide/shipwreck", label: "Shipwrecks" },
  { href: "/guide/surfing-spots", label: "Surfing Points" },
  { href: "/guide/diving-spots", label: "Diving Points" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition hover:text-ink">
              {n.label}
            </Link>
          ))}
          {/* Explore dropdown */}
          <div className="group relative">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 transition hover:text-ink"
            >
              Explore
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-3.5 w-3.5 transition group-hover:rotate-180"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link>
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="w-48 rounded-2xl border border-line bg-white p-2 shadow-lg shadow-ink/10">
                {EXPLORE.map((e) => (
                  <Link
                    key={e.href}
                    href={e.href}
                    className="block rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-brand-50 hover:text-brand"
                  >
                    {e.label}
                  </Link>
                ))}
                <Link
                  href="/explore"
                  className="mt-1 block rounded-xl border-t border-line px-3 py-2 text-xs font-semibold text-muted transition hover:text-brand"
                >
                  All experiences →
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex items-center gap-2">
          <SearchOverlay />
          <Link
            href="/enquire"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand"
          >
            Plan your trip
          </Link>
        </div>
      </div>
    </header>
  );
}
