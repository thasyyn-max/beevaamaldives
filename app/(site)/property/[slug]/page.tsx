import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { Prose } from "@/components/Prose";
import { CONTACT } from "@/lib/config";
import { getPropertyBySlug } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = await getPropertyBySlug((await params).slug);
  return { title: p ? p.name : "Property" };
}

const CATEGORY_LABEL: Record<string, string> = {
  resorts: "Resort",
  liveaboards: "Liveaboard",
  guesthouses: "Guesthouse",
};

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <nav className="mb-4 text-sm text-muted">
        <Link href={`/category/${p.category}`} className="hover:text-ink">
          {CATEGORY_LABEL[p.category] ?? p.category}
        </Link>{" "}
        <span className="px-1">/</span>
        <span className="text-ink">{p.name}</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium sm:text-4xl">{p.name}</h1>
          <p className="mt-1 text-muted">
            {p.atoll} · {CATEGORY_LABEL[p.category] ?? p.category}
          </p>
        </div>
        {p.from_price_usd && (
          <div className="text-right">
            <div className="text-xs text-muted">from</div>
            <div className="font-display text-2xl font-medium text-ink">
              ${p.from_price_usd}
              <span className="text-sm font-normal text-muted"> / night</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <Gallery images={p.gallery} name={p.name} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {p.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-ink"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <Prose text={p.description} />

          {p.facilities.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-medium">Facilities</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted sm:grid-cols-3">
                {p.facilities.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {p.accommodations.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-xl font-medium">
                {p.category === "liveaboards" ? "Cabins & rooms" : "Rooms & villas"}
              </h2>
              <div className="mt-4 space-y-4">
                {p.accommodations.map((a, i) => (
                  <div
                    key={i}
                    className="flex flex-col overflow-hidden rounded-2xl border border-line sm:flex-row"
                  >
                    {a.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.image}
                        alt={a.title}
                        loading="lazy"
                        className="h-44 w-full object-cover sm:h-auto sm:w-56 sm:shrink-0"
                      />
                    )}
                    <div className="p-5">
                      <h3 className="font-display text-lg font-medium">{a.title}</h3>
                      {a.description && (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">
                          {a.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {p.dining.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-xl font-medium">Dining</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {p.dining.map((d, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-line">
                    {d.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.image}
                        alt={d.title}
                        loading="lazy"
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-ink">{d.title}</h3>
                      {d.description && (
                        <p className="mt-1 text-sm leading-relaxed text-muted line-clamp-4">
                          {d.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky enquiry card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="font-display text-lg font-medium">
              Enquire about {p.name}
            </div>
            <p className="mt-1 text-sm text-muted">
              Tell us your dates — we reply within 24 hours with availability and
              a tailored quote. No prepayment.
            </p>
            <Link
              href={`/enquire?property=${p.slug}`}
              className="mt-4 block rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand"
            >
              Request a quote
            </Link>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
                `Hi Beevaa, I'm interested in ${p.name}.`
              )}`}
              target="_blank"
              rel="noopener"
              className="mt-2 block rounded-full border border-line px-5 py-3 text-center text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
            >
              Chat on WhatsApp
            </a>
            <div className="mt-4 border-t border-line pt-4 text-xs text-muted">
              Or call <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="font-semibold text-ink">{CONTACT.phone}</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
