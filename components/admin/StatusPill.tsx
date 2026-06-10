const STYLES: Record<string, string> = {
  new: "bg-amber-100 text-amber-800",
  replied: "bg-emerald-100 text-emerald-800",
  closed: "bg-slate-200 text-slate-600",
  live: "bg-emerald-100 text-emerald-800",
  draft: "bg-slate-200 text-slate-600",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
        STYLES[status] ?? STYLES.new
      }`}
    >
      {status}
    </span>
  );
}
