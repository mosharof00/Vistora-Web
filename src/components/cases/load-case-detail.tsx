import { notFound } from "next/navigation";

import { CaseDetailView } from "@/components/cases/case-detail";
import { resolveUserDisplayNames } from "@/lib/candidates/resolve-user-names";
import type { CaseAreaPaths } from "@/lib/cases/paths";
import { createClient } from "@/lib/supabase/server";

export async function loadCaseDetailPage({
  id,
  paths,
  flash,
}: {
  id: string;
  paths: CaseAreaPaths;
  flash: { created?: string; updated?: string };
}) {
  const supabase = await createClient();

  const { data: caseRow, error } = await supabase
    .from("candidate_cases")
    .select(
      `*,
      candidates(id, candidate_code, full_name, phone),
      visa_batches(id, batch_code, title, visa_number),
      job_orders(id, order_code, title, employer_companies(id, trade_name, legal_name, company_code)),
      agents(id, agent_code, full_name, agency_name),
      employees:assigned_staff_id(id, employee_code, full_name)`
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !caseRow) notFound();

  const [{ data: steps }, { data: stepDefs }, { data: caseDocs }] =
    await Promise.all([
      supabase
        .from("case_process_steps")
        .select("step_code, status, reference_no, event_date, notes")
        .eq("candidate_case_id", id),
      supabase
        .from("process_step_defs")
        .select("code, label, sort_order")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("documents")
        .select("id, doc_type, file_name, created_at, uploaded_by")
        .eq("owner_type", "case")
        .eq("owner_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const nameMap = await resolveUserDisplayNames(supabase, [
    caseRow.created_by,
    caseRow.updated_by,
    ...(caseDocs ?? []).map((d) => d.uploaded_by),
  ]);

  const stepRows = (stepDefs ?? []).map((def) => {
    const step = (steps ?? []).find((s) => s.step_code === def.code);
    return {
      step_code: def.code,
      label: def.label,
      sort_order: def.sort_order,
      status: step?.status ?? "pending",
      reference_no: step?.reference_no ?? null,
      event_date: step?.event_date ?? null,
      notes: step?.notes ?? null,
    };
  });

  return (
    <CaseDetailView
      paths={paths}
      caseRow={caseRow}
      stepRows={stepRows}
      docs={(caseDocs ?? []).map((d) => ({
        ...d,
        uploaded_by_name: d.uploaded_by
          ? nameMap.get(d.uploaded_by) ?? null
          : null,
      }))}
      flash={flash}
      createdByName={
        caseRow.created_by ? nameMap.get(caseRow.created_by) ?? null : null
      }
      updatedByName={
        caseRow.updated_by ? nameMap.get(caseRow.updated_by) ?? null : null
      }
    />
  );
}
