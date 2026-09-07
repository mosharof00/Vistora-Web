import { JobOrderForm } from "@/app/(dashboard)/admin/job-orders/job-order-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { createClient } from "@/lib/supabase/server";

export default async function NewJobOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: companies }, { data: categories }, { data: currencies }] =
    await Promise.all([
      supabase
        .from("employer_companies")
        .select("id, company_code, trade_name, legal_name")
        .eq("status", "active")
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

  const companyOptions = (companies ?? []).map((c) => ({
    id: c.id,
    label: `${c.company_code} — ${c.trade_name || c.legal_name}`,
  }));

  const categoryOptions = (categories ?? []).map((c) => ({
    id: c.id,
    label: c.name,
  }));

  const prefillCompany =
    params.company && companyOptions.some((c) => c.id === params.company)
      ? params.company
      : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <PageBackLink href="/admin/job-orders" label="Back to job orders" />
        <h1 className="text-2xl font-semibold tracking-tight">Add job order</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set worker quota, salary, and who provides tickets.
        </p>
      </div>
      <JobOrderForm
        mode="create"
        companies={companyOptions}
        categories={categoryOptions}
        currencies={currencies ?? []}
        defaultValues={{
          orderCode: "",
          title: "",
          employerCompanyId: prefillCompany,
          jobCategoryId: categoryOptions[0]?.id ?? "",
          countryCode: "SA",
          requiredCount: 10,
          status: "open",
          ticketProvision: "go_only",
          salaryAmount: null,
          salaryCurrencyCode: "SAR",
          salaryBdt: null,
          salaryOfferText: "",
          contractDurationMonths: 24,
          receivedAt: "",
          notes: "",
        }}
      />
    </div>
  );
}
