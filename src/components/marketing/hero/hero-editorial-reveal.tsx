"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { editorial } from "@/content/editorial";

type HeroEditorialRevealProps = {
  progress: MotionValue<number>;
};

/** Cream board that rises over the film at the end (screenshot 9). */
export function HeroEditorialReveal({ progress }: HeroEditorialRevealProps) {
  const y = useTransform(progress, [0.86, 0.98], ["108%", "0%"]);
  const opacity = useTransform(progress, [0.86, 0.92], [0, 1]);

  return (
    <motion.section
      id="about"
      className="absolute inset-x-0 bottom-0 z-30 min-h-[46%] rounded-t-[1.75rem] bg-[#f3eee4] px-6 py-10 text-zinc-900 md:px-12 md:py-14"
      style={{ y, opacity }}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          {editorial.kicker}
        </p>
        <h2 className="max-w-3xl text-[clamp(2rem,4.8vw,4.2rem)] leading-[0.98] font-medium tracking-tight text-balance">
          {editorial.title}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-600 md:text-[15px]">
          {editorial.body}
        </p>
      </div>
    </motion.section>
  );
}
