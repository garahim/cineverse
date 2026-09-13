import Image from "next/image";
import Link from "next/link";
import { effectiveScore } from "@/lib/catalog";
import { formatScore, typeLabel } from "@/lib/utils";
import type { TitleWithStats } from "@/lib/types";

export default function HeroBanner({ title }: { title: TitleWithStats }) {
  const score = effectiveScore(title);
  return (
    <section className="relative h-[78vh] min-h-[540px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={title.backdrop}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/55 to-transparent" />
        <div className="vignette absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-16 sm:px-6">
        <div className="max-w-2xl animate-fade-up">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-300 backdrop-blur">
            Spotlight
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            {title.title}
          </h1>
          <p className="mt-2 italic text-violet-200/90">{title.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" className="text-gold" fill="currentColor" aria-hidden="true">
                <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="font-display text-2xl font-bold text-gold">{formatScore(score)}</span>
              <span className="text-slate-400">
                / 10
                {title.communityCount > 0 && ` · ${title.communityCount} community rating${title.communityCount === 1 ? "" : "s"}`}
              </span>
            </span>
            <span className="text-slate-500">•</span>
            <span>{title.year}</span>
            <span className="text-slate-500">•</span>
            <span>{typeLabel(title.type)}</span>
            <span className="text-slate-500">•</span>
            <span>{title.runtime}</span>
          </div>
          <p className="mt-4 line-clamp-3 max-w-xl leading-relaxed text-slate-300">{title.overview}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/title/${title.type}/${title.id}`}
              className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
            >
              Rate & Review
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href={`/title/${title.type}/${title.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              More info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}