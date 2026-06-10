import "server-only";
import { Resend } from "resend";
import {
  CONTACT,
  isResendConfigured,
  SITE_NAME,
  SITE_URL,
} from "./config";
import type { Enquiry } from "./types";

const FROM = process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`;

function summary(e: Enquiry): string {
  return [
    `Reference: ${e.reference}`,
    e.property_name ? `Property: ${e.property_name}` : "General enquiry",
    e.check_in ? `Dates: ${e.check_in} → ${e.check_out ?? "?"}` : "",
    `Guests: ${e.guests}`,
    `Guest: ${e.guest_name} · ${e.guest_email} · ${e.guest_phone} (${e.guest_country})`,
    e.message ? `Message: ${e.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Notifies the team + acknowledges the guest. Never blocks the enquiry. */
export async function sendEnquiryEmails(enquiry: Enquiry) {
  if (!isResendConfigured()) {
    console.log("[email skipped — RESEND_API_KEY/ADMIN_EMAIL not set]");
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const adminEmail = process.env.ADMIN_EMAIL!;
  const body = summary(enquiry);

  const results = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: `New enquiry ${enquiry.reference}${
        enquiry.property_name ? ` — ${enquiry.property_name}` : ""
      }`,
      text: `A new enquiry just came in.\n\n${body}\n\nReply in the admin panel: ${SITE_URL}/admin/enquiries`,
    }),
    resend.emails.send({
      from: FROM,
      to: enquiry.guest_email,
      subject: `We received your enquiry — ${enquiry.reference}`,
      text: `Dear ${enquiry.guest_name},\n\nThank you for your enquiry with ${SITE_NAME}. Our team will get back to you within 24 hours with availability and a tailored quote.\n\n${body}\n\nIn a hurry? Message us on WhatsApp: https://wa.me/${CONTACT.whatsapp}\n\n${SITE_NAME}\n${CONTACT.phone} · ${CONTACT.email}`,
    }),
  ]);
  for (const r of results) {
    if (r.status === "rejected") console.error("[email]", r.reason);
  }
}

export async function sendEnquiryReplyEmail(enquiry: Enquiry, reply: string) {
  if (!isResendConfigured()) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: FROM,
      to: enquiry.guest_email,
      subject: `Re: your Maldives enquiry — ${enquiry.reference}`,
      text: `Dear ${enquiry.guest_name},\n\n${reply}\n\n— ${SITE_NAME}\n${CONTACT.phone} · ${CONTACT.email}`,
    });
  } catch (e) {
    console.error("[email]", e);
  }
}
