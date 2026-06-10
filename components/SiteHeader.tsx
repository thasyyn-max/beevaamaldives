import Link from "next/link";
import { Logo } from "./Logo";

const NAV = [
  { href: "/category/resorts", label: "Resorts" },
  { href: "/category/liveaboards", label: "Liveaboards" },
  { href: "/category/city-hotels", label: "City Hotels" },
  { href: "/guide", label: "Maldives Guide" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
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
            Enquire
          </Link>
        </div>
      </div>
      {/* mobile nav */}
      <div className="flex gap-5 overflow-x-auto border-t border-line px-4 py-2 text-sm font-medium text-muted no-scrollbar md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="whitespace-nowrap">
            {n.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
