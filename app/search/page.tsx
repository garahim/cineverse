import { searchTitles, withStats, effectiveScore } from "@/lib/catalog";
import MediaGrid from "@/components/MediaGrid";
import type { TitleWithStats } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  let results: TitleWithStats[] = [];
  if (q) {
    results = searchTitles(q)
      .map(withStats)
      .sort((a, b) => effectiveScore(b) - effectiveScore(a));
  }

  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 pb-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-white">
        {q ? (
          <>
            Results for <span className="text-gradient">“{q}”</span>
          </>
        ) : (
          <>
            <span className="text-gradient">Search</span> the catalog
          </>
        )}
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        {q ? `${results.length} title${results.length === 1 ? "" : "s"} found` : "Type a movie, series or anime name in the search bar above."}
      </p>

      <div className="mt-8">
        {q ? (
          <MediaGrid titles={results} />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-card/40 py-24 text-center text-slate-500">
            <svg className="mx-auto text-slate-600" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            <p className="mt-3 text-sm">Try “Inception”, “Breaking Bad” or “Spirited Away”.</p>
          </div>
        )}
        {q && results.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-card/40 py-20 text-center">
            <p className="text-sm text-slate-400">No matches for “{q}”.</p>
            <p className="mt-1 text-xs text-slate-500">Check the spelling or try a different term.</p>
          </div>
        )}
      </div>
    </div>
  );
}