export default function StarRating({
  score,
  size = 14,
  className = "",
}: {
  score: number;
  size?: number;
  className?: string;
}) {
  const filled = Math.round(score / 2);
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} style={{ fontSize: size }} aria-label={`${score.toFixed(1)} / 10`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={i <= filled ? "text-gold" : "text-slate-600"}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  );
}