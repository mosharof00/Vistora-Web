"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import {
  dashboardPathForRole,
  ROLE_HOME,
  type UserRole,
} from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

export type MarketingAccount = {
  role: UserRole;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
};

type AccountMenuProps = {
  account: MarketingAccount | null;
  /** Dark cinematic hero vs cream board */
  tone?: "dark" | "light";
};

export function AccountMenu({ account, tone = "dark" }: AccountMenuProps) {
  if (!account) {
    return (
      <div className="pointer-events-auto flex items-center gap-2">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            tone === "dark"
              ? "text-white/85 hover:bg-white/10 hover:text-white"
              : "text-zinc-700 hover:bg-zinc-900/5 hover:text-zinc-900",
          )}
        >
          Sign in
        </Link>
      </div>
    );
  }

  const dashboardHref = dashboardPathForRole(account.role);

  return (
    <div className="pointer-events-auto">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            tone === "dark"
              ? "focus-visible:ring-white/40 focus-visible:ring-offset-[#050814]"
              : "focus-visible:ring-[#0077b6]/50 focus-visible:ring-offset-[#f3eee4]",
          )}
          aria-label="Open account menu"
        >
          <Avatar
            name={account.displayName}
            src={account.avatarUrl}
            size="sm"
            className={cn(
              tone === "dark" && "ring-1 ring-white/25",
            )}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {account.displayName}
            </p>
            {account.email ? (
              <p className="truncate text-xs text-muted-foreground">
                {account.email}
              </p>
            ) : null}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              window.location.href = dashboardHref;
            }}
          >
            <LayoutDashboard />
            Go to dashboard
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              window.location.href = ROLE_HOME[account.role];
            }}
          >
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="p-0 focus:bg-transparent"
          >
            <form action="/auth/signout" method="post" className="w-full">
              <button
                type="submit"
                className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-sm"
              >
                <LogOut />
                Log out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
