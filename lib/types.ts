export type MediaType = "movie" | "tv" | "anime";
export const MEDIA_TYPES = ["movie", "tv", "anime"] as const;

export function isMediaType(v: string): v is MediaType {
  return (MEDIA_TYPES as readonly string[]).includes(v);
}

export type Title = {
  id: string;
  type: MediaType;
  title: string;
  year: string;
  rating: number;
  runtime: string;
  genres: string[];
  poster: string;
  backdrop: string;
  overview: string;
  tagline: string;
  cast: { name: string; role: string }[];
  creator?: string;
  status?: string;
  seasons?: number;
  episodes?: number;
  featured?: boolean;
};

export type TitleWithStats = Title & {
  communityCount: number;
  communityAvg: number | null;
};

// ───────────────────────── Users & ratings ─────────────────────────

export type DbUser = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar_color: string;
  bio: string;
  created_at: string;
};

export type SafeUser = {
  id: number;
  username: string;
  email: string;
  avatarColor: string;
  bio: string;
  createdAt: string;
};

export type RatingRow = {
  id: number;
  user_id: number;
  media_id: string;
  media_type: string;
  score: number;
  review: string;
  created_at: string;
  updated_at: string;
  username?: string;
  avatar_color?: string;
};

export type WatchlistRow = {
  user_id: number;
  media_id: string;
  media_type: string;
  created_at: string;
};

export function toSafeUser(u: DbUser): SafeUser {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    avatarColor: u.avatar_color,
    bio: u.bio,
    createdAt: u.created_at,
  };
}