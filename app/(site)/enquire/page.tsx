import type { Metadata } from "next";
import { Suspense } from "react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CONTACT } from "@/lib/config";
import { getPropertyBySlug } from "@/lib/data";

export const metadata: Metadata = { title: "Enquire" };

export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  const { property } = await searchParams;
  const selected = property ? await getPropertyBySlug(property) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-medium">Plan your trip</h1>
          <p className="mt-3 max-w-md text-muted">
            Share a few details and our local team will reply within 24 hours
            with availability, the best rates and a tailored Maldives itinerary.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            {[
              "No prepayment to enquire",
              "Honest local advice on islands & transfers",
              "Resorts, safari boats & guesthouses",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="text-brand">✓</span> {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl bg-surface p-5 text-sm">
            <div className="font-semibold text-ink">Prefer to talk?</div>
            <p className="mt-1 text-muted">
              WhatsApp / call{" "}
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="font-semibold text-ink">
                {CONTACT.phone}
              </a>{" "}
              · {CONTACT.email}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-line p-5 sm:p-7">
          <Suspense>
            <EnquiryForm
              propertyId={selected?.id}
              propertyName={selected?.name}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
