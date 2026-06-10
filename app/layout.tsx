import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

// Body: clean modern sans. Display: refined serif for headings.
// Replace these two with your brand fonts if you have them.
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Beevaa Maldives — Resorts, Liveaboards & City Hotels",
    template: "%s · Beevaa Maldives",
  },
  description:
    "Your gateway to the Maldives. Hand-picked resorts, liveaboards and local island hotels — book with a local team.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
