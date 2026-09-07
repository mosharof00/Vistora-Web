"use client";

import Link from "next/link";
import { marketingNav, getWhatsAppHref } from "@/config/navigation";
import { SiteLogo } from "@/components/shared/site-logo";
import {
  AccountMenu,
  type MarketingAccount,
} from "@/components/marketing/account-menu";
import { cn } from "@/lib/utils";

type MarketingBoardHeaderProps = {
  account: MarketingAccount | null;
};

export function MarketingBoardHeader({ account }: MarketingBoardHeaderProps) {
  const whatsapp = getWhatsAppHref();

  return (
    <header className="sticky top-3 z-40 mx-1 mb-2 rounded-2xl border border-zinc-900/8 bg-[#f3eee4]/90 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:mx-2 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="#home" className="shrink-0">
          <SiteLogo />
        </Link>

        <nav
          aria-label="Site sections"
          className="hidden items-center gap-5 lg:flex"
        >
          {marketingNav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-[13px] font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "hidden rounded-full bg-[#03045e] px-4 py-2 text-[12px] font-medium tracking-wide text-white sm:inline-flex",
              )}
            >
              WhatsApp Us
            </a>
          ) : (
            <a
              href="#contact"
              className="hidden rounded-full bg-[#03045e] px-4 py-2 text-[12px] font-medium tracking-wide text-white sm:inline-flex"
            >
              Enquire Now
            </a>
          )}
          <AccountMenu account={account} tone="light" />
        </div>
      </div>
    </header>
  );
}
