import Link from "next/link";
import { Logo } from "./Logo";

const NAV = [
  { href: "/category/resorts", label: "Resort" },
  { href: "/category/safari", label: "Safari" },
  { href: "/category/guesthouses", label: "Guesthouse" },
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
        </nav>
        <div className="flex items-center gap-2">
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
