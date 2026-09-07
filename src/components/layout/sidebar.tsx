"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  UserRound,
  Users,
  Briefcase,
  Layers,
  FolderOpen,
  Wallet,
  CreditCard,
  CalendarCheck,
  CalendarOff,
  Banknote,
  FileText,
  FileBarChart,
  Settings,
  Tags,
  Coins,
  Receipt,
  CircleDollarSign,
  HandCoins,
  ChevronDown,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import {
  isNavGroup,
  type NavEntry,
  type NavIcon,
  type NavItem,
} from "@/components/layout/nav-config";
import { ROLE_HOME, type UserRole } from "@/lib/auth/roles";

const ICONS: Record<NavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  companies: Building2,
  agents: UserRound,
  candidates: Users,
  orders: Briefcase,
  batches: Layers,
  cases: FolderOpen,
  payments: Wallet,
  gateways: CreditCard,
  attendance: CalendarCheck,
  leave: CalendarOff,
  salary: Banknote,
  employees: Users,
  documents: FileText,
  reports: FileBarChart,
  categories: Tags,
  currencies: Coins,
  fees: Receipt,
  expenses: CircleDollarSign,
  commissions: HandCoins,
};

function isItemActive(pathname: string, href: string) {
  const isRoot = href.split("/").length === 2;
  return isRoot
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function groupHasActive(pathname: string, items: NavItem[]) {
  return items.some((item) => isItemActive(pathname, item.href));
}

function NavLink({
  item,
  pathname,
  onNavigate,
  nested,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
  nested?: boolean;
}) {
  const active = isItemActive(pathname, item.href);
  const Icon = ICONS[item.icon];

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl text-sm font-medium transition-colors",
        nested ? "px-3 py-2" : "px-3 py-2.5",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className={cn("shrink-0", nested ? "size-4" : "size-[18px]")} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function NavGroupBlock({
  id,
  label,
  items,
  pathname,
  onNavigate,
}: {
  id: string;
  label: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const childActive = groupHasActive(pathname, items);
  const [open, setOpen] = useState(childActive);

  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive, pathname]);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`nav-group-${id}`}
        className={cn(
          "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
          // Same ink as selected child text (#03045e), never the light pill fill.
          childActive
            ? "text-sidebar-primary-foreground"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-60 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <div id={`nav-group-${id}`} className="ml-3 space-y-0.5 border-l border-sidebar-foreground/10 pl-2">
          {items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onNavigate={onNavigate}
              nested
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SidebarNav({
  entries,
  pathname,
  settingsHref,
  onNavigate,
}: {
  entries: NavEntry[];
  pathname: string;
  settingsHref: string;
  onNavigate?: () => void;
}) {
  const settingsActive = isItemActive(pathname, settingsHref);

  return (
    <>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
        {entries.map((entry) =>
          isNavGroup(entry) ? (
            <NavGroupBlock
              key={entry.id}
              id={entry.id}
              label={entry.label}
              items={entry.items}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ) : (
            <NavLink
              key={entry.href}
              item={entry}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          )
        )}
      </nav>

      <div className="shrink-0 p-3">
        <Link
          href={settingsHref}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            settingsActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings className="size-[18px]" />
          Settings
        </Link>
      </div>
    </>
  );
}

function SidebarHeader({
  homeHref,
  onClose,
  showClose,
}: {
  homeHref: string;
  onClose?: () => void;
  showClose?: boolean;
}) {
  return (
    <div className="flex h-14 items-center justify-between gap-2 px-3">
      <BrandLogo href={homeHref} className="min-w-0 flex-1" />
      {showClose && onClose ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="size-5" />
        </Button>
      ) : null}
    </div>
  );
}

export function Sidebar({
  entries,
  homeHref,
  role,
  mobileOpen,
  onMobileClose,
}: {
  entries: NavEntry[];
  homeHref: string;
  role: UserRole;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const settingsHref = `${ROLE_HOME[role]}/settings`;

  useEffect(() => {
    onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close on navigate
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const asideClass =
    "flex h-dvh w-64 flex-col bg-sidebar text-sidebar-foreground";

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Close menu"
          onClick={onMobileClose}
        />
      ) : null}

      {/* Mobile drawer — Import Mark pattern */}
      <aside
        id="mobile-sidebar"
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out md:hidden",
          asideClass,
          mobileOpen ? "translate-x-0" : "pointer-events-none -translate-x-full"
        )}
      >
        <SidebarHeader homeHref={homeHref} showClose onClose={onMobileClose} />
        <SidebarNav
          entries={entries}
          pathname={pathname}
          settingsHref={settingsHref}
          onNavigate={onMobileClose}
        />
      </aside>

      {/* Desktop fixed column */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden md:flex",
          asideClass
        )}
      >
        <SidebarHeader homeHref={homeHref} />
        <SidebarNav
          entries={entries}
          pathname={pathname}
          settingsHref={settingsHref}
        />
      </aside>
    </>
  );
}
