"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <>
        <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <path d="M9 22V12h6v10" />
      </>
    ),
  },
  {
    href: "/category/resorts",
    label: "Resort",
    icon: (
      <>
        <path d="M22 12a10.06 10.06 0 0 0-20 0Z" />
        <path d="M12 12v8a2 2 0 0 0 4 0" />
        <path d="M12 2v1" />
      </>
    ),
  },
  {
    href: "/category/safari",
    label: "Safari",
    icon: (
      <>
        <path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" />
        <path d="M21 14 10 2 3 14h18Z" />
        <path d="M10 2v16" />
      </>
    ),
  },
  {
    href: "/category/guesthouses",
    label: "Guesthouse",
    icon: (
      <>
        <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
        <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
        <path d="M2 17h20" />
      </>
    ),
  },
  {
    href: "/explore",
    label: "Explore",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m16.2 7.8-2 6.3-6.4 2.1 2-6.3z" />
      </>
    ),
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-line bg-white/90 shadow-lg shadow-ink/10 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition ${
                active ? "text-brand" : "text-muted"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={active ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
