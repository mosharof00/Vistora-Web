"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CandidatePaymentListRow = {
  id: string;
  direction: string;
  amount: number;
  currency_code: string;
  method: string;
  reference_no: string | null;
  received_at: string;
  candidate_id: string | null;
  candidate_name: string | null;
  case_code: string | null;
  fee_name: string | null;
  gateway_name: string | null;
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

export function PaymentsTable({
  payments,
}: {
  payments: CandidatePaymentListRow[];
}) {
  if (payments.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No candidate payments yet.</p>
        <Link
          href="/admin/payments/new"
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
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Direction</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Fee / gateway</th>
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
                  {new Date(row.received_at).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  {row.candidate_id ? (
                    <Link
                      href={`/admin/candidates/${row.candidate_id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {row.candidate_name || "—"}
                    </Link>
                  ) : (
                    <span className="font-medium">—</span>
                  )}
                  {row.case_code ? (
                    <p className="text-xs text-muted-foreground">
                      {row.case_code}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    tone={row.direction === "in" ? "success" : "warning"}
                  >
                    {row.direction === "in" ? "In" : "Out"}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">
                  {formatMoney(Number(row.amount), row.currency_code)}
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">
                  {row.method}
                  {row.reference_no ? (
                    <p className="font-mono text-xs normal-case">
                      {row.reference_no}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.fee_name || "—"}
                  {row.gateway_name ? (
                    <p className="text-xs">{row.gateway_name}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/payments/${row.id}/edit`}
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
