"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";
import { StaffEmptyState } from "@/components/layout/staff-page";

export type StaffListItem = {
  id: string;
  href: string;
  title: string;
  subtitle?: string;
  meta?: string;
  status?: string;
  avatarName?: string;
  avatarSrc?: string | null;
};

export function StaffRecordList({
  items,
  emptyTitle,
  emptyDescription,
  emptyActionHref,
  emptyActionLabel,
}: {
  items: StaffListItem[];
  emptyTitle: string;
  emptyDescription: string;
  emptyActionHref?: string;
  emptyActionLabel?: string;
}) {
  if (items.length === 0) {
    return (
      <StaffEmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionHref={emptyActionHref}
        actionLabel={emptyActionLabel}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <ul className="divide-y divide-border/50">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/40 sm:px-5"
            >
              {item.avatarName ? (
                <Avatar
                  name={item.avatarName}
                  src={item.avatarSrc}
                  size="sm"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{item.title}</p>
                  {item.status ? (
                    <StatusBadge tone={statusTone(item.status)}>
                      {formatStatusLabel(item.status)}
                    </StatusBadge>
                  ) : null}
                </div>
                {item.subtitle ? (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>
                ) : null}
                {item.meta ? (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {item.meta}
                  </p>
                ) : null}
              </div>
              <ArrowRight
                className={cn("size-4 shrink-0 text-muted-foreground")}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
