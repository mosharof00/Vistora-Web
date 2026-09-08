import { notFound } from "next/navigation";

import { FeeScheduleForm } from "@/app/(dashboard)/admin/fee-schedules/fee-schedule-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function EditFeeSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: schedule, error }, { data: categories }] = await Promise.all([
    supabase.from("fee_schedules").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("job_categories")
      .select("id, name")
      .order("name", { ascending: true }),
  ]);

  if (error || !schedule) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href="/admin/fee-schedules"
            label="Back to fee schedules"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit fee schedule
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{schedule.name}</p>
        </div>
        <StatusBadge tone={schedule.is_active ? "success" : "neutral"}>
          {schedule.is_active ? "Active" : "Inactive"}
        </StatusBadge>
      </div>

      <FeeScheduleForm
        mode="edit"
        scheduleId={schedule.id}
        categories={categories ?? []}
        defaultValues={{
          name: schedule.name,
          feeCode: schedule.fee_code,
          amountBdt: Number(schedule.amount_bdt),
          currency: schedule.currency,
          countryCode: (schedule.country_code as FeeCountry) ?? "",
          jobCategoryId: schedule.job_category_id ?? "",
          notes: schedule.notes ?? "",
          isActive: schedule.is_active,
        }}
      />
    </div>
  );
}

type FeeCountry = "" | "SA" | "AE" | "QA" | "KW" | "OM" | "BH" | "MY" | "SG" | "BD";
