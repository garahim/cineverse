import { titles } from "./data";
import { mediaStats } from "./queries";
import type { MediaType, Title, TitleWithStats } from "./types";

export function findTitle(mediaId: string): Title | undefined {
  return titles.find((t) => t.id === mediaId);
}

export function byType(type: MediaType): Title[] {
  return titles.filter((t) => t.type === type);
}

export function withStats(t: Title): TitleWithStats {
  const s = mediaStats(t.id);
  return { ...t, communityCount: s.count, communityAvg: s.avg };
}

export function allWithStats(): TitleWithStats[] {
  return titles.map(withStats);
}

export function effectiveScore(t: TitleWithStats): number {
  if (t.communityCount > 0 && t.communityAvg !== null) return t.communityAvg;
  return t.rating;
}

export function searchTitles(query: string): Title[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return titles.filter((t) => {
    const haystack = [
      t.title,
      t.year,
      t.overview,
      ...t.genres,
      ...t.cast.map((c) => c.name),
      t.creator ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function related(t: Title, limit = 6): TitleWithStats[] {
  const scored = titles.filter((x) => x.id !== t.id).map((x) => {
    let score = 0;
    const sharedGenres = x.genres.filter((g) => t.genres.includes(g)).length;
    score += sharedGenres * 3;
    if (x.type === t.type) score += 2;
    if (Math.abs(Number(x.year) - Number(t.year)) <= 2) score += 1;
    return { t: x, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => withStats(x.t));
}