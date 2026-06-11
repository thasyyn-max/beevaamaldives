"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type IndexProperty = {
  name: string;
  slug: string;
  category: string;
  atoll: string;
  tags: string[];
  cover: string;
  price: number | null;
};
type IndexArticle = { title: string; slug: string };
type Index = { properties: IndexProperty[]; articles: IndexArticle[] };

const CATEGORY_LABEL: Record<string, string> = {
  resorts: "Resort",
  safari: "Safari",
  guesthouses: "Guesthouse",
};

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<Index | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Close on navigation
  useEffect(() => {
    setOpen(false);
    setQ("");
  }, [pathname]);

  // Load the index once when first opened; focus the input.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (!index) {
      fetch("/api/search-index")
        .then((r) => r.json())
        .then(setIndex)
        .catch(() => {});
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index]);

  const needle = q.trim().toLowerCase();
  const words = needle.split(/\s+/).filter(Boolean);
  const matches = (hay: string) => words.every((w) => hay.includes(w));

  const props =
    needle && index
      ? index.properties
          .filter((p) =>
            matches(
              `${p.name} ${p.atoll} ${p.category} ${CATEGORY_LABEL[p.category] ?? ""} ${p.tags.join(" ")}`.toLowerCase()
            )
          )
          .slice(0, 8)
      : [];
  const arts =
    needle && index
      ? index.articles
          .filter((a) => matches(a.title.toLowerCase()))
          .slice(0, 4)
      : [];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-brand hover:text-brand"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4.5 w-4.5">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="mx-auto mt-16 w-[min(40rem,calc(100%-2rem))] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4 shrink-0 text-muted">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search stays, islands, diving, surfing…"
                className="w-full bg-transparent py-4 text-base text-ink outline-none placeholder:text-muted"
              />
              <button onClick={() => setOpen(false)} className="text-xs font-bold text-muted hover:text-ink">
                ESC
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!needle && (
                <p className="px-3 py-6 text-center text-sm text-muted">
                  Try “Maafushi”, “diving”, “honeymoon” or a property name.
                </p>
              )}
              {needle && index && props.length === 0 && arts.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted">
                  No matches for “{q}” — try an island, activity or property name.
                </p>
              )}

              {props.length > 0 && (
                <>
                  <div className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-muted">
                    Stays
                  </div>
                  {props.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/property/${p.slug}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-brand-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover} alt="" className="h-11 w-14 shrink-0 rounded-lg object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-ink">{p.name}</div>
                        <div className="truncate text-xs text-muted">
                          {CATEGORY_LABEL[p.category] ?? p.category} · {p.atoll}
                        </div>
                      </div>
                      {p.price ? (
                        <div className="shrink-0 text-xs font-semibold text-ink">from ${p.price}</div>
                      ) : null}
                    </Link>
                  ))}
                </>
              )}

              {arts.length > 0 && (
                <>
                  <div className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                    Explore & guide
                  </div>
                  {arts.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/guide/${a.slug}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-ink transition hover:bg-brand-50"
                    >
                      <span className="text-muted">📍</span> {a.title}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
