export function ratingLabel(rating: number): string {
  if (rating >= 9.5) return "Exceptional";
  if (rating >= 9) return "Wonderful";
  if (rating >= 8.5) return "Excellent";
  if (rating >= 8) return "Very good";
  if (rating >= 7) return "Good";
  return "Review score";
}

export function RatingBadge({
  rating,
  reviewCount,
  size = "md",
}: {
  rating: number;
  reviewCount?: number;
  size?: "md" | "lg";
}) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center justify-center rounded-md rounded-bl-none bg-blue-900 font-bold text-white ${
          size === "lg" ? "h-9 min-w-9 px-1.5 text-base" : "h-7 min-w-7 px-1 text-sm"
        }`}
      >
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-slate-600">
        <span className="font-semibold text-slate-800">{ratingLabel(rating)}</span>
        {reviewCount ? <> · {reviewCount} reviews</> : null}
      </span>
    </div>
  );
}
