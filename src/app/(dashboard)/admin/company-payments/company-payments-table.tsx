"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export type CompanyPaymentListRow = {
  id: string;
  kind: string;
  amount: number;
  currency_code: string;
  method: string;
  reference_no: string | null;
  paid_at: string;
  company_name: string | null;
  company_id: string;
  order_code: string | null;
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency.length === 3 ? currency : "BDT",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function CompanyPaymentsTable({
  payments,
}: {
  payments: CompanyPaymentListRow[];
}) {
  if (payments.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">
          No company payments yet.
        </p>
        <Link
          href="/admin/company-payments/new"
          className={cn(buttonVariants(), "mt-4")}
        >
          Record payment
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
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Kind</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {new Date(row.paid_at).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/companies/${row.company_id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {row.company_name || "—"}
                  </Link>
                  {row.order_code ? (
                    <p className="text-xs text-muted-foreground">
                      {row.order_code}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={statusTone(row.kind)}>
                    {formatStatusLabel(row.kind)}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">
                  {formatMoney(Number(row.amount), row.currency_code)}
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">
                  {row.method}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {row.reference_no || "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/company-payments/${row.id}/edit`}
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
