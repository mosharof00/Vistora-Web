import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { StaffPageHeader } from "@/components/layout/staff-page";
import { StaffRecordList } from "@/components/layout/staff-record-list";
import { ListFilters } from "@/components/layout/list-filters";
import { ListFlashToast } from "@/components/layout/list-flash-toast";
import { buttonVariants } from "@/components/ui/button";
import { ilikeOr } from "@/lib/list-filters";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { PAYMENT_DIRECTION_OPTIONS } from "@/lib/validations/candidate-payment";

export default async function StaffPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    created?: string;
    updated?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("payments")
    .select(
      "id, direction, amount, currency_code, amount_bdt, method, reference_no, received_at, candidates(full_name, candidate_code)"
    )
    .order("received_at", { ascending: false })
    .limit(100);

  if (params.status === "in" || params.status === "out") {
    query = query.eq("direction", params.status);
  }
  const searchOr = params.q
    ? ilikeOr(["reference_no", "currency_code"], params.q)
    : null;
  if (searchOr) query = query.or(searchOr);

  const { data, error } = await query;
  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load payments: {error.message}
      </div>
    );
  }

  const items = (data ?? []).map((row) => {
    const candidate = row.candidates as {
      full_name: string;
      candidate_code: string;
    } | null;
    const amount = Number(row.amount ?? row.amount_bdt ?? 0);
    return {
      id: row.id,
      href: `/staff/payments/${row.id}`,
      title: `${amount.toLocaleString()} ${row.currency_code || "BDT"}`,
      subtitle: candidate
        ? `${candidate.candidate_code} — ${candidate.full_name}`
        : "No candidate",
      meta: [
        row.method,
        row.reference_no,
        row.received_at
          ? new Date(row.received_at).toLocaleDateString("en-GB")
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
      status: row.direction,
    };
  });

  return (
    <div className="space-y-5">
      <Suspense fallback={null}>
        <ListFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
          createdMessage="Payment recorded."
          updatedMessage="Payment updated."
          toastId="staff-payments-list"
        />
      </Suspense>
      <StaffPageHeader
        title="Payments"
        description={`${items.length} records — candidate fees and refunds`}
        action={
          <Link
            href="/staff/payments/new"
            className={cn(buttonVariants(), "gap-1.5")}
          >
            <Plus className="size-4" />
            Record payment
          </Link>
        }
      />
      <Suspense fallback={null}>
        <ListFilters
          searchPlaceholder="Search reference or currency…"
          statusOptions={PAYMENT_DIRECTION_OPTIONS}
          statusAllLabel="All directions"
        />
      </Suspense>
      <StaffRecordList
        items={items}
        emptyTitle="No payments yet"
        emptyDescription="Record candidate fee receipts and refunds here."
        emptyActionHref="/staff/payments/new"
        emptyActionLabel="Record payment"
      />
    </div>
  );
}
