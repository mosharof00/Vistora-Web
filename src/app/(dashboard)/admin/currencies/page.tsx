import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { CurrenciesTable } from "@/app/(dashboard)/admin/currencies/currencies-table";
import { CurrenciesFlashToast } from "@/app/(dashboard)/admin/currencies/currencies-flash-toast";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function AdminCurrenciesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("currencies")
    .select("code, name, symbol, decimal_places, is_active")
    .order("code", { ascending: true });

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load currencies: {error.message}
      </div>
    );
  }

  const rows = data ?? [];
  const activeCount = rows.filter((r) => r.is_active).length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <CurrenciesFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Currencies</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} total · {activeCount} active
          </p>
        </div>
        <Link
          href="/admin/currencies/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add currency
        </Link>
      </div>

      <CurrenciesTable currencies={rows} />
    </div>
  );
}
