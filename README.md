# CineVerse

A full-stack movie, series & anime rating platform with a dark cinematic UI. Rate titles out of 10, write reviews, build a watchlist, and create an account — all backed by a local SQLite database.

![stack](https://img.shields.io/badge/Next.js%2016-App%20Router-black) ![stack](https://img.shields.io/badge/SQLite-better--sqlite3-003b57) ![stack](https://img.shields.io/badge/Auth-JWT%20cookie-8b5cf6)

## Features

- **76 curated titles** (movies, series, anime) with TMDB posters/backdrops, cast, overviews and taglines
- **Authentication** — sign up, log in, log out; bcrypt hashed passwords, JWT session cookie (`cine_token`)
- **Accounts** — profile page with username, bio, avatar color, password change and account deletion
- **Ratings & reviews** — rate any title 1–10 and leave a review; community scores are computed from all users' ratings
- **Watchlist** — save titles and revisit them on your watchlist page
- **Catalogue browsing** — filter by type (movies/TV/anime) and genre, sort by rating, year or title
- **Search** — instant search across titles and genres
- **Protected routes** — `/account` and `/watchlist` redirect anonymous visitors to `/login?next=…`
- **Standalone demo** — `cineverse.html` is a single-file, zero-backend copy of the catalogue (ratings/watchlist in `localStorage`)

## Tech

- **Next.js 16** (App Router, Turbopack) with `proxy.ts` route protection
- **Tailwind CSS 4** with a dark cinematic design (Inter + Sora fonts)
- **better-sqlite3** — SQLite database (`data/cineverse.db`, git-ignored) with `users`, `ratings` and `watchlist` tables
- **bcryptjs** for password hashing, **jose** for JWT signing/verification

## Getting Started

```bash
# install dependencies
npm install

# run the development server
npm run dev
# open http://localhost:3000
```

Format & checks:

```bash
npm run lint     # ESLint
npm run build    # production build (Turbopack)
npm start        # serve the production build
```

## Project structure

```
app/          → routes: /, /movies, /tv, /anime, /title/[type]/[id], /search, /login, /signup, /account, /watchlist
components/   → Navbar, HeroBanner, MovieCard, RatingWidget, WatchlistButton, FilterBar …
lib/          → db (SQLite), auth (JWT), actions (server actions), queries, catalogue data
proxy.ts      → guards /account and /watchlist
next.config.ts → externalizes better-sqlite3, TMDB image domains
```

## Deploying

> Note: the app uses a local SQLite file, which is ephemeral on serverless platforms (Netlify/Vercel functions). For a fully hosted deployment, add a persistent DB such as [Turso](https://turso.tech) or [SQLite Cloud](https://sqlitecloud.io) and swap the queries in `lib/db.ts`.

- **GitHub Pages** — push `cineverse.html` to a `gh-pages` branch (static, but no accounts/DB).
- **Netlify** — build command `npm run build`, publish directory `.next`; Netlify auto-detects Next.js via `@netlify/plugin-nextjs`.