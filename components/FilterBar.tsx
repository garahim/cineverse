"use client";

import { useRouter } from "next/navigation";

export type SortKey = "rating" | "year" | "title";

export default function FilterBar({
  basePath,
  genres,
  currentGenre,
  currentSort,
}: {
  basePath: string;
  genres: readonly string[];
  currentGenre: string | null;
  currentSort: SortKey;
}) {
  const router = useRouter();

  const go = (genre: string | null, sort: SortKey) => {
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (sort !== "rating") params.set("sort", sort);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
      <div className="no-scrollbar flex flex-wrap gap-2">
        <button
          onClick={() => go(null, currentSort)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            currentGenre === null ? "btn-primary text-white" : "border border-white/12 text-slate-400 hover:text-white"
          }`}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => go(currentGenre === g ? null : g, currentSort)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              currentGenre === g ? "btn-primary text-white" : "border border-white/12 text-slate-400 hover:text-white"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <label className="flex shrink-0 items-center gap-2 text-sm text-slate-400">
        Sort by
        <select
          value={currentSort}
          onChange={(e) => go(currentGenre, e.target.value as SortKey)}
          className="input-dark rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="rating">Top rated</option>
          <option value="year">Newest</option>
          <option value="title">A – Z</option>
        </select>
      </label>
    </div>
  );
}