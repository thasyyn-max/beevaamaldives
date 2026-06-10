import { NextResponse } from "next/server";
import { createEnquiry, type EnquiryInput } from "@/lib/data";
import { sendEnquiryEmails } from "@/lib/email";

export async function POST(request: Request) {
  let body: Partial<EnquiryInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  for (const key of ["guestName", "guestEmail", "guestPhone"] as const) {
    if (!body[key] || typeof body[key] !== "string") {
      return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
    }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.guestEmail!)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const enquiry = await createEnquiry({
      propertyId: body.propertyId ?? null,
      guestName: String(body.guestName).slice(0, 200),
      guestEmail: String(body.guestEmail).slice(0, 200),
      guestPhone: String(body.guestPhone).slice(0, 50),
      guestCountry: String(body.guestCountry ?? "").slice(0, 100),
      checkIn: body.checkIn ? String(body.checkIn) : null,
      checkOut: body.checkOut ? String(body.checkOut) : null,
      guests: Math.max(1, Math.min(Number(body.guests) || 1, 30)),
      message: String(body.message ?? "").slice(0, 3000),
    });

    await sendEnquiryEmails(enquiry);
    return NextResponse.json({ reference: enquiry.reference, id: enquiry.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not send enquiry";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
