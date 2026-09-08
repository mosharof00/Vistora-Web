import { CurrencyForm } from "@/app/(dashboard)/admin/currencies/currency-form";
import { PageBackLink } from "@/components/layout/page-back-link";

export default function NewCurrencyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <PageBackLink href="/admin/currencies" label="Back to currencies" />
        <h1 className="text-2xl font-semibold tracking-tight">Add currency</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ISO code is permanent once created (referenced by payments and orders).
        </p>
      </div>
      <CurrencyForm
        mode="create"
        defaultValues={{
          code: "",
          name: "",
          symbol: "",
          decimalPlaces: 2,
          isActive: true,
        }}
      />
    </div>
  );
}
