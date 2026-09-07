import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CompanyDetailView } from "@/components/companies/company-detail-view";
import { PageBackLink } from "@/components/layout/page-back-link";
import { ListFlashToast } from "@/components/layout/list-flash-toast";
import { getEmployerCompanyDetail } from "@/lib/companies/get-company-detail";

export default async function EmployerCompanyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  const result = await getEmployerCompanyDetail(id);

  if (!result.company) notFound();

  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <ListFlashToast
          created={flash.created === "1"}
          updated={flash.updated === "1"}
          createdMessage="Employer company created."
          updatedMessage="Employer company updated."
          toastId={`company-${id}`}
        />
      </Suspense>

      <PageBackLink href="/admin/companies" label="Back to companies" />
      <CompanyDetailView
        company={result.company}
        jobOrders={result.jobOrders}
        documents={result.documents}
        companyPayments={result.companyPayments}
        stats={result.stats}
      />
    </div>
  );
}
