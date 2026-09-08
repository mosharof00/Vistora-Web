import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { VisaBatchesTable } from "@/app/(dashboard)/admin/visa-batches/visa-batches-table";
import { VisaBatchesFlashToast } from "@/app/(dashboard)/admin/visa-batches/visa-batches-flash-toast";
import { ListFilters } from "@/components/layout/list-filters";
import { buttonVariants } from "@/components/ui/button";
import { ilikeOr } from "@/lib/list-filters";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { VISA_BATCH_STATUS_OPTIONS } from "@/lib/validations/visa-batch";

export default async function AdminVisaBatchesPage({
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
    .from("visa_batches")
    .select(
      "id, batch_code, title, status, visa_number, quota_count, filled_count, pro_office, job_order_id, job_orders(order_code, title)"
    )
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }
  const searchOr = params.q
    ? ilikeOr(["batch_code", "title", "visa_number", "pro_office"], params.q)
    : null;
  if (searchOr) {
    query = query.or(searchOr);
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load visa batches: {error.message}
      </div>
    );
  }

  const rows = (data ?? []).map((row) => {
    const order = row.job_orders as {
      order_code: string;
      title: string;
    } | null;
    return {
      id: row.id,
      batch_code: row.batch_code,
      title: row.title,
      status: row.status,
      visa_number: row.visa_number,
      quota_count: row.quota_count,
      filled_count: row.filled_count,
      pro_office: row.pro_office,
      job_order_id: row.job_order_id,
      order_code: order?.order_code ?? null,
      order_title: order?.title ?? null,
    };
  });

  const openCount = rows.filter((r) => r.status === "open").length;
  const seatsLeft = rows
    .filter((r) => r.status === "open" || r.status === "processing")
    .reduce((sum, r) => {
      if (r.quota_count == null) return sum;
      return sum + Math.max(0, r.quota_count - r.filled_count);
    }, 0);

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <VisaBatchesFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Visa Batches</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} shown · {openCount} open · {seatsLeft} seats remaining
          </p>
        </div>
        <Link
          href="/admin/visa-batches/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add visa batch
        </Link>
      </div>

      <Suspense fallback={null}>
        <ListFilters
          searchPlaceholder="Search batch code, title, visa no…"
          statusOptions={VISA_BATCH_STATUS_OPTIONS}
        />
      </Suspense>

      <VisaBatchesTable batches={rows} />
    </div>
  );
}
