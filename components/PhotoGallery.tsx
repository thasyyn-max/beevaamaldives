"use client";

import { useState } from "react";
import type { Photo } from "@/lib/types";

export function PhotoGallery({ photos, name }: { photos: Photo[]; name: string }) {
  const [active, setActive] = useState(0);
  if (photos.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
        No photos yet
      </div>
    );
  }
  const main = photos[Math.min(active, photos.length - 1)];
  return (
    <div className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={main.url}
        alt={main.alt || name}
        className="h-56 w-full rounded-2xl object-cover sm:h-80 lg:h-96"
      />
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active ? "border-teal-500" : "border-transparent opacity-80"
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.alt || name}
                className="h-16 w-24 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
