import MovieCard from "./MovieCard";
import type { TitleWithStats } from "@/lib/types";

export default function MediaGrid({
  titles,
  className = "",
}: {
  titles: TitleWithStats[];
  className?: string;
}) {
  if (titles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-card/40 py-20 text-center text-slate-400">
        Nothing here yet — try adjusting your filters.
      </div>
    );
  }
  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 ${className}`}
    >
      {titles.map((t) => (
        <MovieCard key={t.id} title={t} />
      ))}
    </div>
  );
}