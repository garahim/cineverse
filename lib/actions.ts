"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getDb, nowIso } from "./db";
import {
  clearSessionCookie,
  getCurrentUser,
  setSessionCookie,
} from "./auth";
import { deleteRating, toggleWatchlist, upsertRating } from "./queries";
import { isMediaType } from "./types";
import { findTitle } from "./catalog";
import type { DbUser } from "./types";

export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_\-]{3,24}$/;

function fail(message: string): ActionState {
  return { ok: false, message };
}

function getField(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function safeNext(next: string): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/";
}

// ───────────────────────── Auth ─────────────────────────

export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const username = getField(formData, "username");
  const email = getField(formData, "email").toLowerCase();
  const password = formData.get("password");
  const confirm = formData.get("confirm");
  const passwordStr = typeof password === "string" ? password : "";
  const confirmStr = typeof confirm === "string" ? confirm : "";

  if (!USERNAME_RE.test(username)) {
    return fail("Username must be 3–24 characters (letters, numbers, _ or -).");
  }
  if (!EMAIL_RE.test(email)) {
    return fail("Please enter a valid email address.");
  }
  if (passwordStr.length < 6) {
    return fail("Password must be at least 6 characters long.");
  }
  if (passwordStr !== confirmStr) {
    return fail("Passwords do not match.");
  }

  const db = getDb();
  const exists = db
    .prepare("SELECT id FROM users WHERE username = ? OR email = ?")
    .get(username, email) as { id: number } | undefined;
  if (exists) {
    return fail("That username or email is already in use.");
  }

  const hash = bcrypt.hashSync(passwordStr, 12);
  const info = db
    .prepare(
      `INSERT INTO users (username, email, password_hash, avatar_color, bio, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(username, email, hash, "#8b5cf6", "", nowIso());
  const userId = Number(info.lastInsertRowid);
  await setSessionCookie(userId);
  revalidatePath("/", "layout");
  redirect(safeNext(getField(formData, "next")));
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const identifier = getField(formData, "identifier").toLowerCase();
  const password = formData.get("password");
  const passwordStr = typeof password === "string" ? password : "";
  if (!identifier || !passwordStr) {
    return fail("Please fill in all fields.");
  }

  const db = getDb();
  const user = db
    .prepare("SELECT * FROM users WHERE username = ? OR email = ?")
    .get(identifier, identifier) as DbUser | undefined;
  if (!user || !bcrypt.compareSync(passwordStr, user.password_hash)) {
    return fail("Invalid credentials. Check your username/email and password.");
  }

  await setSessionCookie(user.id);
  revalidatePath("/", "layout");
  redirect(safeNext(getField(formData, "next")));
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect("/");
}

// ───────────────────────── Ratings & watchlist ─────────────────────────

export async function rateMedia(
  mediaId: string,
  mediaType: string,
  score: number,
  review: string,
): Promise<{ ok: boolean; message?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "You must be signed in to rate." };
  if (!isMediaType(mediaType)) return { ok: false, message: "Invalid media type." };
  if (!findTitle(mediaId)) return { ok: false, message: "Unknown title." };
  const s = Math.round(Number(score));
  if (!Number.isFinite(s) || s < 1 || s > 10) {
    return { ok: false, message: "Score must be between 1 and 10." };
  }
  const rv = (review ?? "").trim().slice(0, 1000);
  upsertRating({ userId: user.id, mediaId, mediaType, score: s, review: rv });
  revalidatePath(`/title/${mediaType}/${mediaId}`, "page");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function removeRating(mediaId: string, mediaType: string): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  deleteRating(user.id, mediaId);
  revalidatePath(`/title/${mediaType}/${mediaId}`, "page");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function toggleWatchlistAction(
  mediaId: string,
  mediaType: string,
): Promise<{ ok: boolean; added?: boolean; message?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "You must be signed in." };
  if (!isMediaType(mediaType) || !findTitle(mediaId)) return { ok: false };
  const added = toggleWatchlist(user.id, mediaId, mediaType);
  revalidatePath(`/title/${mediaType}/${mediaId}`, "page");
  revalidatePath("/watchlist", "page");
  revalidatePath("/", "layout");
  return { ok: true, added };
}

// ───────────────────────── Account management ─────────────────────────

const AVATAR_COLORS = ["#8b5cf6", "#d946ef", "#f43f5e", "#f59e0b", "#22c55e", "#06b6d4", "#6366f1"];

export async function updateAccountAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return fail("You must be signed in.");

  const username = getField(formData, "username");
  const bio = getField(formData, "bio").slice(0, 240);
  const avatarColor = getField(formData, "avatarColor") || "#8b5cf6";
  const newPassword = formData.get("newPassword");
  const currentPassword = formData.get("currentPassword");
  const newPw = typeof newPassword === "string" ? newPassword : "";
  const curPw = typeof currentPassword === "string" ? currentPassword : "";

  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(user.id) as DbUser;

  const errors: Record<string, string> = {};
  if (!USERNAME_RE.test(username)) errors.username = "3–24 characters (letters, numbers, _ or -).";
  if (username !== user.username) {
    const clash = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
    if (clash) errors.username = "That username is already taken.";
  }
  if (avatarColor && !AVATAR_COLORS.includes(avatarColor)) {
    errors.avatarColor = "Pick a valid color.";
  }
  if (newPw && (!curPw || !bcrypt.compareSync(curPw, row.password_hash))) {
    errors.currentPassword = "Enter your current password to change it.";
  }
  if (newPw && newPw.length < 6) errors.newPassword = "Password must be at least 6 characters.";

  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the highlighted fields.", errors };

  const hash = newPw ? bcrypt.hashSync(newPw, 12) : row.password_hash;
  db.prepare("UPDATE users SET username = ?, bio = ?, avatar_color = ?, password_hash = ? WHERE id = ?").run(
    username,
    bio,
    avatarColor,
    hash,
    user.id,
  );
  revalidatePath("/account", "page");
  return { ok: true, message: "Profile updated." };
}

export async function deleteAccountAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const db = getDb();
  db.prepare("DELETE FROM users WHERE id = ?").run(user.id);
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect("/");
}