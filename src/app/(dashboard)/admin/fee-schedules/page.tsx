import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { FeeSchedulesTable } from "@/app/(dashboard)/admin/fee-schedules/fee-schedules-table";
import { FeeSchedulesFlashToast } from "@/app/(dashboard)/admin/fee-schedules/fee-schedules-flash-toast";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function AdminFeeSchedulesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fee_schedules")
    .select(
      "id, name, fee_code, amount_bdt, currency, country_code, is_active, job_categories(name)"
    )
    .order("name", { ascending: true });

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load fee schedules: {error.message}
      </div>
    );
  }

  const rows = data ?? [];
  const activeCount = rows.filter((r) => r.is_active).length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <FeeSchedulesFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Fee Schedules
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} total · {activeCount} active
          </p>
        </div>
        <Link
          href="/admin/fee-schedules/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add fee schedule
        </Link>
      </div>

      <FeeSchedulesTable schedules={rows} />
    </div>
  );
}
