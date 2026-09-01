"use client";

import { Menu, X } from "lucide-react";
import { experienceNav, marketingNav } from "@/config/navigation";
import { heroChrome } from "@/content/hero";
import { SiteLogo } from "@/components/shared/site-logo";
import { cn } from "@/lib/utils";

type HeroChromeProps = {
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
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 md:px-8 md:py-6">
        <button
          type="button"
          className="pointer-events-auto"
          onClick={() => onNavigate("home")}
        >
          <SiteLogo invert />
        </button>

        <nav
          aria-label="Experience"
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
                  "rounded-full px-4 py-1.5 text-[12px] tracking-wide text-white/70 transition-colors",
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
        >
          <span className="hidden sm:inline">
            {menuOpen ? heroChrome.closeMenu : heroChrome.openMenu}
          </span>
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {menuOpen ? (
        <div className="absolute inset-0 z-[35] bg-black/55 backdrop-blur-sm">
          <nav
            aria-label="Primary"
            className="flex h-full flex-col items-center justify-center gap-6"
          >
            {marketingNav.map((item) => (
              <button
                key={item.id}
                type="button"
                className="text-3xl font-medium tracking-tight text-white md:text-5xl"
                onClick={() => {
                  onNavigate(item.id);
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
