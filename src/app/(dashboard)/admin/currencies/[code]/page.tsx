import { notFound } from "next/navigation";

import { CurrencyForm } from "@/app/(dashboard)/admin/currencies/currency-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function EditCurrencyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode).trim().toUpperCase();
  const supabase = await createClient();
  const { data: currency, error } = await supabase
    .from("currencies")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error || !currency) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink href="/admin/currencies" label="Back to currencies" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit currency
          </h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {currency.code}
          </p>
        </div>
        <StatusBadge tone={currency.is_active ? "success" : "neutral"}>
          {currency.is_active ? "Active" : "Inactive"}
        </StatusBadge>
      </div>

      <CurrencyForm
        mode="edit"
        defaultValues={{
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol,
          decimalPlaces: currency.decimal_places,
          isActive: currency.is_active,
        }}
      />
    </div>
  );
}
