"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { experienceNav, marketingNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { heroChrome } from "@/content/hero";
import { SiteLogo } from "@/components/shared/site-logo";
import { cn } from "@/lib/utils";

type HeroChromeProps = {
  /** Clicked / intentional section — not driven by film scroll. */
  activeId: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (id: string) => void;
};

export function HeroChrome({
  activeId,
  menuOpen,
  onToggleMenu,
  onNavigate,
}: HeroChromeProps) {
  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-8 md:py-6">
        <button
          type="button"
          className="pointer-events-auto"
          onClick={() => onNavigate("home")}
          aria-label="Home"
        >
          <SiteLogo invert />
        </button>

        <nav
          aria-label="Primary sections"
          className="pointer-events-auto hidden items-center rounded-full border border-white/15 bg-black/35 px-1.5 py-1.5 backdrop-blur-md md:flex"
        >
          {experienceNav.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[12px] tracking-wide text-white/70 transition-colors hover:text-white",
                  isActive && "bg-white/15 text-white",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          className="pointer-events-auto inline-flex items-center gap-2.5 text-[12px] tracking-[0.16em] text-white/90 uppercase"
          onClick={onToggleMenu}
          aria-expanded={menuOpen}
          aria-controls="hero-site-menu"
        >
          <span className="hidden sm:inline">
            {menuOpen ? heroChrome.closeMenu : heroChrome.openMenu}
          </span>
          {menuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="hero-site-menu"
            className="absolute inset-0 z-40 flex flex-col bg-[#050814]/[0.92] backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-1 flex-col justify-center px-8 md:px-16 lg:px-24">
              <p className="mb-8 text-[10px] tracking-[0.32em] text-white/45 uppercase md:mb-10">
                Navigate
              </p>
              <nav aria-label="Site" className="flex flex-col gap-1 md:gap-2">
                {marketingNav.map((item, index) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{
                      delay: 0.04 * index,
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group flex items-baseline gap-4 border-b border-white/10 py-3 text-left transition-colors hover:border-white/25 md:gap-6 md:py-4"
                    onClick={() => onNavigate(item.id)}
                  >
                    <span className="w-7 shrink-0 text-[11px] tabular-nums tracking-[0.18em] text-white/35 transition-colors group-hover:text-white/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-medium tracking-tight text-white/90 transition-colors group-hover:text-white">
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 px-8 py-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between md:px-16 lg:px-24">
              <p className="tracking-wide">{siteConfig.legalName}</p>
              <p className="text-white/40">{siteConfig.tagline}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
