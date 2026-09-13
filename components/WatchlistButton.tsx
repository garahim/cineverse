"use client";

import { useState, useTransition } from "react";
import { toggleWatchlistAction } from "@/lib/actions";

export default function WatchlistButton({
  mediaId,
  mediaType,
  initial,
  isAuthed,
}: {
  mediaId: string;
  mediaType: string;
  initial: boolean;
  isAuthed: boolean;
}) {
  const [added, setAdded] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const res = await toggleWatchlistAction(mediaId, mediaType);
      if (res.ok) setAdded(!!res.added);
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending || !isAuthed}
      title={isAuthed ? (added ? "Remove from watchlist" : "Add to watchlist") : "Sign in to use watchlist"}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-40 ${
        added
          ? "border-gold/60 bg-gold/10 text-amber-300 hover:bg-gold/20"
          : "border-white/15 text-white hover:bg-white/10"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" className={added ? "text-gold" : ""} fill={added ? "currentColor" : "none"} stroke="currentColor" strokeWidth={added ? 0 : 2} aria-hidden="true">
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
      {added ? "In watchlist" : "Watchlist"}
    </button>
  );
}