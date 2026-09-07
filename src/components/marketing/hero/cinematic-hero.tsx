"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { HeroCanvas } from "@/components/marketing/hero/hero-canvas";
import { HeroChrome } from "@/components/marketing/hero/hero-chrome";
import { HeroChapters } from "@/components/marketing/hero/hero-chapters";
import { HeroEditorialReveal } from "@/components/marketing/hero/hero-editorial-reveal";
import { HeroProgress } from "@/components/marketing/hero/hero-progress";
import { heroChrome } from "@/content/hero";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { chapterIndexFromProgress, heroScrollHeight } from "@/lib/motion";

/**
 * Top pill / menu targets — intentional jumps only.
 * Active state is set by click, not by film scroll.
 */
const navTargets: Record<string, number | string> = {
  home: 0,
  journey: 0.34,
  arrival: 0.7,
  services: "#services",
  about: "#about",
  tours: "#services",
  visa: "#services",
  contact: "#contact",
};

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const compact = useMediaQuery("(max-width: 768px)");
  const reduced = usePrefersReducedMotion();
  const [chapter, setChapter] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const hintOpacity = useTransform(scrollYProgress, [0, 0.84, 0.9], [1, 1, 0]);
  const chromeFade = useTransform(scrollYProgress, [0.86, 0.94], [1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setChapter(chapterIndexFromProgress(value));
  });

  function scrollToProgress(target: number) {
    const el = containerRef.current;
    if (!el) return;
    const start = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: start + target * distance, behavior: "smooth" });
  }

  function scrollToSelector(selector: string) {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
  }

  function onNavigate(id: string) {
    setMenuOpen(false);
    setActiveId(id);
    const target = navTargets[id];
    if (typeof target === "number") {
      scrollToProgress(target);
      return;
    }
    if (typeof target === "string") scrollToSelector(target);
  }

  function onCta(target: "next" | "services") {
    if (target === "next") {
      scrollToProgress(0.18);
      return;
    }
    setActiveId("services");
    scrollToSelector("#services");
  }

  const stageClass = compact
    ? "sticky top-2 mx-2 h-[calc(100svh-1rem)] overflow-hidden rounded-[1.25rem] bg-[#050814] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    : "sticky top-3 mx-3 h-[calc(100svh-1.5rem)] overflow-hidden rounded-[1.75rem] bg-[#050814] shadow-[0_24px_80px_rgba(0,0,0,0.5)]";

  if (reduced) {
    return (
      <section
        id="home"
        className={`relative ${compact ? "mx-2 mt-2" : "mx-3 mt-3"} h-[calc(100svh-1rem)] min-h-[560px] overflow-hidden rounded-[1.25rem] bg-[#050814] md:rounded-[1.75rem]`}
      >
        <Image
          src="/hero/sequence/ezgif-frame-219.jpg"
          alt="Paris at night — Eiffel Tower above the clouds"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <HeroChrome
          activeId={activeId}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((open) => !open)}
          onNavigate={onNavigate}
        />
        <div className="absolute top-[28%] left-1/2 z-20 w-[min(calc(100%-2.5rem),36rem)] -translate-x-1/2 text-center">
          <p className="mb-5 text-[11px] tracking-[0.28em] text-white/70">
            PARIS  /  48.8566° N
          </p>
          <h1 className="text-[clamp(1.85rem,5vw,4rem)] font-medium tracking-tight text-white">
            Paris begins before you land.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/80 md:text-base">
            Air tickets, visas, and work permits — arranged by Vistora before
            you leave the ground.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative"
      style={{ height: compact ? "560vh" : heroScrollHeight }}
    >
      <div className={stageClass}>
        <HeroCanvas progress={scrollYProgress} />

        <motion.div className="absolute inset-0 z-20" style={{ opacity: chromeFade }}>
          <HeroChrome
            activeId={activeId}
            menuOpen={menuOpen}
            onToggleMenu={() => setMenuOpen((open) => !open)}
            onNavigate={onNavigate}
          />
          <HeroChapters
            progress={scrollYProgress}
            onCta={onCta}
            compact={compact}
          />
          <HeroProgress progress={scrollYProgress} chapter={chapter} />
          <motion.div
            className="pointer-events-none absolute right-5 bottom-12 z-30 hidden flex-col items-center gap-3 sm:right-7 sm:bottom-14 md:flex"
            style={{ opacity: hintOpacity }}
          >
            <span
              className="text-[10px] tracking-[0.22em] text-white/75 uppercase"
              style={{ writingMode: "vertical-rl" }}
            >
              {heroChrome.scrollHint}
            </span>
            <span className="h-10 w-px bg-white/45" />
          </motion.div>
        </motion.div>

        <HeroEditorialReveal progress={scrollYProgress} />
      </div>
    </section>
  );
}
