import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { CasesTable } from "@/app/(dashboard)/admin/cases/cases-table";
import { CasesFlashToast } from "@/app/(dashboard)/admin/cases/cases-flash-toast";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function AdminCasesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("candidate_cases")
    .select(
      "id, case_code, overall_status, mofa_number, processing_office, candidates(full_name, candidate_code), visa_batches(batch_code), job_orders(order_code), agents(full_name, agency_name)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load cases: {error.message}
      </div>
    );
  }

  const rows = (data ?? []).map((row) => {
    const candidate = row.candidates as {
      full_name: string;
      candidate_code: string;
    } | null;
    const batch = row.visa_batches as { batch_code: string } | null;
    const order = row.job_orders as { order_code: string } | null;
    const agent = row.agents as {
      full_name: string | null;
      agency_name: string | null;
    } | null;

    return {
      id: row.id,
      case_code: row.case_code,
      overall_status: row.overall_status,
      mofa_number: row.mofa_number,
      processing_office: row.processing_office,
      candidate_name: candidate?.full_name ?? null,
      candidate_code: candidate?.candidate_code ?? null,
      batch_code: batch?.batch_code ?? null,
      order_code: order?.order_code ?? null,
      agent_name: agent?.agency_name || agent?.full_name || null,
    };
  });

  const processing = rows.filter((r) => r.overall_status === "processing")
    .length;
  const cleared = rows.filter((r) =>
    ["cleared", "ticketed", "deployed"].includes(r.overall_status)
  ).length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <CasesFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cases</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} total · {processing} processing · {cleared} cleared+
          </p>
        </div>
        <Link
          href="/admin/cases/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add case
        </Link>
      </div>

      <CasesTable cases={rows} />
    </div>
  );
}
