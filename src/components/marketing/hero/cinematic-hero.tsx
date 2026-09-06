"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { AirplaneWindow } from "@/components/marketing/hero/airplane-window";
import { HeroCanvas } from "@/components/marketing/hero/hero-canvas";
import { HeroChrome } from "@/components/marketing/hero/hero-chrome";
import { HeroChapters } from "@/components/marketing/hero/hero-chapters";
import { HeroEditorialReveal } from "@/components/marketing/hero/hero-editorial-reveal";
import { HeroProgress } from "@/components/marketing/hero/hero-progress";
import { heroChrome } from "@/content/hero";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { chapterIndexFromProgress, heroScrollHeight } from "@/lib/motion";

const navTargets: Record<string, number | string> = {
  home: 0,
  journey: 0.4,
  arrival: 0.78,
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
    if (value < 0.18) setActiveId("home");
    else if (value < 0.72) setActiveId("journey");
    else setActiveId("arrival");
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
    const target = navTargets[id];
    if (typeof target === "number") {
      scrollToProgress(target);
      return;
    }
    if (typeof target === "string") scrollToSelector(target);
  }

  function onCta(target: "next" | "services") {
    if (target === "next") scrollToProgress(0.18);
    else scrollToSelector("#services");
  }

  if (reduced) {
    return (
      <section
        id="home"
        className="relative mx-3 mt-3 h-[calc(100svh-1.5rem)] min-h-[640px] overflow-hidden rounded-[1.75rem] bg-[#050814]"
      >
        <Image
          src="/hero/film/08.jpg"
          alt="Paris arrival"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <HeroChrome
          activeId="home"
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((open) => !open)}
          onNavigate={onNavigate}
        />
        <div className="absolute inset-x-6 top-[30%] z-20 max-w-2xl text-center md:inset-x-12">
          <p className="mb-5 text-[11px] tracking-[0.28em] text-white/70">
            PARIS  /  48.8566° N
          </p>
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-medium tracking-tight text-white">
            Paris begins before you land.
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative"
      style={{ height: heroScrollHeight }}
    >
      <div className="sticky top-3 mx-3 h-[calc(100svh-1.5rem)] overflow-hidden rounded-[1.75rem] bg-[#050814] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <HeroCanvas progress={scrollYProgress} />
        <AirplaneWindow progress={scrollYProgress} compact={compact} />

        <motion.div className="absolute inset-0 z-20" style={{ opacity: chromeFade }}>
          <HeroChrome
            activeId={activeId}
            menuOpen={menuOpen}
            onToggleMenu={() => setMenuOpen((open) => !open)}
            onNavigate={onNavigate}
          />
          <HeroChapters progress={scrollYProgress} onCta={onCta} />
          <HeroProgress progress={scrollYProgress} chapter={chapter} />
          <motion.div
            className="pointer-events-none absolute right-7 bottom-14 z-30 hidden flex-col items-center gap-3 md:flex"
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
