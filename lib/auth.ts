import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getDb } from "./db";
import { toSafeUser, type SafeUser } from "./types";

export const COOKIE_NAME = "cine_token";
export const SESSION_DAYS = 30;

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "cineverse-dev-secret-change-me-in-prod",
);

export async function signToken(userId: number): Promise<string> {
  return new SignJWT({ sub: String(userId) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const sub = payload.sub;
    const id = typeof sub === "string" ? Number(sub) : NaN;
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: number): Promise<void> {
  const token = await signToken(userId);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const userId = await verifyToken(token);
  if (!userId) return null;
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(userId) as (SafeUserRow & { password_hash: string }) | undefined;
  if (!row) return null;
  return toSafeUser(row);
}

type SafeUserRow = {
  id: number;
  username: string;
  email: string;
  avatar_color: string;
  bio: string;
  created_at: string;
};