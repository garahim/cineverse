import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { userRatings, userRatingCount, userWatchlist } from "@/lib/queries";
import { findTitle, withStats } from "@/lib/catalog";
import { formatScore, typeLabel } from "@/lib/utils";
import Avatar from "@/components/Avatar";
import StarRating from "@/components/StarRating";
import AccountForm from "@/components/AccountForm";
import MovieCard from "@/components/MovieCard";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const ratings = userRatings(user.id);
  const count = userRatingCount(user.id);
  const watchlist = userWatchlist(user.id);
  const avg =
    ratings.length > 0 ? Math.round((ratings.reduce((a, r) => a + r.score, 0) / ratings.length) * 10) / 10 : null;
  const reviews = ratings.filter((r) => r.review).length;
  const joined = new Date(user.createdAt);

  const ratedTitles = ratings
    .map((r) => ({ r, title: findTitle(r.media_id) }))
    .filter((x) => x.title)
    .slice(0, 9);

  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 pb-10 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 to-fuchsia-950/30 p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar name={user.username} color={user.avatarColor} size={84} />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-extrabold text-white">{user.username}</h1>
            <p className="mt-1 truncate text-sm text-slate-400">{user.email}</p>
            <p className="mt-1 text-xs text-slate-500">
              Member since {joined.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            {user.bio && <p className="mt-3 max-w-xl text-sm text-slate-300">{user.bio}</p>}
          </div>
          <div className="flex gap-3">
            <Link href="/watchlist" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              Watchlist ({watchlist.length})
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Ratings", value: String(count) },
            { label: "Avg score", value: avg !== null ? formatScore(avg) : "–" },
            { label: "Reviews", value: String(reviews) },
            { label: "Watchlist", value: String(watchlist.length) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-center">
              <p className="font-display text-2xl font-extrabold text-white">{s.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <AccountForm user={user} />
      </div>

      {ratedTitles.length > 0 && (
        <div className="mt-12">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-xl font-bold text-white">Recent ratings</h2>
            <Link href="/watchlist" className="text-sm font-medium text-violet-300 hover:text-violet-200">
              View watchlist →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ratedTitles.map(({ r, title }) => (
              <Link
                key={r.id}
                href={`/title/${title!.type}/${title!.id}`}
                className="flex items-center gap-4 rounded-2xl border border-white/8 bg-card p-4 transition-colors hover:border-violet-400/30"
              >
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={title!.poster.replace("/w500/", "/w185/")}
                    alt=""
                    width={56}
                    height={80}
                    className="h-full w-full object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-white">{title!.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {typeLabel(title!.type)} · {title!.year}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating score={r.score} />
                    <span className="text-xs font-semibold text-gold">{r.score}/10</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {watchlist.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-display text-xl font-bold text-white">Watchlist</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {watchlist.map((w) => {
              const t = findTitle(w.media_id);
              if (!t) return null;
              return <MovieCard key={w.media_id} title={withStats(t)} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}