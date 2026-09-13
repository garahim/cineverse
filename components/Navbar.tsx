"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";
import Avatar from "./Avatar";
import type { SafeUser } from "@/lib/types";

const NAV_LINKS = [
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Series" },
  { href: "/anime", label: "Anime" },
];

export default function Navbar({ user }: { user: SafeUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-base font-black text-white shadow-lg shadow-violet-500/40">
            C
          </span>
          <span className="font-display text-lg font-bold text-white">
            Cine<span className="text-gradient">Verse</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(l.href) ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form
          action="/search"
          method="get"
          className="ml-auto hidden w-64 items-center lg:flex"
        >
          <div className="relative w-full">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              name="q"
              placeholder="Search movies, shows, anime…"
              className="input-dark w-full rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-white/10"
                aria-label="Account menu"
              >
                <Avatar name={user.username} color={user.avatarColor} size={32} />
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-200 sm:block">
                  {user.username}
                </span>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-panel p-1 shadow-2xl">
                    <div className="border-b border-white/8 px-3 py-2">
                      <p className="truncate text-sm font-semibold text-white">{user.username}</p>
                      <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/8 hover:text-white"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
                      </svg>
                      My Account
                    </Link>
                    <Link
                      href="/watchlist"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/8 hover:text-white"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      Watchlist
                    </Link>
                    <button
                      onClick={async () => {
                        setMenuOpen(false);
                        await logoutAction();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-300 hover:bg-rose-500/10"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="btn-primary rounded-full px-4 py-2 text-sm font-semibold text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/8 px-4 pb-4 md:hidden">
          <form action="/search" method="get" className="mb-3 mt-3">
            <div className="relative">
              <input
                name="q"
                placeholder="Search…"
                className="input-dark w-full rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500"
              />
            </div>
          </form>
          <nav className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/8 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}