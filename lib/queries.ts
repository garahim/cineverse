import { getDb, nowIso } from "./db";
import type { RatingRow } from "./types";

export type MediaStats = { count: number; avg: number | null; sum: number };

export function mediaStats(mediaId: string): MediaStats {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT COUNT(*) as count, COALESCE(AVG(score), 0) as avg, COALESCE(SUM(score), 0) as sum
       FROM ratings WHERE media_id = ?`,
    )
    .get(mediaId) as { count: number; avg: number; sum: number };
  return {
    count: row.count,
    avg: row.count > 0 ? Math.round(row.avg * 10) / 10 : null,
    sum: row.sum,
  };
}

export function ratingsForMedia(mediaId: string): RatingRow[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT r.id, r.user_id, r.media_id, r.media_type, r.score, r.review,
              r.created_at, r.updated_at, u.username, u.avatar_color
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.media_id = ?
       ORDER BY r.updated_at DESC`,
    )
    .all(mediaId) as RatingRow[];
  return rows;
}

export function userRatingForMedia(userId: number, mediaId: string): RatingRow | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id, user_id, media_id, media_type, score, review, created_at, updated_at
       FROM ratings WHERE user_id = ? AND media_id = ?`,
    )
    .get(userId, mediaId) as RatingRow | undefined;
  return row ?? null;
}

export function isWatchlisted(userId: number, mediaId: string): boolean {
  const db = getDb();
  return !!db.prepare("SELECT 1 FROM watchlist WHERE user_id = ? AND media_id = ?").get(userId, mediaId);
}

export function userWatchlist(userId: number): RatingRow[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM watchlist WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as RatingRow[];
}

export function userRatingCount(userId: number): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM ratings WHERE user_id = ?").get(userId) as { count: number };
  return row.count;
}

export function userRatings(userId: number): RatingRow[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT r.id, r.user_id, r.media_id, r.media_type, r.score, r.review,
              r.created_at, r.updated_at
       FROM ratings r WHERE r.user_id = ? ORDER BY r.updated_at DESC`,
    )
    .all(userId) as RatingRow[];
}

export function topReviews(limit = 6): (RatingRow & { media_title: string; media_poster: string })[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT r.id, r.user_id, r.media_id, r.media_type, r.score, r.review,
              r.created_at, r.updated_at, u.username, u.avatar_color
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.review != ''
       ORDER BY r.updated_at DESC
       LIMIT ?`,
    )
    .all(limit) as (RatingRow & { media_title: string; media_poster: string })[];
}

export function upsertRating(params: {
  userId: number;
  mediaId: string;
  mediaType: string;
  score: number;
  review: string;
}): void {
  const db = getDb();
  const ts = nowIso();
  db.prepare(
    `INSERT INTO ratings (user_id, media_id, media_type, score, review, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, media_id)
     DO UPDATE SET score = excluded.score, review = excluded.review, updated_at = excluded.updated_at`,
  ).run(params.userId, params.mediaId, params.mediaType, params.score, params.review, ts, ts);
}

export function deleteRating(userId: number, mediaId: string): void {
  const db = getDb();
  db.prepare("DELETE FROM ratings WHERE user_id = ? AND media_id = ?").run(userId, mediaId);
}

export function toggleWatchlist(userId: number, mediaId: string, mediaType: string): boolean {
  const db = getDb();
  const existing = db
    .prepare("SELECT 1 FROM watchlist WHERE user_id = ? AND media_id = ?")
    .get(userId, mediaId);
  if (existing) {
    db.prepare("DELETE FROM watchlist WHERE user_id = ? AND media_id = ?").run(userId, mediaId);
    return false;
  }
  db.prepare("INSERT INTO watchlist (user_id, media_id, media_type, created_at) VALUES (?, ?, ?, ?)").run(
    userId,
    mediaId,
    mediaType,
    nowIso(),
  );
  return true;
}