import { Suspense } from "react";

import { StaffPageHeader } from "@/components/layout/staff-page";
import { StaffRecordList } from "@/components/layout/staff-record-list";
import { ListFilters } from "@/components/layout/list-filters";
import { ilikeOr } from "@/lib/list-filters";
import { createClient } from "@/lib/supabase/server";
import { VISA_BATCH_STATUS_OPTIONS } from "@/lib/validations/visa-batch";

export default async function StaffVisaBatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("visa_batches")
    .select(
      "id, batch_code, title, status, visa_number, quota_count, filled_count, job_orders(order_code)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (params.status) {
    query = query.eq(
      "status",
      params.status as "open" | "processing" | "completed" | "cancelled"
    );
  }
  const searchOr = params.q
    ? ilikeOr(["batch_code", "title", "visa_number"], params.q)
    : null;
  if (searchOr) query = query.or(searchOr);

  const { data, error } = await query;
  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load visa batches: {error.message}
      </div>
    );
  }

  const items = (data ?? []).map((row) => {
    const order = row.job_orders as { order_code: string } | null;
    const seats =
      row.quota_count == null
        ? null
        : Math.max(0, row.quota_count - row.filled_count);
    return {
      id: row.id,
      href: `/staff/visa-batches/${row.id}`,
      title: row.title || row.batch_code,
      subtitle: `${row.batch_code}${row.visa_number ? ` · ${row.visa_number}` : ""}`,
      meta: [
        order?.order_code,
        seats != null ? `${seats} seats left` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      status: row.status,
    };
  });

  return (
    <div className="space-y-5">
      <StaffPageHeader
        title="Visa batches"
        description={`${items.length} shown — quotas and batch status`}
      />
      <Suspense fallback={null}>
        <ListFilters
          searchPlaceholder="Search batch code, title, visa no…"
          statusOptions={VISA_BATCH_STATUS_OPTIONS}
        />
      </Suspense>
      <StaffRecordList
        items={items}
        emptyTitle="No visa batches"
        emptyDescription="Visa batches linked to job orders will show here."
      />
    </div>
  );
}
