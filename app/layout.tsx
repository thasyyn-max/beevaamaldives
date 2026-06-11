import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Brand typography is Helvetica-style (see brand/), so one clean sans
// carries both body and display — display headings get tighter tracking.
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Beevaa Maldives — Resort, Safari & Guesthouse stays",
    template: "%s · Beevaa Maldives",
  },
  description:
    "Your journey to tropical paradise. Hand-picked resorts, safari boats and guesthouses — booked with a local Maldives team.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
