"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { setFeeScheduleActive } from "@/app/(dashboard)/admin/fee-schedules/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { COUNTRY_OPTIONS } from "@/lib/validations/fee-schedule";
import { cn } from "@/lib/utils";

export type FeeScheduleListRow = {
  id: string;
  name: string;
  fee_code: string;
  amount_bdt: number;
  currency: string;
  country_code: string | null;
  is_active: boolean;
  job_categories: { name: string } | null;
};

function countryLabel(code: string | null) {
  if (!code) return "Any";
  return COUNTRY_OPTIONS.find((c) => c.code === code)?.label ?? code;
}

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency || "BDT",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

export function FeeSchedulesTable({
  schedules,
}: {
  schedules: FeeScheduleListRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggleActive(row: FeeScheduleListRow) {
    startTransition(async () => {
      const result = await setFeeScheduleActive(row.id, !row.is_active);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        row.is_active ? "Fee schedule deactivated." : "Fee schedule activated."
      );
      router.refresh();
    });
  }

  if (schedules.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No fee schedules yet.</p>
        <Link
          href="/admin/fee-schedules/new"
          className={cn(buttonVariants(), "mt-4")}
        >
          Add fee schedule
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="px-4 py-3 font-medium">Fee</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/fee-schedules/${row.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {row.name}
                  </Link>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {row.fee_code}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {countryLabel(row.country_code)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.job_categories?.name ?? "Any"}
                </td>
                <td className="px-4 py-3 tabular-nums font-medium">
                  {formatAmount(Number(row.amount_bdt), row.currency)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleActive(row)}
                    title="Click to toggle"
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <StatusBadge tone={row.is_active ? "success" : "neutral"}>
                      {row.is_active ? "Active" : "Inactive"}
                    </StatusBadge>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/fee-schedules/${row.id}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "gap-1.5"
                    )}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
