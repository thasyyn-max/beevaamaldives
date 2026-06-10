"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  addPropertyPhoto,
  deletePropertyPhoto,
  movePropertyPhoto,
} from "@/app/admin/actions";

export function PropertyPhotos({
  propertyId,
  gallery,
}: {
  propertyId: string;
  gallery: string[];
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      const signRes = await fetch("/api/admin/photos/sign", { method: "POST" });
      const sign = await signRes.json();
      if (!signRes.ok) throw new Error(sign.error ?? "Could not sign upload");
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", sign.apiKey);
        fd.append("timestamp", String(sign.timestamp));
        fd.append("folder", sign.folder);
        fd.append("signature", sign.signature);
        const up = await fetch(
          `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
          { method: "POST", body: fd }
        ).then((r) => r.json());
        if (!up.secure_url) throw new Error(up.error?.message ?? "Upload failed");
        await addPropertyPhoto({ propertyId, url: up.secure_url });
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function addUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    setBusy(true);
    setError(null);
    try {
      await addPropertyPhoto({ propertyId, url: url.trim() });
      setUrl("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add");
    } finally {
      setBusy(false);
    }
  }

  const btn =
    "rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-bold text-ink shadow hover:bg-white";

  return (
    <div className="space-y-3">
      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {gallery.map((src, i) => (
            <div key={src + i} className="group relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-24 w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Cover
                </span>
              )}
              <div className="absolute bottom-1 right-1 flex gap-1">
                <form action={movePropertyPhoto}>
                  <input type="hidden" name="property_id" value={propertyId} />
                  <input type="hidden" name="url" value={src} />
                  <input type="hidden" name="direction" value="up" />
                  <button className={btn} title="Move earlier">←</button>
                </form>
                <form action={movePropertyPhoto}>
                  <input type="hidden" name="property_id" value={propertyId} />
                  <input type="hidden" name="url" value={src} />
                  <input type="hidden" name="direction" value="down" />
                  <button className={btn} title="Move later">→</button>
                </form>
                <form action={deletePropertyPhoto}>
                  <input type="hidden" name="property_id" value={propertyId} />
                  <input type="hidden" name="url" value={src} />
                  <button className={`${btn} text-red-600`} title="Delete">✕</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted">No photos yet. The first photo is the cover.</p>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          uploadFiles(e.dataTransfer.files);
        }}
        className="rounded-xl border-2 border-dashed border-line p-4 text-center"
      >
        <p className="text-xs text-muted">{busy ? "Working…" : "Drag photos here, or"}</p>
        <button
          type="button"
          disabled={busy}
          onClick={() => fileInput.current?.click()}
          className="mt-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white hover:bg-brand disabled:opacity-60"
        >
          Choose files
        </button>
        <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => uploadFiles(e.target.files)} />
        <p className="mt-1 text-[11px] text-muted">Uploads need Cloudinary configured (see SETUP.md)</p>
      </div>

      <form onSubmit={addUrl} className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="…or paste an image URL (https://… or /import/…)"
          className="flex-1 rounded-lg border border-line px-3 py-1.5 text-xs outline-none focus:border-brand"
        />
        <button disabled={busy || !url} className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-muted hover:bg-surface disabled:opacity-50">
          Add
        </button>
      </form>
      {error && <p className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
