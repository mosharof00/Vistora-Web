import { notFound } from "next/navigation";

import { CandidatePaymentForm } from "@/app/(dashboard)/admin/payments/candidate-payment-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { createClient } from "@/lib/supabase/server";

export default async function EditCandidatePaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: payment, error },
    { data: candidates },
    { data: cases },
    { data: fees },
    { data: gateways },
    { data: currencies },
  ] = await Promise.all([
    supabase.from("payments").select("*").eq("id", id).maybeSingle(),
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
      .order("name"),
    supabase
      .from("payment_gateways")
      .select("id, name, code")
      .order("sort_order"),
    supabase
      .from("currencies")
      .select("code, name")
      .eq("is_active", true)
      .order("code"),
  ]);

  if (error || !payment) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <PageBackLink href="/admin/payments" label="Back to payments" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit candidate payment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update amount, method, or linked case.
        </p>
      </div>
      <CandidatePaymentForm
        mode="edit"
        paymentId={payment.id}
        candidates={(candidates ?? []).map((c) => ({
          id: c.id,
          label: `${c.candidate_code} — ${c.full_name}`,
        }))}
        cases={(cases ?? []).map((c) => ({
          id: c.id,
          candidateId: c.candidate_id,
          label: c.case_code,
        }))}
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
          candidateId: payment.candidate_id ?? "",
          candidateCaseId: payment.candidate_case_id ?? "",
          feeScheduleId: payment.fee_schedule_id ?? "",
          direction: payment.direction,
          amount: Number(payment.amount ?? payment.amount_bdt),
          currencyCode: payment.currency_code || payment.currency || "BDT",
          amountBdt: Number(payment.amount_bdt),
          paymentGatewayId: payment.payment_gateway_id ?? "",
          method: payment.method,
          referenceNo: payment.reference_no ?? "",
          receivedAt: payment.received_at.slice(0, 10),
          notes: payment.notes ?? "",
        }}
      />
    </div>
  );
}
