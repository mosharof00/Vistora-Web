"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { heroChapters, type HeroChapter } from "@/content/hero";
import { cn } from "@/lib/utils";

/** Fade in / hold / fade out windows per chapter (HorizonX pacing). */
/** [enterStart, fullyVisible, holdEnd, exitEnd] — departure fully on at scroll 0. */
const ranges: Record<string, [number, number, number, number]> = {
  departure: [-0.01, 0, 0.12, 0.18],
  threshold: [0.14, 0.2, 0.3, 0.36],
  between: [0.32, 0.38, 0.48, 0.54],
  "first-light": [0.5, 0.56, 0.66, 0.72],
  destination: [0.68, 0.74, 0.84, 0.9],
};

function chapterOpacity(
  progress: number,
  [a, b, c, d]: [number, number, number, number],
) {
  if (progress < a || progress >= d) return 0;
  if (progress < b) return (progress - a) / (b - a);
  if (progress <= c) return 1;
  return 1 - (progress - c) / (d - c);
}

function alignClasses(align: HeroChapter["align"], compact: boolean) {
  const top = compact ? "top-[22%]" : "top-[26%]";

  if (align === "center") {
    return cn(
      "left-1/2 w-[min(calc(100%-2.5rem),36rem)] -translate-x-1/2 text-center",
      top,
    );
  }

  if (align === "right") {
    return cn(
      "left-auto right-5 w-[min(calc(100%-2.5rem),32rem)] text-left md:right-12 md:w-[min(42%,34rem)] md:text-right lg:right-16",
      compact ? "top-[28%]" : "top-[32%]",
    );
  }

  // left — sit clearly inside the frame, never off-canvas
  return cn(
    "left-5 right-auto w-[min(calc(100%-2.5rem),32rem)] text-left md:left-12 md:w-[min(44%,34rem)] lg:left-16",
    top,
  );
}

function ChapterCopy({
  chapter,
  progress,
  onCta,
  compact,
}: {
  chapter: HeroChapter;
  progress: MotionValue<number>;
  onCta: (target: "next" | "services") => void;
  compact: boolean;
}) {
  const range = ranges[chapter.id];
  const opacity = useTransform(progress, (p) => {
    let value = chapterOpacity(p, range);
    if (p > 0.9) value *= Math.max(0, 1 - (p - 0.9) / 0.05);
    return value;
  });
  // First chapter starts settled at scroll 0; later chapters rise in.
  const y = useTransform(
    progress,
    range,
    chapter.id === "departure" ? [0, 0, 0, -16] : [28, 0, 0, -16],
  );

  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute z-20",
        alignClasses(chapter.align, compact),
      )}
      style={{ opacity, y }}
    >
      {chapter.coords ? (
        <p className="mb-4 text-[10px] tracking-[0.28em] text-white/80 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] md:mb-5 md:text-[11px]">
          {chapter.coords}
        </p>
      ) : null}
      {chapter.kicker ? (
        <p className="mb-3 text-[10px] tracking-[0.22em] text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] md:mb-4 md:text-[11px]">
          {chapter.kicker}
        </p>
      ) : null}
      <h1 className="whitespace-pre-line text-[clamp(1.85rem,4.8vw,4.1rem)] leading-[1.05] font-medium tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.6)]">
        {chapter.title}
      </h1>
      {chapter.body ? (
        <p
          className={cn(
            "mt-4 max-w-md text-[14px] leading-relaxed text-white/85 md:mt-5 md:text-[15px] drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)]",
            chapter.align === "center" && "mx-auto",
            chapter.align === "right" && "md:ml-auto",
          )}
        >
          {chapter.body}
        </p>
      ) : null}
      {chapter.cta ? (
        <div
          className={cn(
            "pointer-events-auto mt-6 md:mt-8",
            chapter.align === "center" && "flex justify-center",
            chapter.align === "right" && "md:flex md:justify-end",
          )}
        >
          <button
            type="button"
            onClick={() => onCta(chapter.cta!.target)}
            className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm text-zinc-900 shadow-[0_10px_36px_rgba(0,0,0,0.35)]"
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
        </div>
      ) : null}
    </motion.div>
  );
}

type HeroChaptersProps = {
  progress: MotionValue<number>;
  onCta: (target: "next" | "services") => void;
  compact?: boolean;
};

export function HeroChapters({
  progress,
  onCta,
  compact = false,
}: HeroChaptersProps) {
  return (
    <>
      {heroChapters.map((chapter) => (
        <ChapterCopy
          key={chapter.id}
          chapter={chapter}
          progress={progress}
          onCta={onCta}
          compact={compact}
        />
      ))}
    </>
  );
}
