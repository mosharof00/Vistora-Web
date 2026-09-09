import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { CasesFlashToast } from "@/app/(dashboard)/admin/cases/cases-flash-toast";
import { CasesTable } from "@/components/cases/cases-table";
import { ListFilters } from "@/components/layout/list-filters";
import { buttonVariants } from "@/components/ui/button";
import type { CaseAreaPaths } from "@/lib/cases/paths";
import { ilikeOr } from "@/lib/list-filters";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { CASE_STATUS_OPTIONS } from "@/lib/validations/candidate-case";
import type { Database } from "@/types/database.types";

type CaseStatus = Database["public"]["Enums"]["case_overall_status"];

export async function CasesListPage({
  paths,
  searchParams,
  assignedStaffId,
}: {
  paths: CaseAreaPaths;
  searchParams: {
    created?: string;
    updated?: string;
    q?: string;
    status?: string;
    mine?: string;
  };
  /** When set, enables the Assigned-to-me toggle for this employee id */
  assignedStaffId?: string;
}) {
  const params = searchParams;
  const supabase = await createClient();
  const mineOnly = Boolean(assignedStaffId) && params.mine === "1";

  let query = supabase
    .from("candidate_cases")
    .select(
      "id, case_code, overall_status, mofa_number, processing_office, candidates(full_name, candidate_code), visa_batches(batch_code), job_orders(order_code), agents(full_name, agency_name)"
    )
    .order("created_at", { ascending: false });

  if (mineOnly && assignedStaffId) {
    query = query.eq("assigned_staff_id", assignedStaffId);
  }
  if (params.status) {
    query = query.eq("overall_status", params.status as CaseStatus);
  }
  const searchOr = params.q
    ? ilikeOr(["case_code", "mofa_number", "processing_office"], params.q)
    : null;
  if (searchOr) {
    query = query.or(searchOr);
  }

  const { data, error } = await query;

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
            {mineOnly
              ? `${rows.length} assigned to you`
              : `${rows.length} shown · ${processing} processing · ${cleared} cleared+`}
          </p>
        </div>
        <Link
          href={`${paths.cases}/new`}
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add case
        </Link>
      </div>

      {assignedStaffId ? (
        <div className="flex flex-wrap gap-2">
          <Link
            href={paths.cases}
            className={cn(
              buttonVariants({
                variant: mineOnly ? "outline" : "secondary",
                size: "sm",
              })
            )}
          >
            All cases
          </Link>
          <Link
            href={`${paths.cases}?mine=1`}
            className={cn(
              buttonVariants({
                variant: mineOnly ? "secondary" : "outline",
                size: "sm",
              })
            )}
          >
            Assigned to me
          </Link>
        </div>
      ) : null}

      <Suspense fallback={null}>
        <ListFilters
          searchPlaceholder="Search case code, MOFA, office…"
          statusOptions={CASE_STATUS_OPTIONS}
        />
      </Suspense>

      <CasesTable cases={rows} basePath={paths.cases} />
    </div>
  );
}
