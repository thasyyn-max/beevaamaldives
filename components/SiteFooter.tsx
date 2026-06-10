import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="text-lg font-extrabold text-teal-600">beevaa</div>
          <p className="mt-2 text-sm text-slate-600">
            Guesthouses and local islands of the Maldives. Real islands, local
            hosts, paradise prices.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-slate-900">Explore</div>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li>
              <Link href="/search" className="hover:text-teal-700">
                All guesthouses
              </Link>
            </li>
            <li>
              <Link href="/#islands" className="hover:text-teal-700">
                Local islands
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-slate-900">Guesthouse owners</div>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li>
              <Link href="/admin" className="hover:text-teal-700">
                Manage your listing
              </Link>
            </li>
            <li>
              <a href="mailto:hello@beevaa.com" className="hover:text-teal-700">
                List your property
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Beevaa · Made in the Maldives 🇲🇻
      </div>
    </footer>
  );
}
