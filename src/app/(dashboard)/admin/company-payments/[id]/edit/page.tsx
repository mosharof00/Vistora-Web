import { notFound } from "next/navigation";

import { CompanyPaymentForm } from "@/app/(dashboard)/admin/company-payments/company-payment-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatStatusLabel, statusTone } from "@/lib/status";

export default async function EditCompanyPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: payment, error },
    { data: companies },
    { data: orders },
    { data: gateways },
    { data: currencies },
  ] = await Promise.all([
    supabase.from("company_payments").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("employer_companies")
      .select("id, company_code, trade_name, legal_name")
      .order("legal_name"),
    supabase
      .from("job_orders")
      .select("id, order_code, title, employer_company_id")
      .order("created_at", { ascending: false }),
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

  if (error || !payment) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href="/admin/company-payments"
            label="Back to company payments"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit company payment
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {payment.reference_no || payment.id.slice(0, 8)}
          </p>
        </div>
        <StatusBadge tone={statusTone(payment.kind)}>
          {formatStatusLabel(payment.kind)}
        </StatusBadge>
      </div>

      <CompanyPaymentForm
        mode="edit"
        paymentId={payment.id}
        companies={(companies ?? []).map((c) => ({
          id: c.id,
          label: `${c.company_code} — ${c.trade_name || c.legal_name}`,
        }))}
        orders={(orders ?? []).map((o) => ({
          id: o.id,
          companyId: o.employer_company_id,
          label: `${o.order_code} — ${o.title}`,
        }))}
        gateways={(gateways ?? []).map((g) => ({
          id: g.id,
          label: `${g.name} (${g.code})`,
        }))}
        currencies={currencies ?? []}
        defaultValues={{
          employerCompanyId: payment.employer_company_id,
          jobOrderId: payment.job_order_id ?? "",
          kind: payment.kind,
          amount: Number(payment.amount),
          currencyCode: payment.currency_code,
          amountBdt: payment.amount_bdt != null ? Number(payment.amount_bdt) : null,
          paymentGatewayId: payment.payment_gateway_id ?? "",
          method: payment.method,
          referenceNo: payment.reference_no ?? "",
          paidAt: payment.paid_at.slice(0, 10),
          notes: payment.notes ?? "",
        }}
      />
    </div>
  );
}
