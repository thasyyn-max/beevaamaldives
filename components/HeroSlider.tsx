"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/lib/types";

const INTERVAL_MS = 15000;

// Ultimate poster fallback: a bundled banner that is always present, so the
// hero never paints fully black even if every Cloudinary URL fails.
const FALLBACK_IMG = "/import/banner/banner_image_003.jpg";

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
 * One hero layer (poster image + optional video), with its own fallback state.
 * If a Cloudinary *transformed* URL fails (e.g. the account has strict
 * transformations enabled), we fall back to the original uploaded file for the
 * video and to a bundled banner for the poster — so the slide never goes black.
 */
function HeroLayer({
  slide,
  isActive,
  isNext,
  started,
  eager,
}: {
  slide: HeroSlide;
  isActive: boolean;
  isNext: boolean;
  started: boolean;
  eager: boolean;
}) {
  const isVideo = slide.kind === "video";
  const initialImg = isVideo ? videoPoster(slide) : slide.url;

  const [imgSrc, setImgSrc] = useState(initialImg || FALLBACK_IMG);
  const [videoSrc, setVideoSrc] = useState(() => optimizedVideo(slide.url));
  const [videoDead, setVideoDead] = useState(false);

  // Mount videos only for the active and the upcoming slide.
  const mountVideo = isVideo && started && (isActive || isNext);

  return (
    <div
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
          loading={eager ? "eager" : "lazy"}
          onError={() => {
            if (imgSrc !== FALLBACK_IMG) setImgSrc(FALLBACK_IMG);
          }}
          className={`h-full w-full object-cover ${
            slide.kind === "image" && isActive && started ? "animate-kenburns" : ""
          }`}
        />
      )}
      {mountVideo && !videoDead && (
        <video
          // Remount on src change so the fallback source loads and autoplays.
          key={videoSrc}
          src={videoSrc}
          poster={videoPoster(slide) || undefined}
          muted
          loop
          playsInline
          autoPlay={isActive}
          preload={isActive ? "auto" : "metadata"}
          onError={() => {
            // The optimized (transformed) URL failed — try the original file;
            // if that also fails, give up and leave the poster showing.
            if (videoSrc !== slide.url) setVideoSrc(slide.url);
            else setVideoDead(true);
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
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
      {slides.map((s, i) => (
        <HeroLayer
          key={s.id}
          slide={s}
          isActive={i === active}
          isNext={i === next}
          started={started}
          eager={i === 0}
        />
      ))}

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
