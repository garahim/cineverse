import { byType, withStats } from "@/lib/catalog";
import { GENRES } from "@/lib/data";
import { effectiveScore } from "@/lib/catalog";
import FilterBar, { type SortKey } from "@/components/FilterBar";
import MediaGrid from "@/components/MediaGrid";
import { typeLabel } from "@/lib/utils";
import type { MediaType } from "@/lib/types";

function parseSort(v: string | undefined): SortKey {
  return v === "year" || v === "title" ? v : "rating";
}

export default async function TypeCatalogue({
  type,
  searchParams,
}: {
  type: MediaType;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const genre = typeof searchParams.genre === "string" ? searchParams.genre : null;
  const sort = parseSort(typeof searchParams.sort === "string" ? searchParams.sort : undefined);

  let list = byType(type).map(withStats);
  if (genre) list = list.filter((t) => t.genres.includes(genre));

  if (sort === "year") list.sort((a, b) => Number(b.year) - Number(a.year));
  else if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
  else list.sort((a, b) => effectiveScore(b) - effectiveScore(a));

  const basePath = `/${type}`;

  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 pb-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-white">
          {typeLabel(type)} <span className="text-gradient">catalog</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {list.length} titles{genre ? ` in ${genre}` : ""}
        </p>
      </div>

      <FilterBar basePath={basePath} genres={GENRES} currentGenre={genre} currentSort={sort} />

      <div className="mt-8">
        <MediaGrid titles={list} />
      </div>
    </div>
  );
}