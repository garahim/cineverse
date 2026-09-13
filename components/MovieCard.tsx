import Image from "next/image";
import Link from "next/link";
import { effectiveScore } from "@/lib/catalog";
import { formatScore, typeLabel } from "@/lib/utils";
import type { TitleWithStats } from "@/lib/types";

export default function MovieCard({
  title,
  width = "full",
  className = "",
}: {
  title: TitleWithStats;
  width?: "full" | "row";
  className?: string;
}) {
  const score = effectiveScore(title);
  return (
    <Link
      href={`/title/${title.type}/${title.id}`}
      className={`group relative block overflow-hidden rounded-2xl border border-white/8 bg-card transition-all duration-300 hover:-translate-y-1 card-glow ${
        width === "full" ? "w-full" : "w-40 shrink-0 sm:w-48"
      } ${className}`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={title.poster}
          alt={title.title}
          fill
          sizes="(min-width:1280px) 16vw, (min-width:768px) 20vw, 44vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 backdrop-blur">
          <svg width="11" height="11" viewBox="0 0 24 24" className="text-gold" fill="currentColor" aria-hidden="true">
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="text-xs font-semibold text-amber-300">{formatScore(score)}</span>
          {title.communityCount > 0 && (
            <span className="text-[10px] font-medium text-slate-400">· {title.communityCount}</span>
          )}
        </div>
        <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-300 backdrop-blur">
          {typeLabel(title.type)}
        </div>
        {/* Hover reveal */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="line-clamp-3 text-[11px] leading-snug text-slate-300">{title.overview}</p>
        </div>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 font-display text-sm font-semibold text-white">{title.title}</h3>
        <p className="mt-1 text-[11px] text-slate-400">
          {title.year} · {title.runtime}
        </p>
      </div>
    </Link>
  );
}