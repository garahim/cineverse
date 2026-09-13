import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { userWatchlist } from "@/lib/queries";
import { findTitle, withStats } from "@/lib/catalog";
import MovieCard from "@/components/MovieCard";

export const metadata: Metadata = { title: "Watchlist" };

export default async function WatchlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const watchlist = userWatchlist(user.id);
  const items = watchlist
    .map((w) => ({ w, title: findTitle(w.media_id) }))
    .filter((x) => x.title)
    .map(({ title }) => withStats(title!));

  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 pb-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-white">
        My <span className="text-gradient">watchlist</span>
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        {items.length} title{items.length === 1 ? "" : "s"} saved for later
      </p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-card/40 py-24 text-center">
          <svg className="mx-auto text-slate-600" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="14" rx="2" />
            <path d="M2 17l6-6 4 4 4-4 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-3 text-sm text-slate-400">Your watchlist is empty.</p>
          <p className="mt-1 text-xs text-slate-500">Find something great to watch, then tap the star.</p>
          <Link
            href="/movies"
            className="btn-primary mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white"
          >
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
          {items.map((t) => (
            <MovieCard key={t.id} title={t} />
          ))}
        </div>
      )}
    </div>
  );
}