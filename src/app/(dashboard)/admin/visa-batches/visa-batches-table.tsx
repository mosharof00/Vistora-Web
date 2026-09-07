"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export type VisaBatchListRow = {
  id: string;
  batch_code: string;
  title: string;
  status: string;
  visa_number: string | null;
  quota_count: number | null;
  filled_count: number;
  pro_office: string | null;
  order_code: string | null;
  order_title: string | null;
  job_order_id: string;
};

export function VisaBatchesTable({ batches }: { batches: VisaBatchListRow[] }) {
  if (batches.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No visa batches yet.</p>
        <Link
          href="/admin/visa-batches/new"
          className={cn(buttonVariants(), "mt-4")}
        >
          Add visa batch
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="px-4 py-3 font-medium">Batch</th>
              <th className="px-4 py-3 font-medium">Job order</th>
              <th className="px-4 py-3 font-medium">Visa #</th>
              <th className="px-4 py-3 font-medium">Seats</th>
              <th className="px-4 py-3 font-medium">PRO</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => {
              const quota = batch.quota_count;
              const left =
                quota != null
                  ? Math.max(0, quota - batch.filled_count)
                  : null;
              return (
                <tr
                  key={batch.id}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/visa-batches/${batch.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {batch.batch_code}
                    </Link>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {batch.title}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {batch.order_code ? (
                      <>
                        <Link
                          href={`/admin/job-orders/${batch.job_order_id}`}
                          className="text-primary hover:underline"
                        >
                          {batch.order_code}
                        </Link>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {batch.order_title}
                        </p>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {batch.visa_number || "—"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {batch.filled_count}/{quota ?? "—"}
                    {left != null ? (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({left} left)
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {batch.pro_office || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={statusTone(batch.status)}>
                      {formatStatusLabel(batch.status)}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/visa-batches/${batch.id}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" })
                      )}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/visa-batches/${batch.id}/edit`}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
