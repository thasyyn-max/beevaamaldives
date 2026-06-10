import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-xl font-extrabold tracking-tight text-teal-600">
            beevaa
          </span>
          <span className="hidden text-xs font-medium text-slate-500 sm:inline">
            · stay local in the Maldives
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            href="/search"
            className="rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            Stays
          </Link>
          <Link
            href="/#islands"
            className="rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            Islands
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-teal-600 px-3.5 py-1.5 text-white hover:bg-teal-700"
          >
            Owner login
          </Link>
        </nav>
      </div>
    </header>
  );
}
