"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Booking.com-style photo grid: one hero image + four tiles with a
 * "+N photos" overlay, opening a lightbox with ←/→ navigation.
 */
export function GalleryGrid({ images, name }: { images: string[]; name: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const show = useCallback(
    (delta: number) => {
      setLightbox((cur) =>
        cur === null ? null : (cur + delta + images.length) % images.length
      );
    },
    [images.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") show(-1);
      if (e.key === "ArrowRight") show(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, show]);

  if (images.length === 0) return null;
  const tiles = images.slice(1, 5);
  const remaining = images.length - 5;

  return (
    <>
      {/* Mobile: single hero with count badge */}
      <button
        type="button"
        onClick={() => setLightbox(0)}
        className="relative block w-full overflow-hidden rounded-2xl sm:hidden"
        aria-label="Open photos"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0]} alt={name} className="aspect-[16/10] w-full object-cover" />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            1 / {images.length} photos
          </span>
        )}
      </button>

      {/* Desktop / tablet: hero + 2x2 grid */}
      <div className="hidden gap-2 sm:grid sm:grid-cols-4 sm:grid-rows-2">
        <button
          type="button"
          onClick={() => setLightbox(0)}
          className="col-span-2 row-span-2 overflow-hidden rounded-l-2xl"
          aria-label="Photo 1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={name}
            className="h-full w-full object-cover transition duration-300 hover:brightness-95"
          />
        </button>
        {tiles.map((src, i) => {
          const isLast = i === tiles.length - 1;
          return (
            <button
              key={src + i}
              type="button"
              onClick={() => setLightbox(i + 1)}
              className={`relative h-full overflow-hidden ${
                i === 1 ? "rounded-tr-2xl" : ""
              } ${isLast ? "rounded-br-2xl" : ""}`}
              aria-label={`Photo ${i + 2}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover transition duration-300 hover:brightness-95"
              />
              {isLast && remaining > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-sm font-bold text-white">
                  +{remaining} photos
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95"
          onClick={() => setLightbox(null)}
        >
          <div className="flex items-center justify-between p-4 text-white/90">
            <span className="text-sm font-semibold">
              {lightbox + 1} / {images.length} · {name}
            </span>
            <button className="text-xl hover:text-white" aria-label="Close">✕</button>
          </div>
          <div
            className="relative flex flex-1 items-center justify-center px-12 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightbox]}
              alt={`${name} photo ${lightbox + 1}`}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => show(-1)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-xl text-white backdrop-blur transition hover:bg-white/25"
                >
                  ←
                </button>
                <button
                  onClick={() => show(1)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-xl text-white backdrop-blur transition hover:bg-white/25"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
