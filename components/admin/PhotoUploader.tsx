"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { addPhotoRecord } from "@/app/admin/actions";

export function PhotoUploader({
  guesthouseId,
  roomId,
  defaultAlt,
}: {
  guesthouseId?: string;
  roomId?: string;
  defaultAlt: string;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlValue, setUrlValue] = useState("");

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const signRes = await fetch("/api/admin/photos/sign", { method: "POST" });
      const sign = await signRes.json();
      if (!signRes.ok) throw new Error(sign.error ?? "Could not sign upload");

      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", sign.apiKey);
        form.append("timestamp", String(sign.timestamp));
        form.append("folder", sign.folder);
        form.append("signature", sign.signature);
        const upRes = await fetch(
          `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
          { method: "POST", body: form }
        );
        const up = await upRes.json();
        if (!upRes.ok) throw new Error(up.error?.message ?? "Upload failed");
        await addPhotoRecord({
          guesthouseId,
          roomId,
          url: up.secure_url,
          alt: defaultAlt,
        });
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function addByUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!urlValue) return;
    setBusy(true);
    setError(null);
    try {
      await addPhotoRecord({
        guesthouseId,
        roomId,
        url: urlValue.trim(),
        alt: defaultAlt,
      });
      setUrlValue("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add photo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          uploadFiles(e.dataTransfer.files);
        }}
        className="rounded-xl border-2 border-dashed border-slate-300 p-4 text-center"
      >
        <p className="text-xs text-slate-500">
          {busy ? "Uploading…" : "Drag photos here, or"}
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => fileInput.current?.click()}
          className="mt-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          Choose files
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>
      <form onSubmit={addByUrl} className="flex gap-2">
        <input
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          placeholder="…or paste an image URL (https://…)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-teal-500"
        />
        <button
          disabled={busy || !urlValue}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && (
        <p className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</p>
      )}
    </div>
  );
}
