"use client";

import { useEffect, useState } from "react";
import { marketingNav } from "@/config/navigation";
import { SiteLogo } from "@/components/shared/site-logo";
import {
  AccountMenu,
  type MarketingAccount,
} from "@/components/marketing/account-menu";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  account: MarketingAccount | null;
};

const SECTION_IDS = marketingNav.map((item) => item.id);

export function SiteHeader({ account }: SiteHeaderProps) {
  const [activeId, setActiveId] = useState("home");
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    function onScroll() {
      const home = document.getElementById("home");
      if (home) {
        setOverHero(home.getBoundingClientRect().bottom > 140);
      }

      // Activate a little earlier — section near the upper quarter of the screen
      let bestId = "home";
      let bestDist = Number.POSITIVE_INFINITY;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        const dist = Math.abs(top - window.innerHeight * 0.18);
        if (top <= window.innerHeight * 0.55 && dist < bestDist) {
          bestDist = dist;
          bestId = id;
        }
      }
      setActiveId(bestId);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onNavigate(id: string) {
    setActiveId(id);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-3 px-4 py-4 sm:px-5 md:px-8 md:py-6">
      <button
        type="button"
        className="pointer-events-auto shrink-0"
        onClick={() => onNavigate("home")}
        aria-label="Home"
      >
        <SiteLogo invert={overHero} />
      </button>

      <nav
        aria-label="Primary"
        className={cn(
          "pointer-events-auto hidden max-w-[min(100%,40rem)] items-center overflow-x-auto rounded-full px-1.5 py-1.5 backdrop-blur-md lg:flex",
          overHero
            ? "border border-white/15 bg-black/45 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
            : "border border-zinc-900/10 bg-white/85 shadow-[0_8px_30px_rgba(15,23,42,0.08)]",
        )}
      >
        {marketingNav.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] tracking-wide transition-colors",
                overHero
                  ? cn(
                      "text-white/70 hover:text-white",
                      isActive && "bg-white/15 text-white",
                    )
                  : cn(
                      "text-zinc-600 hover:text-zinc-900",
                      isActive && "bg-zinc-900/8 text-zinc-900",
                    ),
              )}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onNavigate("contact")}
          className={cn(
            "hidden rounded-full px-4 py-2 text-[12px] font-semibold shadow-sm transition sm:inline-flex",
            overHero
              ? "bg-white text-zinc-900 hover:bg-white/90"
              : "bg-[#03045e] text-white hover:bg-[#0077b6]",
          )}
        >
          Book Consultation
        </button>
        <AccountMenu account={account} tone={overHero ? "dark" : "light"} />
      </div>
    </header>
  );
}
