import { CandidatePaymentForm } from "@/app/(dashboard)/admin/payments/candidate-payment-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { createClient } from "@/lib/supabase/server";

export default async function StaffNewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ candidate?: string; case?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const [
    { data: candidates },
    { data: cases },
    { data: fees },
    { data: gateways },
    { data: currencies },
  ] = await Promise.all([
    supabase
      .from("candidates")
      .select("id, candidate_code, full_name")
      .order("full_name"),
    supabase
      .from("candidate_cases")
      .select("id, case_code, candidate_id")
      .order("created_at", { ascending: false }),
    supabase
      .from("fee_schedules")
      .select("id, fee_code, name, amount_bdt")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("payment_gateways")
      .select("id, name, code")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("currencies")
      .select("code, name")
      .eq("is_active", true)
      .order("code"),
  ]);

  const candidateOptions = (candidates ?? []).map((c) => ({
    id: c.id,
    label: `${c.candidate_code} — ${c.full_name}`,
  }));

  const prefillCandidate =
    params.candidate &&
    candidateOptions.some((c) => c.id === params.candidate)
      ? params.candidate
      : "";

  const caseOptions = (cases ?? []).map((c) => ({
    id: c.id,
    candidateId: c.candidate_id,
    label: c.case_code,
  }));

  const prefillCase =
    params.case && caseOptions.some((c) => c.id === params.case)
      ? params.case
      : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <PageBackLink href="/staff/payments" label="Back to payments" />
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Record payment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log a fee received from or refunded to a candidate.
        </p>
      </div>
      <CandidatePaymentForm
        mode="create"
        basePath="/staff/payments"
        candidates={candidateOptions}
        cases={caseOptions}
        feeSchedules={(fees ?? []).map((f) => ({
          id: f.id,
          label: `${f.fee_code} — ${f.name} (${Number(f.amount_bdt).toLocaleString()} BDT)`,
        }))}
        gateways={(gateways ?? []).map((g) => ({
          id: g.id,
          label: `${g.name} (${g.code})`,
        }))}
        currencies={currencies ?? []}
        defaultValues={{
          candidateId: prefillCandidate,
          candidateCaseId: prefillCase,
          feeScheduleId: "",
          direction: "in",
          amount: 0,
          currencyCode: "BDT",
          amountBdt: null,
          paymentGatewayId: "",
          method: "cash",
          referenceNo: "",
          receivedAt: new Date().toISOString().slice(0, 10),
          notes: "",
        }}
      />
    </div>
  );
}
