"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PassportListRow = {
  id: string;
  passport_number: string;
  passport_type: string;
  issuing_country: string;
  expiry_date: string | null;
  is_current: boolean;
  full_name_as_in_passport: string | null;
  surname: string | null;
  given_names: string | null;
  candidate_id: string;
  candidate_name: string | null;
  candidate_code: string | null;
};

function displayName(row: PassportListRow) {
  if (row.full_name_as_in_passport) return row.full_name_as_in_passport;
  const parts = [row.given_names, row.surname].filter(Boolean);
  return parts.length ? parts.join(" ") : "—";
}

function isExpired(expiry: string | null) {
  if (!expiry) return false;
  const d = new Date(expiry);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function PassportsTable({
  passports,
  basePath = "/admin/passports",
  candidatesBasePath = "/admin/candidates",
}: {
  passports: PassportListRow[];
  basePath?: string;
  candidatesBasePath?: string;
}) {
  if (passports.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No passports yet.</p>
        <Link
          href={`${basePath}/new`}
          className={cn(buttonVariants(), "mt-4")}
        >
          Add passport
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="px-4 py-3 font-medium">Passport</th>
              <th className="px-4 py-3 font-medium">Name on booklet</th>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Expiry</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {passports.map((row) => {
              const expired = isExpired(row.expiry_date);
              return (
                <tr
                  key={row.id}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`${basePath}/${row.id}`}
                      className="font-medium tabular-nums text-primary hover:underline"
                    >
                      {row.passport_number}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {row.passport_type} · {row.issuing_country}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium">{displayName(row)}</td>
                  <td className="px-4 py-3">
                    {row.candidate_id ? (
                      <Link
                        href={`${candidatesBasePath}/${row.candidate_id}`}
                        className="text-primary hover:underline"
                      >
                        {row.candidate_code || "Candidate"}
                      </Link>
                    ) : (
                      "—"
                    )}
                    <p className="text-xs text-muted-foreground">
                      {row.candidate_name || ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">
                    {row.expiry_date
                      ? new Date(row.expiry_date).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {row.is_current ? (
                        <StatusBadge tone="success">Current</StatusBadge>
                      ) : (
                        <StatusBadge tone="neutral">History</StatusBadge>
                      )}
                      {expired ? (
                        <StatusBadge tone="danger">Expired</StatusBadge>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`${basePath}/${row.id}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" })
                      )}
                    >
                      View
                    </Link>
                    <Link
                      href={`${basePath}/${row.id}/edit`}
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
