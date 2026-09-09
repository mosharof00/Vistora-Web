import { notFound } from "next/navigation";

import { CandidateCaseForm } from "@/app/(dashboard)/admin/cases/case-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatStatusLabel, statusTone } from "@/lib/status";

export default async function StaffEditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: caseRow, error },
    { data: candidates },
    { data: batches },
    { data: agents },
    { data: staff },
  ] = await Promise.all([
    supabase.from("candidate_cases").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("candidates")
      .select("id, candidate_code, full_name")
      .order("full_name"),
    supabase
      .from("visa_batches")
      .select("id, batch_code, title, job_order_id, job_orders(order_code)")
      .order("created_at", { ascending: false }),
    supabase
      .from("agents")
      .select("id, agent_code, full_name, agency_name")
      .order("full_name"),
    supabase
      .from("employees")
      .select("id, employee_code, full_name")
      .eq("status", "active")
      .order("full_name"),
  ]);

  if (error || !caseRow) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href={`/staff/cases/${caseRow.id}`}
            label="Back to case"
          />
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Edit case
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {caseRow.case_code}
          </p>
        </div>
        <StatusBadge tone={statusTone(caseRow.overall_status)}>
          {formatStatusLabel(caseRow.overall_status)}
        </StatusBadge>
      </div>

      <CandidateCaseForm
        mode="edit"
        caseId={caseRow.id}
        basePath="/staff/cases"
        candidates={(candidates ?? []).map((c) => ({
          id: c.id,
          label: `${c.candidate_code} — ${c.full_name}`,
        }))}
        batches={(batches ?? []).map((b) => {
          const order = b.job_orders as { order_code: string } | null;
          return {
            id: b.id,
            jobOrderId: b.job_order_id,
            label: `${b.batch_code} — ${b.title}${
              order ? ` (${order.order_code})` : ""
            }`,
          };
        })}
        agents={(agents ?? []).map((a) => ({
          id: a.id,
          label: `${a.agent_code} — ${a.agency_name || a.full_name}`,
        }))}
        staff={(staff ?? []).map((s) => ({
          id: s.id,
          label: `${s.employee_code} — ${s.full_name}`,
        }))}
        defaultValues={{
          caseCode: caseRow.case_code,
          candidateId: caseRow.candidate_id,
          visaBatchId: caseRow.visa_batch_id,
          jobOrderId: caseRow.job_order_id,
          agentId: caseRow.agent_id ?? "",
          assignedStaffId: caseRow.assigned_staff_id ?? "",
          overallStatus: caseRow.overall_status,
          mofaNumber: caseRow.mofa_number ?? "",
          processingOffice: caseRow.processing_office ?? "",
          tradeRemark: caseRow.trade_remark ?? "",
          flightDate: caseRow.flight_date ?? "",
          flightNumber: caseRow.flight_number ?? "",
          remarks: caseRow.remarks ?? "",
        }}
      />
    </div>
  );
}
