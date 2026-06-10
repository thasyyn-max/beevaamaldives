"use client";

import { useState } from "react";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (images.length === 0) return null;
  const main = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="block w-full"
        aria-label="Open photo"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main}
          alt={name}
          className="aspect-[16/10] w-full rounded-2xl object-cover sm:aspect-[16/9]"
        />
      </button>
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
              className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-16 w-24 object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={main}
            alt={name}
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
          />
          <button
            type="button"
            className="absolute right-5 top-5 text-2xl text-white/80 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
