import { NextResponse } from "next/server";
import { createBooking, type BookingInput } from "@/lib/data";
import { sendBookingRequestEmails } from "@/lib/email";

export async function POST(request: Request) {
  let body: Partial<BookingInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const required = [
    "roomId",
    "guestName",
    "guestEmail",
    "checkIn",
    "checkOut",
  ] as const;
  for (const key of required) {
    if (!body[key] || typeof body[key] !== "string") {
      return NextResponse.json(
        { error: `Missing field: ${key}` },
        { status: 400 }
      );
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.checkIn!) || !/^\d{4}-\d{2}-\d{2}$/.test(body.checkOut!)) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  try {
    const booking = await createBooking({
      roomId: body.roomId!,
      guestName: String(body.guestName).slice(0, 200),
      guestEmail: String(body.guestEmail).slice(0, 200),
      guestPhone: String(body.guestPhone ?? "").slice(0, 50),
      guestCountry: String(body.guestCountry ?? "").slice(0, 100),
      checkIn: body.checkIn!,
      checkOut: body.checkOut!,
      guests: Math.max(1, Math.min(Number(body.guests) || 1, 20)),
      message: String(body.message ?? "").slice(0, 2000),
    });

    await sendBookingRequestEmails(booking);

    return NextResponse.json({
      reference: booking.reference,
      id: booking.id,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not create booking";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
