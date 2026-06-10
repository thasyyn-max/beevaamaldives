import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/config";
import { getEnquiryByReference } from "@/lib/data";

export const metadata: Metadata = { title: "Enquiry sent" };

export default async function EnquirySentPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const enquiry = await getEnquiryByReference(reference);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl text-brand">
        ✓
      </div>
      <h1 className="mt-5 font-display text-3xl font-medium">Enquiry sent!</h1>
      <p className="mt-3 text-muted">
        Your reference is{" "}
        <span className="rounded bg-surface px-2 py-0.5 font-mono font-semibold text-ink">
          {reference}
        </span>
        . Our team will reply within 24 hours
        {enquiry?.property_name ? ` about ${enquiry.property_name}` : ""}. Check
        your email (and spam folder).
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={`https://wa.me/${CONTACT.whatsapp}`}
          target="_blank"
          rel="noopener"
          className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"
        >
          Chat on WhatsApp
        </a>
        <Link
          href="/"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
