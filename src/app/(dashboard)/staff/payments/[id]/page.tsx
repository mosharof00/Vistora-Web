import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Pencil, UserRound } from "lucide-react";

import { CandidatePaymentForm } from "@/app/(dashboard)/admin/payments/candidate-payment-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { ListFlashToast } from "@/components/layout/list-flash-toast";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export default async function StaffPaymentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string; edit?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  const editing = flash.edit === "1";
  const supabase = await createClient();

  const [
    { data: payment, error },
    { data: candidates },
    { data: cases },
    { data: fees },
    { data: gateways },
    { data: currencies },
  ] = await Promise.all([
    supabase
      .from("payments")
      .select(
        "*, candidates(id, candidate_code, full_name), candidate_cases(id, case_code), fee_schedules(fee_code, name), payment_gateways(name, code)"
      )
      .eq("id", id)
      .maybeSingle(),
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

  const candidate = payment.candidates as {
    id: string;
    candidate_code: string;
    full_name: string;
  } | null;
  const caseRow = payment.candidate_cases as {
    id: string;
    case_code: string;
  } | null;
  const fee = payment.fee_schedules as {
    fee_code: string;
    name: string;
  } | null;
  const gateway = payment.payment_gateways as {
    name: string;
    code: string;
  } | null;

  const amount = Number(payment.amount ?? payment.amount_bdt ?? 0);
  const currency = payment.currency_code || payment.currency || "BDT";

  if (editing) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <PageBackLink
            href={`/staff/payments/${payment.id}`}
            label="Back to payment"
          />
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Edit payment
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update amount, method, or linked case.
          </p>
        </div>
        <CandidatePaymentForm
          mode="edit"
          paymentId={payment.id}
          basePath="/staff/payments"
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
            amount,
            currencyCode: currency,
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Suspense fallback={null}>
        <ListFlashToast
          created={flash.created === "1"}
          updated={flash.updated === "1"}
          createdMessage="Payment recorded."
          updatedMessage="Payment updated."
          toastId={`staff-payment-${id}`}
        />
      </Suspense>

      <div>
        <PageBackLink href="/staff/payments" label="Back to payments" />
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight tabular-nums">
                {amount.toLocaleString()} {currency}
              </h1>
              <StatusBadge tone={statusTone(payment.direction)}>
                {formatStatusLabel(payment.direction)}
              </StatusBadge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {candidate
                ? `${candidate.candidate_code} — ${candidate.full_name}`
                : "Candidate payment"}
            </p>
          </div>
          <Link
            href={`/staff/payments/${payment.id}?edit=1`}
            className={cn(buttonVariants(), "gap-1.5")}
          >
            <Pencil className="size-4" />
            Edit
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Method</p>
          <p className="mt-2 text-lg font-semibold capitalize">
            {String(payment.method).replaceAll("_", " ")}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Received</p>
          <p className="mt-2 text-lg font-semibold">
            {new Date(payment.received_at).toLocaleDateString("en-GB")}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Reference</p>
          <p className="mt-2 truncate text-lg font-semibold">
            {payment.reference_no || "—"}
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Linked records and notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {candidate ? (
            <Link
              href={`/staff/candidates/${candidate.id}`}
              className="flex items-start gap-3 rounded-2xl bg-secondary/55 px-4 py-4 ring-1 ring-border/50 transition-colors hover:bg-secondary/80"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="size-5" />
              </span>
              <span className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Candidate
                </p>
                <p className="mt-0.5 font-semibold">{candidate.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {candidate.candidate_code}
                </p>
              </span>
            </Link>
          ) : null}

          {caseRow ? (
            <Link
              href={`/staff/cases/${caseRow.id}`}
              className="block rounded-2xl bg-secondary/45 px-4 py-3.5 ring-1 ring-border/40 transition-colors hover:bg-secondary/70"
            >
              <p className="text-xs text-muted-foreground">Case</p>
              <p className="font-medium">{caseRow.case_code}</p>
            </Link>
          ) : null}

          {fee ? (
            <div className="rounded-2xl bg-secondary/40 px-4 py-3 text-sm">
              <p className="text-xs text-muted-foreground">Fee schedule</p>
              <p className="font-medium">
                {fee.fee_code} — {fee.name}
              </p>
            </div>
          ) : null}

          {gateway ? (
            <div className="rounded-2xl bg-secondary/40 px-4 py-3 text-sm">
              <p className="text-xs text-muted-foreground">Gateway</p>
              <p className="font-medium">
                {gateway.name} ({gateway.code})
              </p>
            </div>
          ) : null}

          {payment.notes ? (
            <div className="rounded-2xl border border-dashed border-border/80 px-4 py-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm">{payment.notes}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
