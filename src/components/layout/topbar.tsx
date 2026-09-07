"use client";

import { Menu, X } from "lucide-react";

import { UserMenu } from "@/components/layout/user-menu";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import { LANDING_HOME, type UserRole } from "@/lib/auth/roles";

const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Administrator",
  staff: "Staff",
  hr: "HR",
  office_assistant: "Office Assistant",
  candidate: "Candidate",
};

/**
 * Top bar above role content. Mobile: hamburger toggles Import Mark-style drawer.
 * Background matches the page canvas; light bottom shadow only.
 */
export function Topbar({
  role,
  displayName,
  email,
  avatarUrl,
  unreadCount,
  menuOpen,
  onMenuToggle,
}: {
  role: UserRole;
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  unreadCount?: number;
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  const roleLabel = ROLE_LABEL[role];

  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center justify-between bg-background px-4 shadow-[0_1px_0_0_rgba(3,4,94,0.08),0_4px_10px_-6px_rgba(3,4,94,0.12)]">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onMenuToggle}
          aria-expanded={menuOpen}
          aria-controls="mobile-sidebar"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>

        <BrandLogo
          href={LANDING_HOME}
          className="md:hidden"
          showTagline={false}
        />

        <div className="hidden min-w-0 flex-col leading-tight md:flex">
          <span className="truncate text-sm font-medium">{displayName}</span>
          <span className="truncate text-xs text-muted-foreground">
            {roleLabel}
          </span>
        </div>
      </div>

      <UserMenu
        role={role}
        displayName={displayName}
        email={email}
        avatarUrl={avatarUrl}
        unreadCount={unreadCount}
      />
    </header>
  );
}
