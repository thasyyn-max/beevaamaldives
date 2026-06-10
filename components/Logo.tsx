import Link from "next/link";

/**
 * Brand wordmark. To use your logo image instead, drop it in /public
 * (e.g. /public/logo.svg) and replace the <span> block with:
 *   <Image src="/logo.svg" alt="Beevaa Maldives" width={132} height={32} priority />
 */
export function Logo({
  className = "",
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "light";
}) {
  return (
    <Link href="/" className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span
        className={`font-display text-2xl font-semibold tracking-tight ${
          tone === "light" ? "text-white" : "text-ink"
        }`}
      >
        beevaa
      </span>
      <span
        className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${
          tone === "light" ? "text-white/70" : "text-brand"
        }`}
      >
        maldives
      </span>
    </Link>
  );
}
