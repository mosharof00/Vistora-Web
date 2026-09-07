import { notFound } from "next/navigation";

import { JobOrderForm } from "@/app/(dashboard)/admin/job-orders/job-order-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatStatusLabel, statusTone } from "@/lib/status";

export default async function EditJobOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: order, error },
    { data: companies },
    { data: categories },
    { data: currencies },
  ] = await Promise.all([
    supabase.from("job_orders").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("employer_companies")
      .select("id, company_code, trade_name, legal_name")
      .order("legal_name"),
    supabase
      .from("job_categories")
      .select("id, name")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("currencies")
      .select("code, name")
      .eq("is_active", true)
      .order("code"),
  ]);

  if (error || !order) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href={`/admin/job-orders/${order.id}`}
            label="Back to order"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit job order
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.order_code} · {order.title}
          </p>
        </div>
        <StatusBadge tone={statusTone(order.status)}>
          {formatStatusLabel(order.status)}
        </StatusBadge>
      </div>

      <JobOrderForm
        mode="edit"
        orderId={order.id}
        companies={(companies ?? []).map((c) => ({
          id: c.id,
          label: `${c.company_code} — ${c.trade_name || c.legal_name}`,
        }))}
        categories={(categories ?? []).map((c) => ({
          id: c.id,
          label: c.name,
        }))}
        currencies={currencies ?? []}
        defaultValues={{
          orderCode: order.order_code,
          title: order.title,
          employerCompanyId: order.employer_company_id,
          jobCategoryId: order.job_category_id,
          countryCode: order.country_code,
          requiredCount: order.required_count,
          status: order.status,
          ticketProvision: order.ticket_provision,
          salaryAmount: order.salary_amount,
          salaryCurrencyCode: order.salary_currency_code ?? "",
          salaryBdt: order.salary_bdt,
          salaryOfferText: order.salary_offer_text ?? "",
          contractDurationMonths: order.contract_duration_months,
          receivedAt: order.received_at ?? "",
          notes: order.notes ?? "",
        }}
      />
    </div>
  );
}
