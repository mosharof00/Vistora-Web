"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { heroChapters, type HeroChapter } from "@/content/hero";
import { cn } from "@/lib/utils";

const ranges: Record<string, [number, number, number, number]> = {
  home: [0, 0.02, 0.1, 0.16],
  threshold: [0.12, 0.18, 0.28, 0.36],
  between: [0.32, 0.4, 0.5, 0.58],
  "first-light": [0.52, 0.6, 0.7, 0.78],
  arrival: [0.72, 0.78, 0.86, 0.92],
};

function chapterOpacity(
  progress: number,
  [a, b, c, d]: [number, number, number, number],
) {
  if (progress <= a || progress >= d) return 0;
  if (progress < b) return (progress - a) / (b - a);
  if (progress <= c) return 1;
  return 1 - (progress - c) / (d - c);
}

function ChapterCopy({
  chapter,
  progress,
  onCta,
}: {
  chapter: HeroChapter;
  progress: MotionValue<number>;
  onCta: (target: "next" | "services") => void;
}) {
  const opacity = useTransform(progress, (p) => {
    let value = chapterOpacity(p, ranges[chapter.id]);
    if (p > 0.88) value *= Math.max(0, 1 - (p - 0.88) / 0.06);
    return value;
  });
  const y = useTransform(progress, ranges[chapter.id], [28, 0, 0, -16]);

  return (
    <motion.div
      className={cn(
        "absolute inset-x-6 top-[26%] z-20 max-w-3xl md:inset-x-12 md:top-[30%]",
        chapter.align === "center" &&
          "left-1/2 right-auto w-[min(100%-3rem,42rem)] -translate-x-1/2 text-center",
        chapter.align === "left" && "md:left-12 md:right-auto",
        chapter.align === "right" && "md:left-auto md:right-12 md:text-right",
      )}
      style={{ opacity, y }}
    >
      {chapter.coords ? (
        <p className="mb-5 text-[11px] tracking-[0.28em] text-white/75 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
          {chapter.coords}
        </p>
      ) : null}
      {chapter.kicker ? (
        <p className="mb-4 text-[11px] tracking-[0.22em] text-white/75 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
          {chapter.kicker}
        </p>
      ) : null}
      <h1 className="text-[clamp(2rem,5vw,4.25rem)] leading-[1.05] font-medium tracking-tight text-white text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
        {chapter.title}
      </h1>
      {chapter.body ? (
        <p
          className={cn(
            "mt-5 max-w-md text-[15px] leading-relaxed text-white/80 md:text-base drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]",
            chapter.align === "center" && "mx-auto",
            chapter.align === "right" && "md:ml-auto",
          )}
        >
          {chapter.body}
        </p>
      ) : null}
      {chapter.cta ? (
        <button
          type="button"
          onClick={() => onCta(chapter.cta!.target)}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm text-zinc-900 shadow-[0_10px_36px_rgba(0,0,0,0.35)]"
        >
          {chapter.cta.label}
          <span className="grid h-7 w-7 place-items-center rounded-full bg-zinc-900 text-white">
            {chapter.cta.target === "services" ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDown size={14} />
            )}
          </span>
        </button>
      ) : null}
    </motion.div>
  );
}

type HeroChaptersProps = {
  progress: MotionValue<number>;
  onCta: (target: "next" | "services") => void;
};

export function HeroChapters({ progress, onCta }: HeroChaptersProps) {
  return (
    <>
      {heroChapters.map((chapter) => (
        <ChapterCopy
          key={chapter.id}
          chapter={chapter}
          progress={progress}
          onCta={onCta}
        />
      ))}
    </>
  );
}
