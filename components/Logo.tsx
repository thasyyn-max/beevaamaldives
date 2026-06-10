import Image from "next/image";
import Link from "next/link";

// Horizontal web lockup (public/logo.svg from brand/beevaa logo web svg.svg).
// Artwork ratio is 272:123 (~2.21:1) — width derives from the height prop.
const RATIO = 272 / 123;

export function Logo({
  className = "",
  tone = "ink",
  height = 46,
}: {
  className?: string;
  tone?: "ink" | "light";
  height?: number;
}) {
  return (
    <Link
      href="/"
      aria-label="Beevaa Maldives — home"
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src="/logo.svg"
        alt="Beevaa Maldives"
        width={Math.round(height * RATIO)}
        height={height}
        priority
        unoptimized
        className={tone === "light" ? "brightness-0 invert" : ""}
      />
    </Link>
  );
}
