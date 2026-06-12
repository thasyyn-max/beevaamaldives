"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FacilityIcons } from "@/components/FacilityIcons";
import { Prose } from "@/components/Prose";
import type { ContentBlock } from "@/lib/types";

/**
 * Two-tab section for a property: selectable rooms (→ enquiry) and
 * what's included. Deliberately minimal — no long descriptions.
 */
export function PropertyTabs({
  propertySlug,
  roomsLabel,
  rooms,
  includes,
  tags = [],
  about = "",
}: {
  propertySlug: string;
  roomsLabel: string;
  rooms: ContentBlock[];
  includes: string[];
  tags?: string[];
  about?: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"rooms" | "includes">("rooms");
  const [selected, setSelected] = useState<string[]>([]);
  const [aboutOpen, setAboutOpen] = useState(false);

  const toggle = (title: string) =>
    setSelected((s) =>
      s.includes(title) ? s.filter((t) => t !== title) : [...s, title]
    );

  function sendEnquiry() {
    const q = new URLSearchParams({ property: propertySlug });
    if (selected.length) q.set("rooms", selected.join(", "));
    router.push(`/enquire?${q.toString()}`);
  }

  const tabBtn = (active: boolean) =>
    `rounded-full px-5 py-2.5 text-sm font-semibold transition ${
      active ? "bg-ink text-white" : "text-muted hover:text-ink"
    }`;

  return (
    <section>
      <div className="inline-flex rounded-full border border-line bg-surface p-1">
        <button type="button" onClick={() => setTab("rooms")} className={tabBtn(tab === "rooms")}>
          {roomsLabel}
        </button>
        <button type="button" onClick={() => setTab("includes")} className={tabBtn(tab === "includes")}>
          Includes
        </button>
      </div>

      {tab === "rooms" && (
        <div className="mt-5">
          {rooms.length === 0 && (
            <p className="text-sm text-muted">Room details on request — send an enquiry.</p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {rooms.map((r) => {
              const active = selected.includes(r.title);
              return (
                <button
                  key={r.title}
                  type="button"
                  onClick={() => toggle(r.title)}
                  aria-pressed={active}
                  className={`relative flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                    active ? "border-brand bg-brand-50" : "border-line hover:border-brand/50"
                  }`}
                >
                  {r.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={r.image}
                      alt={r.title}
                      loading="lazy"
                      className="h-16 w-24 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink">{r.title}</div>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted">
                      {r.beds && <span>🛏 {r.beds}</span>}
                      {r.sleeps && <span>👤 sleeps {r.sleeps}</span>}
                    </div>
                  </div>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-line text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={sendEnquiry}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand"
            >
              Send enquiry
              {selected.length > 0 &&
                ` · ${selected.length} room${selected.length > 1 ? "s" : ""}`}
            </button>
            <span className="text-xs text-muted">
              {selected.length === 0
                ? "Select rooms (optional) — we confirm availability & price."
                : selected.join(" · ")}
            </span>
          </div>
        </div>
      )}

      {tab === "includes" && (
        <div className="mt-5 space-y-6">
          {includes.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface/60 p-4">
              <FacilityIcons facilities={includes} />
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-ink"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm text-ink sm:grid-cols-2 lg:grid-cols-3">
            {includes.length === 0 && (
              <li className="text-muted">Details on request.</li>
            )}
            {includes.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-0.5 text-brand">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {about && (
            <div>
              <button
                type="button"
                onClick={() => setAboutOpen((o) => !o)}
                aria-expanded={aboutOpen}
                className="flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-ink"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px] font-bold">
                  i
                </span>
                About this property
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={`h-3.5 w-3.5 transition ${aboutOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {aboutOpen && (
                <div className="mt-3 text-sm">
                  <Prose text={about} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
