import Link from "next/link";
import { allWithStats, effectiveScore } from "@/lib/catalog";
import { topReviews } from "@/lib/queries";
import { findTitle } from "@/lib/catalog";
import HeroBanner from "@/components/HeroBanner";
import MovieCard from "@/components/MovieCard";
import Avatar from "@/components/Avatar";
import StarRating from "@/components/StarRating";
import { formatScore, timeAgo, typeLabel } from "@/lib/utils";

function RowSection({
  heading,
  linkHref,
  titles,
}: {
  heading: string;
  linkHref?: string;
  titles: ReturnType<typeof allWithStats>;
}) {
  if (titles.length === 0) return null;
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">{heading}</h2>
        {linkHref && (
          <Link href={linkHref} className="text-sm font-medium text-violet-300 transition-colors hover:text-violet-200">
            See all →
          </Link>
        )}
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 sm:gap-5">
        {titles.map((t) => (
          <MovieCard key={t.id} title={t} width="row" />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const all = allWithStats();
  const trending = [...all].sort((a, b) => effectiveScore(b) - effectiveScore(a));
  const hero =
    (all.find((t) => t.featured) && [...all].filter((t) => t.featured).sort((a, b) => effectiveScore(b) - effectiveScore(a))[0]) ||
    trending[0];
  const movies = trending.filter((t) => t.type === "movie").slice(0, 12);
  const tv = trending.filter((t) => t.type === "tv").slice(0, 12);
  const anime = trending.filter((t) => t.type === "anime").slice(0, 12);
  const featuredRow = trending.filter((t) => t.id !== hero.id).slice(0, 10);

  const reviews = topReviews(6);
  const reviewItems = reviews
    .map((r) => ({ r, title: findTitle(r.media_id) }))
    .filter((x) => x.title);

  return (
    <>
      <HeroBanner title={hero} />

      <RowSection heading="Trending now" linkHref="/movies" titles={featuredRow} />
      <RowSection heading="Movies" linkHref="/movies" titles={movies} />
      <RowSection heading="TV series" linkHref="/tv" titles={tv} />
      <RowSection heading="Anime" linkHref="/anime" titles={anime} />

      {reviewItems.length > 0 && (
        <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">Latest reviews</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviewItems.map(({ r, title }) => (
              <article key={r.id} className="rounded-2xl border border-white/8 bg-card p-5 transition-colors hover:border-violet-400/30">
                <div className="flex items-center gap-3">
                  <Avatar name={r.username ?? "?"} color={r.avatar_color ?? "#8b5cf6"} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{r.username}</p>
                    <p className="text-xs text-slate-500">{timeAgo(r.created_at)}</p>
                  </div>
                  <StarRating score={r.score} />
                </div>
                <Link href={`/title/${title!.type}/${title!.id}`} className="mt-3 block">
                  <p className="text-sm font-semibold text-violet-300 hover:text-violet-200">
                    {title!.title} <span className="text-slate-500">· {typeLabel(title!.type)}</span>
                  </p>
                </Link>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">{r.review}</p>
                <p className="mt-3 text-xs text-slate-500">Score: {formatScore(r.score)} / 10</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-violet-950/50 to-fuchsia-950/40 p-10 text-center">
          <h2 className="font-display text-2xl font-extrabold text-white">
            What should you watch next?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300">
            Rate what you love, hunt for hidden gems, and build a watchlist that actually matches your taste.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/signup" className="btn-primary rounded-full px-7 py-3 text-sm font-semibold text-white">
              Join CineVerse
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore catalog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}