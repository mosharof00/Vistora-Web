"use client";

import { heroNav } from "@/config/navigation";
import { SiteLogo } from "@/components/shared/site-logo";
import {
  AccountMenu,
  type MarketingAccount,
} from "@/components/marketing/account-menu";
import { cn } from "@/lib/utils";

type HeroChromeProps = {
  activeId: string;
  account: MarketingAccount | null;
  onNavigate: (id: string) => void;
};

export function HeroChrome({
  activeId,
  account,
  onNavigate,
}: HeroChromeProps) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-4 py-4 sm:px-5 md:px-8 md:py-6">
      <button
        type="button"
        className="pointer-events-auto shrink-0"
        onClick={() => onNavigate("home")}
        aria-label="Home"
      >
        <SiteLogo invert />
      </button>

      <nav
        aria-label="Primary"
        className="pointer-events-auto hidden max-w-[min(100%,36rem)] items-center overflow-x-auto rounded-full border border-white/15 bg-black/35 px-1.5 py-1.5 backdrop-blur-md lg:flex"
      >
        {heroNav.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] tracking-wide text-white/70 transition-colors hover:text-white",
                isActive && "bg-white/15 text-white",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <AccountMenu account={account} tone="dark" />
    </header>
  );
}
