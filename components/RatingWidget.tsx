"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { rateMedia, removeRating } from "@/lib/actions";

export default function RatingWidget({
  mediaId,
  mediaType,
  existingScore,
  existingReview,
  isAuthed,
}: {
  mediaId: string;
  mediaType: string;
  existingScore: number | null;
  existingReview: string | null;
  isAuthed: boolean;
}) {
  const [score, setScore] = useState<number | null>(existingScore);
  const [review, setReview] = useState(existingReview ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isAuthed) {
    return (
      <div className="rounded-2xl border border-white/10 bg-card p-6 text-center">
        <p className="text-sm text-slate-400">
          Sign in to rate, review and add this title to your watchlist.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/login" className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white hover:bg-white/5">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary rounded-full px-5 py-2 text-sm font-semibold text-white">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  const save = () => {
    setMessage(null);
    setError(null);
    if (score === null) {
      setError("Pick a score between 1 and 10.");
      return;
    }
    startTransition(async () => {
      const res = await rateMedia(mediaId, mediaType, score, review);
      if (res.ok) setMessage("Rating saved. Thanks!");
      else setError(res.message ?? "Something went wrong.");
    });
  };

  const remove = () => {
    setScore(null);
    setReview("");
    startTransition(async () => {
      await removeRating(mediaId, mediaType);
      setMessage("Rating removed.");
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-6">
      <h3 className="font-display text-lg font-bold text-white">Rate this title</h3>
      <p className="mt-1 text-xs text-slate-500">Your score</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setScore(n)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-all ${
              score !== null && n <= score
                ? "btn-primary text-white"
                : "border border-white/10 text-slate-400 hover:border-violet-400/50 hover:text-white"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {score === null ? "No score selected" : `Your score: ${score}/10`}
      </p>

      <div className="mt-5">
        <label htmlFor="review" className="text-sm font-medium text-slate-300">
          Your review <span className="text-slate-500">(optional)</span>
        </label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="What did you think of it?"
          className="input-dark mt-2 w-full rounded-xl p-3 text-sm text-white placeholder:text-slate-500"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          disabled={isPending}
          className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save rating"}
        </button>
        {existingScore !== null && (
          <button
            onClick={remove}
            disabled={isPending}
            className="rounded-full border border-rose-500/30 px-5 py-2.5 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/10 disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>

      {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
    </div>
  );
}