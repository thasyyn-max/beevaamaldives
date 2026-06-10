import Image from "next/image";
import Link from "next/link";

/** Brand badge (public/logo.svg, from brand/) — logo only, no wordmark. */
export function Logo({
  className = "",
  tone = "ink",
  size = 52,
}: {
  className?: string;
  tone?: "ink" | "light";
  size?: number;
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
        width={size}
        height={size}
        priority
        unoptimized
        className={tone === "light" ? "brightness-0 invert" : ""}
      />
    </Link>
  );
}
