import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/8">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg font-bold text-white">
              Cine<span className="text-gradient">Verse</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Rate, review and discover the best movies, TV series and anime — all in one beautifully dark place.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Browse</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li><Link href="/movies" className="hover:text-white">Movies</Link></li>
                <li><Link href="/tv" className="hover:text-white">TV Series</Link></li>
                <li><Link href="/anime" className="hover:text-white">Anime</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Account</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li><Link href="/login" className="hover:text-white">Log in</Link></li>
                <li><Link href="/signup" className="hover:text-white">Sign up</Link></li>
                <li><Link href="/watchlist" className="hover:text-white">Watchlist</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-white/8 pt-6 text-xs text-slate-600">
          © 2026 CineVerse. Demo project — catalog data is illustrative.
        </p>
      </div>
    </footer>
  );
}