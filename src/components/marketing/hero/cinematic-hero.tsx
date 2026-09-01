"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { HeroChrome } from "@/components/marketing/hero/hero-chrome";
import { HeroChapters } from "@/components/marketing/hero/hero-chapters";
import { HeroLayers } from "@/components/marketing/hero/hero-layers";
import { HeroProgress } from "@/components/marketing/hero/hero-progress";
import { heroChrome } from "@/content/hero";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { chapterIndexFromProgress, heroScrollHeight } from "@/lib/motion";

const navTargets: Record<string, number | string> = {
  home: 0,
  journey: 0.4,
  arrival: 0.82,
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
  const progress = useSpring(scrollYProgress, {
    stiffness: 58,
    damping: 26,
    mass: 0.32,
    restDelta: 0.0005,
  });
  const hintOpacity = useTransform(progress, [0, 0.9, 1], [1, 0.85, 0]);

  useMotionValueEvent(progress, "change", (value) => {
    const next = chapterIndexFromProgress(value);
    setChapter(next);
    if (value < 0.22) setActiveId("home");
    else if (value < 0.76) setActiveId("journey");
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
    if (typeof target === "string") {
      scrollToSelector(target);
    }
  }

  function onCta(target: "next" | "services") {
    if (target === "next") scrollToProgress(0.22);
    else scrollToSelector("#services");
  }

  if (reduced) {
    return (
      <section
        id="home"
        className="relative mx-3 mt-3 h-[calc(100svh-1.5rem)] min-h-[640px] overflow-hidden rounded-[1.75rem] bg-[#050814]"
      >
        <Image
          src="/hero/eiffel-night.jpg"
          alt="Illuminated Eiffel Tower"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <HeroChrome
          activeId="home"
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((open) => !open)}
          onNavigate={onNavigate}
        />
        <div className="absolute inset-x-6 top-[30%] z-20 max-w-2xl md:inset-x-12">
          <p className="mb-5 text-[11px] tracking-[0.28em] text-white/70">
            PARIS  /  48.8566° N
          </p>
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-medium tracking-tight text-white">
            The journey begins before you land.
          </h1>
          <p className="mt-5 max-w-md text-white/75">
            Air tickets, visas, and work permits — arranged before you leave the
            ground.
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
      style={{ height: heroScrollHeight }}
    >
      <div className="sticky top-3 mx-3 h-[calc(100svh-1.5rem)] overflow-hidden rounded-[1.75rem] bg-[#050814] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <HeroLayers progress={progress} compact={compact} />
        <HeroChrome
          activeId={activeId}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((open) => !open)}
          onNavigate={onNavigate}
        />
        <HeroChapters progress={progress} onCta={onCta} />
        <HeroProgress progress={progress} chapter={chapter} />
        <motion.div
          className="pointer-events-none absolute right-7 bottom-14 z-30 hidden flex-col items-center gap-3 md:flex"
          style={{ opacity: hintOpacity }}
        >
          <span
            className="text-[10px] tracking-[0.22em] text-white/70 uppercase"
            style={{ writingMode: "vertical-rl" }}
          >
            {heroChrome.scrollHint}
          </span>
          <span className="h-10 w-px bg-white/40" />
        </motion.div>
      </div>
    </section>
  );
}
