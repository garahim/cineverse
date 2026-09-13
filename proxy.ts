import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "./lib/auth";

export async function proxy(request: NextRequest): Promise<NextResponse | undefined> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const userId = token ? await verifyToken(token) : null;
  if (userId) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/account/:path*", "/watchlist/:path*"],
};