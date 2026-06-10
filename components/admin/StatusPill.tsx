import type { BookingStatus } from "@/lib/types";

const STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  declined: "bg-red-100 text-red-700",
  cancelled: "bg-slate-200 text-slate-600",
  completed: "bg-blue-100 text-blue-800",
};

export function StatusPill({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
        STYLES[status] ?? STYLES.pending
      }`}
    >
      {status}
    </span>
  );
}
