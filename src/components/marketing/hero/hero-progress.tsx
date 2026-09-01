"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { heroChrome } from "@/content/hero";
import { padChapter } from "@/lib/utils";

type HeroProgressProps = {
  progress: MotionValue<number>;
  chapter: number;
};

export function HeroProgress({ progress, chapter }: HeroProgressProps) {
  const width = useTransform(progress, [0, 1], ["4%", "100%"]);

  return (
    <div className="pointer-events-none absolute inset-x-6 bottom-5 z-30 flex items-end gap-4 md:inset-x-8">
      <span className="w-8 text-[11px] tabular-nums tracking-[0.18em] text-white/80">
        {padChapter(chapter)}
      </span>
      <div className="relative mb-1.5 h-px flex-1 bg-white/25">
        <motion.div
          className="absolute inset-y-0 left-0 bg-white"
          style={{ width }}
        />
      </div>
      <span className="w-8 text-right text-[11px] tabular-nums tracking-[0.18em] text-white/80">
        {padChapter(heroChrome.lastChapter)}
      </span>
    </div>
  );
}
