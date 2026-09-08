import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { PaymentGatewaysTable } from "@/app/(dashboard)/admin/payment-gateways/payment-gateways-table";
import { PaymentGatewaysFlashToast } from "@/app/(dashboard)/admin/payment-gateways/payment-gateways-flash-toast";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function AdminPaymentGatewaysPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_gateways")
    .select(
      "id, code, name, kind, account_number, bank_name, is_active, sort_order"
    )
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load payment gateways: {error.message}
      </div>
    );
  }

  const rows = data ?? [];
  const activeCount = rows.filter((r) => r.is_active).length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <PaymentGatewaysFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment Gateways
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} total · {activeCount} active
          </p>
        </div>
        <Link
          href="/admin/payment-gateways/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add gateway
        </Link>
      </div>

      <PaymentGatewaysTable gateways={rows} />
    </div>
  );
}
