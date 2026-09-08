"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { selectFieldClassName } from "@/components/ui/select-field";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ListFilterOption = { value: string; label: string };

/**
 * URL-driven search + status filter for admin list pages.
 * Writes `q` and `status` query params (clears them when empty).
 */
export function ListFilters({
  searchPlaceholder = "Search…",
  statusOptions,
  statusParam = "status",
  statusAllLabel = "All statuses",
  className,
}: {
  searchPlaceholder?: string;
  statusOptions: readonly ListFilterOption[];
  statusParam?: string;
  statusAllLabel?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const qFromUrl = searchParams.get("q") ?? "";
  const statusFromUrl = searchParams.get(statusParam) ?? "";
  const [q, setQ] = useState(qFromUrl);

  useEffect(() => {
    setQ(qFromUrl);
  }, [qFromUrl]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (q === qFromUrl) return;
      pushParams({ q: q.trim() });
    }, 300);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce q only
  }, [q]);

  function pushParams(patch: { q?: string; status?: string }) {
    const next = new URLSearchParams(searchParams.toString());
    // Drop flash flags when filtering
    next.delete("created");
    next.delete("updated");

    const nextQ = patch.q !== undefined ? patch.q : (next.get("q") ?? "");
    const nextStatus =
      patch.status !== undefined
        ? patch.status
        : (next.get(statusParam) ?? "");

    if (nextQ) next.set("q", nextQ);
    else next.delete("q");

    if (nextStatus) next.set(statusParam, nextStatus);
    else next.delete(statusParam);

    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  const hasFilters = Boolean(qFromUrl || statusFromUrl);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border/60 sm:flex-row sm:items-center",
        isPending && "opacity-80",
        className
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
          aria-label="Search"
        />
      </div>
      <select
        className={cn(selectFieldClassName(), "sm:w-48")}
        value={statusFromUrl}
        onChange={(e) => pushParams({ status: e.target.value })}
        aria-label="Filter by status"
      >
        <option value="">{statusAllLabel}</option>
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasFilters ? (
        <button
          type="button"
          onClick={() => {
            setQ("");
            pushParams({ q: "", status: "" });
          }}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-1.5 shrink-0"
          )}
        >
          <X className="size-3.5" />
          Clear
        </button>
      ) : null}
    </div>
  );
}
