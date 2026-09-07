"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export type CaseListRow = {
  id: string;
  case_code: string;
  overall_status: string;
  mofa_number: string | null;
  processing_office: string | null;
  candidate_name: string | null;
  candidate_code: string | null;
  batch_code: string | null;
  order_code: string | null;
  agent_name: string | null;
};

export function CasesTable({ cases }: { cases: CaseListRow[] }) {
  if (cases.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No cases yet.</p>
        <Link href="/admin/cases/new" className={cn(buttonVariants(), "mt-4")}>
          Add case
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="px-4 py-3 font-medium">Case</th>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Batch / Order</th>
              <th className="px-4 py-3 font-medium">MOFA</th>
              <th className="px-4 py-3 font-medium">Agent</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/cases/${row.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {row.case_code}
                  </Link>
                  {row.processing_office ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {row.processing_office}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <p>{row.candidate_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.candidate_code}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p>{row.batch_code || "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.order_code}
                  </p>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {row.mofa_number || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.agent_name || "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={statusTone(row.overall_status)}>
                    {formatStatusLabel(row.overall_status)}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/cases/${row.id}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" })
                    )}
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/cases/${row.id}/edit`}
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
