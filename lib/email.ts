import "server-only";
import { Resend } from "resend";
import { isResendConfigured, SITE_NAME, SITE_URL } from "./config";
import type { Booking } from "./types";

const FROM =
  process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`;

function bookingSummary(b: Booking): string {
  return [
    `Reference: ${b.reference}`,
    `Guesthouse: ${b.guesthouse_name ?? ""} (${b.island_name ?? ""})`,
    `Room: ${b.room_name ?? ""}`,
    `Dates: ${b.check_in} → ${b.check_out} (${b.nights} night${b.nights === 1 ? "" : "s"})`,
    `Guests: ${b.guests}`,
    `Total: USD ${b.total_usd}`,
    `Guest: ${b.guest_name} · ${b.guest_email} · ${b.guest_phone} (${b.guest_country})`,
    b.message ? `Message: ${b.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Fire-and-forget notifications; never blocks or fails the booking itself. */
export async function sendBookingRequestEmails(booking: Booking) {
  if (!isResendConfigured()) {
    console.log("[email skipped — RESEND_API_KEY/ADMIN_EMAIL not set]");
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const adminEmail = process.env.ADMIN_EMAIL!;
  const summary = bookingSummary(booking);

  const results = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: `New booking request ${booking.reference} — ${booking.guesthouse_name}`,
      text: `A new booking request just came in.\n\n${summary}\n\nConfirm or decline it in the admin panel: ${SITE_URL}/admin/bookings`,
    }),
    resend.emails.send({
      from: FROM,
      to: booking.guest_email,
      subject: `We received your booking request — ${booking.reference}`,
      text: `Dear ${booking.guest_name},\n\nThank you for your booking request with ${SITE_NAME}. The guesthouse will confirm availability within 24 hours.\n\n${summary}\n\nNo payment is taken yet — you'll receive payment instructions once the guesthouse confirms.\n\n${SITE_NAME} · ${SITE_URL}`,
    }),
  ]);
  for (const r of results) {
    if (r.status === "rejected") console.error("[email]", r.reason);
  }
}

export async function sendBookingStatusEmail(
  booking: Booking,
  status: "confirmed" | "declined"
) {
  if (!isResendConfigured()) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const summary = bookingSummary(booking);
  const subject =
    status === "confirmed"
      ? `Booking confirmed 🎉 — ${booking.reference}`
      : `Booking update — ${booking.reference}`;
  const body =
    status === "confirmed"
      ? `Great news, ${booking.guest_name}! Your booking is confirmed.\n\n${summary}\n\nThe guesthouse will contact you about payment and your speedboat transfer.\n\nSee you in the Maldives!\n${SITE_NAME}`
      : `Dear ${booking.guest_name},\n\nUnfortunately the guesthouse couldn't accommodate this request.\n\n${summary}\n\nBrowse other stays: ${SITE_URL}/search\n\n${SITE_NAME}`;
  try {
    await resend.emails.send({
      from: FROM,
      to: booking.guest_email,
      subject,
      text: body,
    });
  } catch (e) {
    console.error("[email]", e);
  }
}
