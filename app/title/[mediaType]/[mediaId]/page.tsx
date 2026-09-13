import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findTitle, related, withStats, effectiveScore } from "@/lib/catalog";
import { ratingsForMedia, userRatingForMedia, isWatchlisted } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { isMediaType } from "@/lib/types";
import { formatScore, timeAgo, typeLabel } from "@/lib/utils";
import RatingWidget from "@/components/RatingWidget";
import WatchlistButton from "@/components/WatchlistButton";
import Avatar from "@/components/Avatar";
import StarRating from "@/components/StarRating";
import MovieCard from "@/components/MovieCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mediaType: string; mediaId: string }>;
}): Promise<Metadata> {
  const { mediaId } = await params;
  const title = findTitle(mediaId);
  return { title: title ? title.title : "Title" };
}

export default async function TitlePage({
  params,
}: {
  params: Promise<{ mediaType: string; mediaId: string }>;
}) {
  const { mediaType, mediaId } = await params;
  const raw = findTitle(mediaId);
  if (!raw || !isMediaType(mediaType) || raw.type !== mediaType) notFound();

  const user = await getCurrentUser();
  const t = withStats(raw);
  const score = effectiveScore(t);
  const reviews = ratingsForMedia(mediaId).filter((r) => r.review);
  const communityReviews = ratingsForMedia(mediaId);
  const myRating = user ? userRatingForMedia(user.id, mediaId) : null;
  const inList = user ? isWatchlisted(user.id, mediaId) : false;
  const relatedTitles = related(t, 6);

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 h-[420px] overflow-hidden">
          <Image src={t.backdrop} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/80 to-bg" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-8 pt-16 sm:px-6 md:flex-row">
          <div className="w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 sm:w-56 md:sticky md:top-24 md:h-fit">
            <Image src={t.poster} alt={t.title} width={224} height={336} className="w-full object-cover" sizes="(min-width:768px) 224px, 176px" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="inline-block rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-300">
              {typeLabel(t.type)}
            </p>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-1 italic text-violet-200/80">{t.tagline}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
              <span className="text-slate-400">{t.year}</span>
              <span className="text-slate-600">•</span>
              <span>{t.runtime}</span>
              {t.type !== "movie" && (
                <>
                  <span className="text-slate-600">•</span>
                  <span>
                    {t.seasons} season{t.seasons === 1 ? "" : "s"}
                    {t.episodes ? ` · ${t.episodes} episodes` : ""}
                  </span>
                </>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {t.genres.map((g) => (
                <Link
                  key={g}
                  href={`/${t.type}?genre=${encodeURIComponent(g)}`}
                  className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-violet-400/40 hover:text-white"
                >
                  {g}
                </Link>
              ))}
            </div>

            {t.creator && (
              <p className="mt-4 text-sm text-slate-400">
                <span className="font-semibold text-slate-300">Creator: </span>
                {t.creator}
              </p>
            )}
            {t.status && (
              <p className="mt-1 text-sm text-slate-400">
                <span className="font-semibold text-slate-300">Status: </span>
                {t.status}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-6 rounded-2xl border border-white/10 bg-black/30 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Community score</p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold text-gold">{formatScore(score)}</span>
                  <span className="text-sm text-slate-500">/ 10</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {t.communityCount > 0 ? `${t.communityCount} rating${t.communityCount === 1 ? "" : "s"}` : "No community ratings yet"}
                </p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Critic score</p>
                <p className="mt-1 font-display text-2xl font-bold text-slate-300">{formatScore(t.rating)}</p>
                <p className="mt-1 text-xs text-slate-500">Base catalog rating</p>
              </div>
              <div className="ml-auto flex flex-col gap-2 sm:flex-row">
                <WatchlistButton mediaId={t.id} mediaType={t.type} initial={inList} isAuthed={!!user} />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-white">Story</h2>
              <p className="mt-2 max-w-3xl leading-relaxed text-slate-300">{t.overview}</p>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-white">Cast</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:max-w-2xl">
                {t.cast.map((c, i) => (
                  <div key={i} className="rounded-xl border border-white/8 bg-card px-4 py-3">
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">as {c.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Reviews{" "}
                  <span className="text-sm font-normal text-slate-500">
                    {communityReviews.length === 0 ? "· none yet" : `· ${communityReviews.length} total`}
                  </span>
                </h2>
                <div className="mt-4 space-y-4">
                  {reviews.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-card/40 px-5 py-10 text-center text-sm text-slate-500">
                      No written reviews yet — be the first to share your thoughts.
                    </div>
                  )}
                  {reviews.map((r) => (
                    <article key={r.id} className="rounded-2xl border border-white/8 bg-card p-5">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.username ?? "?"} color={r.avatar_color ?? "#8b5cf6"} size={36} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{r.username}</p>
                          <p className="text-xs text-slate-500">Rated {r.score}/10 · {timeAgo(r.created_at)}</p>
                        </div>
                        <StarRating score={r.score} />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{r.review}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <RatingWidget
                  mediaId={t.id}
                  mediaType={t.type}
                  existingScore={myRating?.score ?? null}
                  existingReview={myRating?.review ?? null}
                  isAuthed={!!user}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedTitles.length > 0 && (
        <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
          <h2 className="mb-4 font-display text-xl font-bold text-white">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {relatedTitles.map((rt) => (
              <MovieCard key={rt.id} title={rt} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}