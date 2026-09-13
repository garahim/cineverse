import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "cineverse.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  initSchema(db);
  return db;
}

function initSchema(d: Database.Database) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT NOT NULL COLLATE NOCASE UNIQUE,
      email         TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      avatar_color  TEXT NOT NULL DEFAULT '#8b5cf6',
      bio           TEXT NOT NULL DEFAULT '',
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      media_id   TEXT NOT NULL,
      media_type TEXT NOT NULL,
      score      INTEGER NOT NULL CHECK (score BETWEEN 1 AND 10),
      review     TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (user_id, media_id)
    );
    CREATE INDEX IF NOT EXISTS idx_ratings_media ON ratings(media_id);
    CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);

    CREATE TABLE IF NOT EXISTS watchlist (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      media_id   TEXT NOT NULL,
      media_type TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE (user_id, media_id)
    );
    CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
    CREATE INDEX IF NOT EXISTS idx_watchlist_media ON watchlist(media_id);
  `);
}

export const nowIso = () => new Date().toISOString();