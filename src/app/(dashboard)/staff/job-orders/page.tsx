import { Suspense } from "react";

import { StaffPageHeader } from "@/components/layout/staff-page";
import { StaffRecordList } from "@/components/layout/staff-record-list";
import { ListFilters } from "@/components/layout/list-filters";
import { ilikeOr } from "@/lib/list-filters";
import { createClient } from "@/lib/supabase/server";
import { JOB_ORDER_STATUS_OPTIONS } from "@/lib/validations/job-order";

export default async function StaffJobOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("job_orders")
    .select(
      "id, order_code, title, status, country_code, required_count, filled_count, employer_companies(trade_name, legal_name)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (params.status) {
    query = query.eq(
      "status",
      params.status as "draft" | "open" | "fulfilled" | "closed" | "cancelled"
    );
  }
  const searchOr = params.q
    ? ilikeOr(["order_code", "title", "country_code"], params.q)
    : null;
  if (searchOr) query = query.or(searchOr);

  const { data, error } = await query;
  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load job orders: {error.message}
      </div>
    );
  }

  const items = (data ?? []).map((row) => {
    const company = row.employer_companies as {
      trade_name: string | null;
      legal_name: string;
    } | null;
    const seats = Math.max(0, row.required_count - row.filled_count);
    return {
      id: row.id,
      href: `/staff/job-orders/${row.id}`,
      title: row.title,
      subtitle: `${row.order_code} · ${row.country_code}`,
      meta: `${company?.trade_name || company?.legal_name || "Employer"} · ${seats} seats left`,
      status: row.status,
    };
  });

  return (
    <div className="space-y-5">
      <StaffPageHeader
        title="Job orders"
        description={`${items.length} shown — demand and open seats`}
      />
      <Suspense fallback={null}>
        <ListFilters
          searchPlaceholder="Search order code, title, country…"
          statusOptions={JOB_ORDER_STATUS_OPTIONS}
        />
      </Suspense>
      <StaffRecordList
        items={items}
        emptyTitle="No job orders"
        emptyDescription="Open job orders from employers will appear here for case assignment."
      />
    </div>
  );
}
