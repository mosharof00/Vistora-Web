"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { editorial } from "@/content/editorial";

type HeroEditorialRevealProps = {
  progress: MotionValue<number>;
};

/** Cream board that rises at the end of the Paris film. */
export function HeroEditorialReveal({ progress }: HeroEditorialRevealProps) {
  const y = useTransform(progress, [0.9, 0.99], ["110%", "0%"]);
  const opacity = useTransform(progress, [0.9, 0.95], [0, 1]);

  return (
    <motion.section
      id="about"
      className="absolute inset-x-0 bottom-0 z-30 min-h-[44%] rounded-t-[1.35rem] bg-[#f3eee4] px-5 py-8 text-zinc-900 sm:rounded-t-[1.75rem] md:px-12 md:py-14"
      style={{ y, opacity }}
    >
      <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-[10px] tracking-[0.28em] text-zinc-500 uppercase md:text-[11px]">
          {editorial.kicker}
        </p>
        <h2 className="max-w-3xl text-[clamp(1.75rem,4.8vw,4.2rem)] leading-[0.98] font-medium tracking-tight text-balance">
          {editorial.title}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-600 md:text-[15px]">
          {editorial.body}
        </p>
      </div>
    </motion.section>
  );
}
