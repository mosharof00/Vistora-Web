import { CompanyPaymentForm } from "@/app/(dashboard)/admin/company-payments/company-payment-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { createClient } from "@/lib/supabase/server";

export default async function NewCompanyPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const [
    { data: companies },
    { data: orders },
    { data: gateways },
    { data: currencies },
  ] = await Promise.all([
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

  const companyOptions = (companies ?? []).map((c) => ({
    id: c.id,
    label: `${c.company_code} — ${c.trade_name || c.legal_name}`,
  }));

  const prefillCompany =
    params.company && companyOptions.some((c) => c.id === params.company)
      ? params.company
      : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <PageBackLink
          href="/admin/company-payments"
          label="Back to company payments"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          Record company payment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log an advance, fee, or reimbursement with an employer.
        </p>
      </div>
      <CompanyPaymentForm
        mode="create"
        companies={companyOptions}
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
          employerCompanyId: prefillCompany,
          jobOrderId: "",
          kind: "investment_out",
          amount: 0,
          currencyCode: "BDT",
          amountBdt: null,
          paymentGatewayId: "",
          method: "bank",
          referenceNo: "",
          paidAt: new Date().toISOString().slice(0, 10),
          notes: "",
        }}
      />
    </div>
  );
}
