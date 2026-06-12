"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/lib/types";

const INTERVAL_MS = 15000;

/** Cloudinary delivery optimization: keep videos ~1-3MB, posters light. */
function optimizedVideo(url: string) {
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/q_auto,vc_auto,w_1600/");
  }
  return url;
}
function videoPoster(slide: HeroSlide) {
  if (slide.poster) return slide.poster;
  if (slide.url.includes("res.cloudinary.com") && slide.url.includes("/upload/")) {
    return slide.url
      .replace("/upload/", "/upload/so_0,q_auto,w_1600/")
      .replace(/\.\w+(\?.*)?$/, ".jpg");
  }
  return "";
}

/**
 * Hero carousel: up to 5 slides (photos with slow zoom, or muted videos).
 * The first frame is always an <img> in the initial HTML so the page paints
 * instantly; videos mount lazily (active + next slide only).
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false); // becomes true client-side
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setStarted(true);
    if (slides.length < 2) return;
    timer.current = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      INTERVAL_MS
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [slides.length]);

  const goTo = (i: number) => {
    setActive(i);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      INTERVAL_MS
    );
  };

  const next = (active + 1) % slides.length;

  return (
    <div className="absolute inset-0">
      {slides.map((s, i) => {
        const isActive = i === active;
        // Mount videos only for the active and the upcoming slide.
        const mountVideo =
          s.kind === "video" && started && (isActive || i === next);
        const imgSrc = s.kind === "video" ? videoPoster(s) : s.url;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            {/* Poster/photo — always present, so slide 1 paints in initial HTML */}
            {imgSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imgSrc}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                className={`h-full w-full object-cover ${
                  s.kind === "image" && isActive && started ? "animate-kenburns" : ""
                }`}
              />
            )}
            {mountVideo && (
              <video
                src={optimizedVideo(s.url)}
                poster={videoPoster(s) || undefined}
                muted
                loop
                playsInline
                autoPlay={isActive}
                preload={isActive ? "auto" : "metadata"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        );
      })}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
