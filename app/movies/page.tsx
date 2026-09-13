import { byType, withStats } from "@/lib/catalog";
import { GENRES } from "@/lib/data";
import { effectiveScore } from "@/lib/catalog";
import FilterBar, { type SortKey } from "@/components/FilterBar";
import MediaGrid from "@/components/MediaGrid";
import { typeLabel } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Movies" };

const TYPE = "movie" as const;

function parseSort(v: string | undefined): SortKey {
  return v === "year" || v === "title" ? v : "rating";
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const genre = typeof sp.genre === "string" ? sp.genre : null;
  const sort = parseSort(typeof sp.sort === "string" ? sp.sort : undefined);

  let list = byType(TYPE).map(withStats);
  if (genre) list = list.filter((t) => t.genres.includes(genre));

  if (sort === "year") list.sort((a, b) => Number(b.year) - Number(a.year));
  else if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
  else list.sort((a, b) => effectiveScore(b) - effectiveScore(a));

  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 pb-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-white">
          {typeLabel(TYPE)} <span className="text-gradient">catalog</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {list.length} titles{genre ? ` in ${genre}` : ""}
        </p>
      </div>

      <FilterBar basePath="/movies" genres={GENRES} currentGenre={genre} currentSort={sort} />

      <div className="mt-8">
        <MediaGrid titles={list} />
      </div>
    </div>
  );
}