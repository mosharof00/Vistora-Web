import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { CompanyPaymentsTable } from "@/app/(dashboard)/admin/company-payments/company-payments-table";
import { CompanyPaymentsFlashToast } from "@/app/(dashboard)/admin/company-payments/company-payments-flash-toast";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function AdminCompanyPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    company?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("company_payments")
    .select(
      "id, kind, amount, currency_code, method, reference_no, paid_at, employer_company_id, employer_companies(trade_name, legal_name), job_orders(order_code)"
    )
    .order("paid_at", { ascending: false });

  if (params.company) {
    query = query.eq("employer_company_id", params.company);
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load company payments: {error.message}
      </div>
    );
  }

  const rows = (data ?? []).map((row) => {
    const company = row.employer_companies as {
      trade_name: string | null;
      legal_name: string;
    } | null;
    const order = row.job_orders as { order_code: string } | null;
    return {
      id: row.id,
      kind: row.kind,
      amount: Number(row.amount),
      currency_code: row.currency_code,
      method: row.method,
      reference_no: row.reference_no,
      paid_at: row.paid_at,
      company_id: row.employer_company_id,
      company_name: company?.trade_name || company?.legal_name || null,
      order_code: order?.order_code ?? null,
    };
  });

  const outTotal = rows
    .filter((r) => r.kind === "investment_out")
    .reduce((sum, r) => sum + r.amount, 0);
  const inTotal = rows
    .filter((r) => r.kind === "reimbursement_in" || r.kind === "fee_in")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <CompanyPaymentsFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Company Payments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} records · out {outTotal.toLocaleString()} · in{" "}
            {inTotal.toLocaleString()}
            {params.company ? " · filtered by company" : ""}
          </p>
        </div>
        <Link
          href={
            params.company
              ? `/admin/company-payments/new?company=${params.company}`
              : "/admin/company-payments/new"
          }
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Record payment
        </Link>
      </div>

      <CompanyPaymentsTable payments={rows} />
    </div>
  );
}
