"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { setEmployerCompanyStatus } from "@/app/(dashboard)/admin/companies/actions";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Company = Database["public"]["Tables"]["employer_companies"]["Row"];

export function CompaniesTable({ companies }: { companies: Company[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggleStatus(company: Company) {
    const next = company.status === "active" ? "inactive" : "active";
    startTransition(async () => {
      const result = await setEmployerCompanyStatus(company.id, next);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        next === "active" ? "Company marked active." : "Company marked inactive."
      );
      router.refresh();
    });
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">
          No employer companies yet.
        </p>
        <Link
          href="/admin/companies/new"
          className={cn(buttonVariants(), "mt-4")}
        >
          Add company
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="w-14 px-4 py-3 font-medium" />
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => {
              const displayName =
                company.trade_name || company.legal_name || company.company_code;
              return (
              <tr
                key={company.id}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-4 py-3">
                  <Avatar name={displayName} size="sm" />
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">
                  <Link
                    href={`/admin/companies/${company.id}`}
                    className="text-primary hover:underline"
                  >
                    {company.company_code}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">
                    {company.trade_name || company.legal_name}
                  </p>
                  {company.trade_name ? (
                    <p className="text-xs text-muted-foreground">
                      {company.legal_name}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <span className="uppercase tabular-nums">
                    {company.country_code}
                  </span>
                  {company.city ? (
                    <span className="text-muted-foreground">
                      {" "}
                      · {company.city}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <p>{company.contact_person || "—"}</p>
                  <p className="text-xs">
                    {company.contact_phone || company.contact_email || ""}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleStatus(company)}
                    title="Click to toggle status"
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <StatusBadge tone={statusTone(company.status)}>
                      {formatStatusLabel(company.status)}
                    </StatusBadge>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/companies/${company.id}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "gap-1.5"
                    )}
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/companies/${company.id}/edit`}
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
