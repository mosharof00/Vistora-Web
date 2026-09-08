import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { PaymentsTable } from "@/app/(dashboard)/admin/payments/payments-table";
import { PaymentsFlashToast } from "@/app/(dashboard)/admin/payments/payments-flash-toast";
import { ListFilters } from "@/components/layout/list-filters";
import { buttonVariants } from "@/components/ui/button";
import { ilikeOr } from "@/lib/list-filters";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import {
  PAYMENT_DIRECTION_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "@/lib/validations/candidate-payment";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    candidate?: string;
    q?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("payments")
    .select(
      "id, direction, amount, currency_code, amount_bdt, method, reference_no, received_at, candidate_id, candidates(full_name, candidate_code), candidate_cases(case_code), fee_schedules(name), payment_gateways(name)"
    )
    .order("received_at", { ascending: false });

  if (params.candidate) {
    query = query.eq("candidate_id", params.candidate);
  }
  if (params.status === "in" || params.status === "out") {
    query = query.eq("direction", params.status);
  }
  if (params.q?.trim()) {
    const q = params.q.trim();
    const parts: string[] = [];
    const textOr = ilikeOr(["reference_no", "notes", "currency_code"], q);
    if (textOr) parts.push(textOr);
    const qLower = q.toLowerCase();
    for (const opt of PAYMENT_METHOD_OPTIONS) {
      if (
        opt.value.includes(qLower) ||
        opt.label.toLowerCase().includes(qLower)
      ) {
        parts.push(`method.eq.${opt.value}`);
      }
    }
    if (parts.length > 0) {
      query = query.or(parts.join(","));
    }
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load payments: {error.message}
      </div>
    );
  }

  const rows = (data ?? []).map((row) => {
    const candidate = row.candidates as {
      full_name: string;
      candidate_code: string;
    } | null;
    const caseRow = row.candidate_cases as { case_code: string } | null;
    const fee = row.fee_schedules as { name: string } | null;
    const gateway = row.payment_gateways as { name: string } | null;
    return {
      id: row.id,
      direction: row.direction,
      amount: Number(row.amount ?? row.amount_bdt),
      currency_code: row.currency_code || "BDT",
      method: row.method,
      reference_no: row.reference_no,
      received_at: row.received_at,
      candidate_id: row.candidate_id,
      candidate_name: candidate
        ? `${candidate.candidate_code} — ${candidate.full_name}`
        : null,
      case_code: caseRow?.case_code ?? null,
      fee_name: fee?.name ?? null,
      gateway_name: gateway?.name ?? null,
    };
  });

  const inTotal = rows
    .filter((r) => r.direction === "in")
    .reduce((sum, r) => sum + r.amount, 0);
  const outTotal = rows
    .filter((r) => r.direction === "out")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <PaymentsFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} shown · in {inTotal.toLocaleString()} · out{" "}
            {outTotal.toLocaleString()}
            {params.candidate ? " · filtered by candidate" : ""}
          </p>
        </div>
        <Link
          href={
            params.candidate
              ? `/admin/payments/new?candidate=${params.candidate}`
              : "/admin/payments/new"
          }
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Record payment
        </Link>
      </div>

      <Suspense fallback={null}>
        <ListFilters
          searchPlaceholder="Search reference, notes, method, currency…"
          statusOptions={PAYMENT_DIRECTION_OPTIONS}
          statusAllLabel="All directions"
        />
      </Suspense>

      <PaymentsTable payments={rows} />
    </div>
  );
}
