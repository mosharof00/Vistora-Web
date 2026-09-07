import { EmployerCompanyForm } from "@/app/(dashboard)/admin/companies/company-form";
import { PageBackLink } from "@/components/layout/page-back-link";

export default function NewEmployerCompanyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <PageBackLink href="/admin/companies" label="Back to companies" />
        <h1 className="text-2xl font-semibold tracking-tight">Add company</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a foreign employer record for job orders and documents.
        </p>
      </div>
      <EmployerCompanyForm
        mode="create"
        defaultValues={{
          companyCode: "",
          legalName: "",
          tradeName: "",
          countryCode: "SA",
          city: "",
          address: "",
          contactPerson: "",
          contactPhone: "",
          contactEmail: "",
          licenseOrCrNumber: "",
          status: "active",
          notes: "",
        }}
      />
    </div>
  );
}
