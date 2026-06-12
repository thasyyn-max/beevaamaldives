"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  addHeroSlide,
  deleteHeroSlide,
  moveHeroSlide,
} from "@/app/admin/actions";
import type { HeroSlide } from "@/lib/types";

export function HeroSlidesManager({ slides }: { slides: HeroSlide[] }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  async function upload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video");
    if (isVideo && file.size > 95 * 1024 * 1024) {
      setError("Video too large (max ~95MB). Trim it to 10–15 seconds.");
      return;
    }
    await run(async () => {
      setProgress(isVideo ? "Uploading video… this can take a minute" : "Uploading…");
      const signRes = await fetch("/api/admin/photos/sign", { method: "POST" });
      const sign = await signRes.json();
      if (!signRes.ok) throw new Error(sign.error ?? "Could not sign upload");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sign.apiKey);
      fd.append("timestamp", String(sign.timestamp));
      fd.append("folder", sign.folder);
      fd.append("signature", sign.signature);
      const endpoint = `https://api.cloudinary.com/v1_1/${sign.cloudName}/${
        isVideo ? "video" : "image"
      }/upload`;
      const up = await fetch(endpoint, { method: "POST", body: fd }).then((r) =>
        r.json()
      );
      if (!up.secure_url) throw new Error(up.error?.message ?? "Upload failed");
      await addHeroSlide({
        kind: isVideo ? "video" : "image",
        url: up.secure_url,
      });
      if (fileInput.current) fileInput.current.value = "";
    });
  }

  async function addByUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
    await run(async () => {
      await addHeroSlide({ kind: isVideo ? "video" : "image", url: url.trim() });
      setUrl("");
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {slides.length === 0 && (
          <p className="text-sm text-muted">
            No slides yet — the site shows the default photos until you add
            some (up to 5).
          </p>
        )}
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="flex items-center gap-3 rounded-xl border border-line bg-bg p-3"
          >
            {s.kind === "video" ? (
              <video
                src={s.url}
                muted
                playsInline
                preload="metadata"
                className="h-14 w-24 shrink-0 rounded-lg object-cover"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={s.url} alt="" className="h-14 w-24 shrink-0 rounded-lg object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                  s.kind === "video"
                    ? "bg-brand-50 text-brand"
                    : "bg-surface text-muted"
                }`}
              >
                {s.kind}
              </span>
              <div className="mt-1 truncate text-xs text-muted">{s.url}</div>
            </div>
            <div className="flex shrink-0 gap-1.5 text-xs font-bold">
              <button
                disabled={busy || i === 0}
                onClick={() => run(() => moveHeroSlide(s.id, "up"))}
                className="rounded border border-line px-2 py-1 text-muted hover:bg-surface disabled:opacity-30"
              >↑</button>
              <button
                disabled={busy || i === slides.length - 1}
                onClick={() => run(() => moveHeroSlide(s.id, "down"))}
                className="rounded border border-line px-2 py-1 text-muted hover:bg-surface disabled:opacity-30"
              >↓</button>
              <button
                disabled={busy}
                onClick={() => {
                  if (confirm("Delete this slide?")) run(() => deleteHeroSlide(s.id));
                }}
                className="rounded border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50"
              >✕</button>
            </div>
          </div>
        ))}
      </div>

      {slides.length < 5 && (
        <>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              upload(e.dataTransfer.files);
            }}
            className="rounded-xl border-2 border-dashed border-line p-5 text-center"
          >
            <p className="text-xs text-muted">
              {busy ? progress || "Working…" : "Drag a photo or short video (10–15s) here, or"}
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => fileInput.current?.click()}
              className="mt-2 rounded-lg bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-brand disabled:opacity-60"
            >
              Choose file
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              hidden
              onChange={(e) => upload(e.target.files)}
            />
            <p className="mt-2 text-[11px] text-muted">
              Videos are auto-compressed for fast loading. Uploads need
              Cloudinary configured (see SETUP.md).
            </p>
          </div>
          <form onSubmit={addByUrl} className="flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="…or paste an image/video URL (https://… or /import/…)"
              className="flex-1 rounded-lg border border-line px-3 py-1.5 text-xs outline-none focus:border-brand"
            />
            <button
              disabled={busy || !url}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-muted hover:bg-surface disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </>
      )}
      {error && <p className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
