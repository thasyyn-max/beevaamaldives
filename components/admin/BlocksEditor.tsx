"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { deleteBlock, moveBlock, saveBlock } from "@/app/admin/actions";
import type { ContentBlock } from "@/lib/types";

/**
 * Add / edit / remove / reorder rooms ("accommodations") or dining venues
 * for a property. Each block = { title, description, image }.
 */
export function BlocksEditor({
  propertyId,
  field,
  blocks,
  noun, // e.g. "room" / "venue"
}: {
  propertyId: string;
  field: "accommodations" | "dining";
  blocks: ContentBlock[];
  noun: string;
}) {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null); // -1 = add new
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setOpenIndex(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <p className="text-xs text-muted">No {noun}s yet — add the first one below.</p>
      )}
      {blocks.map((b, i) => (
        <div key={i} className="rounded-xl border border-line bg-bg">
          <div className="flex items-center gap-3 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.image || "/import/about/about_image_001.jpg"}
              alt=""
              className="h-12 w-16 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink">{b.title}</div>
              <div className="truncate text-xs text-muted">{b.description}</div>
            </div>
            <div className="flex shrink-0 gap-1.5 text-xs font-bold">
              <button
                disabled={busy || i === 0}
                onClick={() => run(() => moveBlock({ propertyId, field, index: i, direction: "up" }))}
                className="rounded border border-line px-2 py-1 text-muted hover:bg-surface disabled:opacity-30"
                title="Move up"
              >↑</button>
              <button
                disabled={busy || i === blocks.length - 1}
                onClick={() => run(() => moveBlock({ propertyId, field, index: i, direction: "down" }))}
                className="rounded border border-line px-2 py-1 text-muted hover:bg-surface disabled:opacity-30"
                title="Move down"
              >↓</button>
              <button
                disabled={busy}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="rounded border border-line px-2.5 py-1 text-ink hover:bg-surface"
              >
                {openIndex === i ? "Close" : "Edit"}
              </button>
              <button
                disabled={busy}
                onClick={() => {
                  if (confirm(`Delete "${b.title}"?`))
                    run(() => deleteBlock({ propertyId, field, index: i }));
                }}
                className="rounded border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50"
              >✕</button>
            </div>
          </div>
          {openIndex === i && (
            <BlockForm
              key={`edit-${i}`}
              initial={b}
              busy={busy}
              submitLabel={`Save ${noun}`}
              onSubmit={(v) => run(() => saveBlock({ propertyId, field, index: i, ...v }))}
            />
          )}
        </div>
      ))}

      {openIndex === -1 ? (
        <div className="rounded-xl border border-brand/40 bg-bg">
          <div className="flex items-center justify-between p-3 pb-0">
            <span className="text-sm font-semibold text-ink">New {noun}</span>
            <button onClick={() => setOpenIndex(null)} className="text-xs font-bold text-muted">
              Cancel
            </button>
          </div>
          <BlockForm
            key="add"
            initial={{ title: "", description: "", image: "" }}
            busy={busy}
            submitLabel={`Add ${noun}`}
            onSubmit={(v) => run(() => saveBlock({ propertyId, field, index: -1, ...v }))}
          />
        </div>
      ) : (
        <button
          onClick={() => setOpenIndex(-1)}
          className="rounded-lg bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-brand"
        >
          + Add {noun}
        </button>
      )}
      {error && <p className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}

function BlockForm({
  initial,
  busy,
  submitLabel,
  onSubmit,
}: {
  initial: ContentBlock | { title: string; description: string; image: string };
  busy: boolean;
  submitLabel: string;
  onSubmit: (v: { title: string; description: string; image: string }) => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [image, setImage] = useState(initial.image);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const signRes = await fetch("/api/admin/photos/sign", { method: "POST" });
      const sign = await signRes.json();
      if (!signRes.ok) throw new Error(sign.error ?? "Could not sign upload");
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
      setImage(up.secure_url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const field =
    "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand";
  const label = "mb-1 block text-xs font-semibold text-muted";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, description, image });
      }}
      className="space-y-3 border-t border-line p-3"
    >
      <div>
        <label className={label}>Name *</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={field} placeholder="Deluxe Beach Villa" />
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={field} />
      </div>
      <div>
        <label className={label}>Photo</label>
        <div className="flex items-center gap-2">
          {image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
          )}
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className={`${field} flex-1`}
            placeholder="https://… or /import/… (or upload →)"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className="shrink-0 rounded-lg border border-line px-3 py-2 text-xs font-bold text-muted hover:bg-surface disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files)} />
        </div>
        {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
      </div>
      <button
        disabled={busy || uploading}
        className="rounded-lg bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-brand disabled:opacity-60"
      >
        {busy ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
