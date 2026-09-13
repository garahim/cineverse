import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "CineVerse — Rate & Discover Movies, Shows & Anime",
    template: "%s · CineVerse",
  },
  description:
    "Track, rate and review your favorite movies, TV series and anime. Build a watchlist, discover top-rated titles and share your taste with the community.",
  keywords: ["movies", "tv series", "anime", "ratings", "reviews", "watchlist"],
};

export const viewport: Viewport = {
  themeColor: "#07070d",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#07070d] text-slate-200">
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}