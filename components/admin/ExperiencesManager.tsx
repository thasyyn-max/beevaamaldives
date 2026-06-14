"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { saveExperience } from "@/app/admin/actions";
import { EXPERIENCES } from "@/lib/experiences";

type Article = {
  slug: string;
  title: string;
  body: string;
  images: string[];
};

export function ExperiencesManager({ articles }: { articles: Article[] }) {
  return (
    <div className="space-y-4">
      {EXPERIENCES.map((exp) => {
        const article = articles.find((a) => a.slug === exp.slug);
        return (
          <ExperienceCard
            key={exp.slug}
            slug={exp.slug}
            label={exp.label}
            title={article?.title ?? exp.label}
            image={article?.images?.[0] ?? ""}
            description={article?.body ?? ""}
          />
        );
      })}
    </div>
  );
}

function ExperienceCard({
  slug,
  label,
  title: initTitle,
  image: initImage,
  description: initDesc,
}: {
  slug: string;
  label: string;
  title: string;
  image: string;
  description: string;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initTitle);
  const [image, setImage] = useState(initImage);
  const [description, setDescription] = useState(initDesc);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const sign = await fetch("/api/admin/photos/sign", { method: "POST" }).then((r) => r.json());
      if (sign.error) throw new Error(sign.error);
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
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function save() {
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      await saveExperience({ slug, title, image, description });
      setMsg("Saved ✓");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand";
  const labelCls = "mb-1 block text-xs font-semibold text-muted";

  return (
    <div className="rounded-2xl border border-line bg-bg p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand">
          {label}
        </span>
        <span className="text-xs text-muted">/explore · /guide/{slug}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <div>
          <label className={labelCls}>Photo</label>
          {image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={image} alt="" className="aspect-[3/4] w-full rounded-xl object-cover" />
          ) : (
            <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl border border-dashed border-line text-xs text-muted">
              No photo
            </div>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => fileInput.current?.click()}
            className="mt-2 w-full rounded-lg border border-line py-1.5 text-xs font-bold text-muted hover:bg-surface disabled:opacity-50"
          >
            {busy ? "Working…" : "Upload photo"}
          </button>
          <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files)} />
        </div>

        <div className="space-y-3">
          <div>
            <label className={labelCls}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
          </div>
          <div>
            <label className={labelCls}>Photo URL (or upload on the left)</label>
            <input value={image} onChange={(e) => setImage(e.target.value)} className={field} placeholder="https://… or /import/…" />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={field} />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="rounded-lg bg-ink px-5 py-2 text-xs font-bold text-white hover:bg-brand disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save"}
            </button>
            {msg && <span className="text-xs font-semibold text-emerald-600">{msg}</span>}
            {error && <span className="text-xs text-red-600">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
