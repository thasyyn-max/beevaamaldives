import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/Prose";
import { getArticleBySlug } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const a = await getArticleBySlug((await params).slug);
  return { title: a ? a.title : "Guide" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/guide" className="hover:text-ink">
          ← Maldives Guide
        </Link>
      </nav>
      <h1 className="font-display text-4xl font-medium leading-tight">
        {article.title}
      </h1>
      {article.images[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.images[0]}
          alt={article.title}
          className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover"
        />
      )}
      <div className="mt-8">
        <Prose text={article.body} />
      </div>

      {article.images.length > 1 && (
        <div className="mt-8 grid grid-cols-2 gap-3">
          {article.images.slice(1).map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl bg-surface p-6 text-center">
        <p className="font-display text-xl font-medium">Ready to go?</p>
        <Link
          href="/enquire"
          className="mt-3 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand"
        >
          Plan my Maldives trip
        </Link>
      </div>
    </article>
  );
}
