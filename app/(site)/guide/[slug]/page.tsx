import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AttractionsSection } from "@/components/AttractionsSection";
import { DiveGuide } from "@/components/DiveGuide";
import { Prose } from "@/components/Prose";
import { SurfGuide } from "@/components/SurfGuide";
import { WrecksSection } from "@/components/WrecksSection";
import { getArticleBySlug } from "@/lib/data";

const SURF_SLUG = "surfing-spots";
const DIVE_SLUG = "diving-spots";
const SHIPWRECK_SLUG = "shipwreck";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === SURF_SLUG) {
    return {
      title: "Surfing in the Maldives",
      description:
        "The complete Maldives surf guide — the best breaks atoll by atoll, when to go, how to read the forecast and how to get there.",
    };
  }
  if (slug === DIVE_SLUG) {
    return {
      title: "Diving in the Maldives",
      description:
        "The complete Maldives dive guide — the best dive sites atoll by atoll, marine life, and UNESCO biosphere reserves.",
    };
  }
  if (slug === SHIPWRECK_SLUG) {
    return {
      title: "Historic shipwrecks in the Maldives",
      description:
        "Dive the Maldives' historic shipwrecks — purpose-sunk cargo ships and a WWII oil tanker, now vibrant artificial reefs, atoll by atoll.",
    };
  }
  const a = await getArticleBySlug(slug);
  return { title: a ? a.title : "Guide" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // The surfing and diving guides are rich, self-contained pages (they render
  // regardless of whether the CMS/article row exists).
  if (slug === SURF_SLUG || slug === DIVE_SLUG) {
    return (
      <div>
        <nav className="mx-auto max-w-5xl px-4 pt-6 text-sm text-muted sm:px-6">
          <Link href="/explore" className="hover:text-ink">
            ← Explore
          </Link>
        </nav>
        {slug === SURF_SLUG ? <SurfGuide /> : <DiveGuide />}
      </div>
    );
  }

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/explore" className="hover:text-ink">
          ← Explore
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

      {slug === SHIPWRECK_SLUG && (
        <>
          <WrecksSection />
          <AttractionsSection />
        </>
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
