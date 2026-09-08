import { FeeScheduleForm } from "@/app/(dashboard)/admin/fee-schedules/fee-schedule-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { createClient } from "@/lib/supabase/server";

export default async function NewFeeSchedulePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("job_categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <PageBackLink
          href="/admin/fee-schedules"
          label="Back to fee schedules"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          Add fee schedule
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pricing used when recording candidate payments.
        </p>
      </div>
      <FeeScheduleForm
        mode="create"
        categories={categories ?? []}
        defaultValues={{
          name: "",
          feeCode: "",
          amountBdt: 0,
          currency: "BDT",
          countryCode: "",
          jobCategoryId: "",
          notes: "",
          isActive: true,
        }}
      />
    </div>
  );
}
