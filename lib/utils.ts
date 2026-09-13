export function formatScore(score: number | null): string {
  if (score === null || Number.isNaN(score)) return "–";
  return score.toFixed(1);
}

export function scoreToStars(score: number): number {
  return Math.round((score / 10) * 5 * 2) / 2;
}

export function timeAgo(dateStr: string): string {
  const then = new Date(dateStr.replace(" ", "T") + "Z").getTime();
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (Number.isNaN(then) || seconds < 0) return "recently";
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of intervals) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${label}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export const AVATAR_COLORS = [
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function typeLabel(type: string): string {
  switch (type) {
    case "movie":
      return "Movie";
    case "tv":
      return "TV Series";
    case "anime":
      return "Anime";
    default:
      return type;
  }
}