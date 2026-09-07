import { notFound } from "next/navigation";

import { EmployerCompanyForm } from "@/app/(dashboard)/admin/companies/company-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { COUNTRY_OPTIONS } from "@/lib/validations/employer-company";

export default async function EditEmployerCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: company, error } = await supabase
    .from("employer_companies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !company) notFound();

  const knownCountry = COUNTRY_OPTIONS.some(
    (c) => c.code === company.country_code
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href={`/admin/companies/${company.id}`}
            label="Back to company"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit company
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {company.trade_name || company.legal_name} · {company.company_code}
          </p>
        </div>
        <StatusBadge tone={statusTone(company.status)}>
          {formatStatusLabel(company.status)}
        </StatusBadge>
      </div>

      <EmployerCompanyForm
        mode="edit"
        companyId={company.id}
        defaultValues={{
          companyCode: company.company_code,
          legalName: company.legal_name,
          tradeName: company.trade_name ?? "",
          countryCode: knownCountry ? company.country_code : "SA",
          city: company.city ?? "",
          address: company.address ?? "",
          contactPerson: company.contact_person ?? "",
          contactPhone: company.contact_phone ?? "",
          contactEmail: company.contact_email ?? "",
          licenseOrCrNumber: company.license_or_cr_number ?? "",
          status: company.status,
          notes: company.notes ?? "",
        }}
      />
    </div>
  );
}
