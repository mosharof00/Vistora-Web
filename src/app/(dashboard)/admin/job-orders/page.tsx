import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { JobOrdersTable } from "@/app/(dashboard)/admin/job-orders/job-orders-table";
import { JobOrdersFlashToast } from "@/app/(dashboard)/admin/job-orders/job-orders-flash-toast";
import { ListFilters } from "@/components/layout/list-filters";
import { buttonVariants } from "@/components/ui/button";
import { ilikeOr, pickStatus } from "@/lib/list-filters";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { JOB_ORDER_STATUS_OPTIONS } from "@/lib/validations/job-order";

export default async function AdminJobOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    q?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("job_orders")
    .select(
      "id, order_code, title, status, country_code, required_count, filled_count, ticket_provision, salary_amount, salary_currency_code, employer_companies(trade_name, legal_name), job_categories(name)"
    )
    .order("created_at", { ascending: false });

  const status = pickStatus(params.status, JOB_ORDER_STATUS_OPTIONS);
  if (status) {
    query = query.eq("status", status);
  }
  const searchOr = params.q
    ? ilikeOr(["order_code", "title", "country_code"], params.q)
    : null;
  if (searchOr) {
    query = query.or(searchOr);
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load job orders: {error.message}
      </div>
    );
  }

  const rows = (data ?? []).map((row) => {
    const company = row.employer_companies as {
      trade_name: string | null;
      legal_name: string;
    } | null;
    const category = row.job_categories as { name: string } | null;
    return {
      id: row.id,
      order_code: row.order_code,
      title: row.title,
      status: row.status,
      country_code: row.country_code,
      required_count: row.required_count,
      filled_count: row.filled_count,
      ticket_provision: row.ticket_provision,
      salary_amount: row.salary_amount,
      salary_currency_code: row.salary_currency_code,
      company_name: company?.trade_name || company?.legal_name || null,
      category_name: category?.name ?? null,
    };
  });

  const openCount = rows.filter((r) => r.status === "open").length;
  const seats = rows
    .filter((r) => r.status === "open")
    .reduce(
      (sum, r) => sum + Math.max(0, r.required_count - r.filled_count),
      0
    );

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <JobOrdersFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Job Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} shown · {openCount} open · {seats} seats remaining
          </p>
        </div>
        <Link
          href="/admin/job-orders/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add job order
        </Link>
      </div>

      <Suspense fallback={null}>
        <ListFilters
          searchPlaceholder="Search order code, title, country…"
          statusOptions={JOB_ORDER_STATUS_OPTIONS}
        />
      </Suspense>

      <JobOrdersTable orders={rows} />
    </div>
  );
}
