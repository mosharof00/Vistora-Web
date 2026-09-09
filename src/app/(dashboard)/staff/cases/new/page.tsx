import { CandidateCaseForm } from "@/app/(dashboard)/admin/cases/case-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { createClient } from "@/lib/supabase/server";

export default async function StaffNewCasePage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string; order?: string; candidate?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const [
    { data: candidates },
    { data: batches },
    { data: agents },
    { data: staff },
  ] = await Promise.all([
    supabase
      .from("candidates")
      .select("id, candidate_code, full_name, status")
      .not("status", "in", "(cancelled,blacklisted)")
      .order("full_name"),
    supabase
      .from("visa_batches")
      .select(
        "id, batch_code, title, job_order_id, status, job_orders(order_code)"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("agents")
      .select("id, agent_code, full_name, agency_name")
      .eq("status", "active")
      .order("full_name"),
    supabase
      .from("employees")
      .select("id, employee_code, full_name")
      .eq("status", "active")
      .order("full_name"),
  ]);

  const candidateOptions = (candidates ?? []).map((c) => ({
    id: c.id,
    label: `${c.candidate_code} — ${c.full_name}`,
  }));

  const batchOptions = (batches ?? []).map((b) => {
    const order = b.job_orders as { order_code: string } | null;
    return {
      id: b.id,
      jobOrderId: b.job_order_id,
      label: `${b.batch_code} — ${b.title}${
        order ? ` (${order.order_code})` : ""
      }`,
    };
  });

  let prefillBatch =
    params.batch && batchOptions.some((b) => b.id === params.batch)
      ? params.batch
      : "";

  if (!prefillBatch && params.order) {
    const match = batchOptions.find((b) => b.jobOrderId === params.order);
    if (match) prefillBatch = match.id;
  }

  const prefillJobOrder =
    batchOptions.find((b) => b.id === prefillBatch)?.jobOrderId ??
    batchOptions[0]?.jobOrderId ??
    "";

  const prefillCandidate =
    params.candidate &&
    candidateOptions.some((c) => c.id === params.candidate)
      ? params.candidate
      : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <PageBackLink href="/staff/cases" label="Back to cases" />
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Add case</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Link a candidate to a visa batch to start processing.
        </p>
      </div>
      <CandidateCaseForm
        mode="create"
        basePath="/staff/cases"
        candidates={candidateOptions}
        batches={batchOptions}
        agents={(agents ?? []).map((a) => ({
          id: a.id,
          label: `${a.agent_code} — ${a.agency_name || a.full_name}`,
        }))}
        staff={(staff ?? []).map((s) => ({
          id: s.id,
          label: `${s.employee_code} — ${s.full_name}`,
        }))}
        defaultValues={{
          caseCode: "",
          candidateId: prefillCandidate,
          visaBatchId: prefillBatch || batchOptions[0]?.id || "",
          jobOrderId: prefillJobOrder,
          agentId: "",
          assignedStaffId: "",
          overallStatus: "registered",
          mofaNumber: "",
          processingOffice: "",
          tradeRemark: "",
          flightDate: "",
          flightNumber: "",
          remarks: "",
        }}
      />
    </div>
  );
}
