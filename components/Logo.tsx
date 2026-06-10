import Image from "next/image";
import Link from "next/link";

/** Brand lockup: circular badge (public/logo.svg, from brand/) + wordmark. */
export function Logo({
  className = "",
  tone = "ink",
  badgeOnly = false,
}: {
  className?: string;
  tone?: "ink" | "light";
  badgeOnly?: boolean;
}) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Beevaa Maldives"
        width={40}
        height={40}
        priority
        unoptimized
        className={tone === "light" ? "brightness-0 invert" : ""}
      />
      {!badgeOnly && (
        <span className="leading-tight">
          <span
            className={`block font-display text-lg font-bold tracking-tight ${
              tone === "light" ? "text-white" : "text-ink"
            }`}
          >
            Beevaa <span className="font-normal">maldives</span>
          </span>
          <span
            className={`block text-[9px] font-medium tracking-[0.14em] ${
              tone === "light" ? "text-white/70" : "text-brand"
            }`}
          >
            YOUR JOURNEY TO TROPICAL PARADISE
          </span>
        </span>
      )}
    </Link>
  );
}
