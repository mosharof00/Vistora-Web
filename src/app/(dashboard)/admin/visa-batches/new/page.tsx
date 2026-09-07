import { VisaBatchForm } from "@/app/(dashboard)/admin/visa-batches/visa-batch-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { createClient } from "@/lib/supabase/server";

export default async function NewVisaBatchPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("job_orders")
    .select("id, order_code, title, status")
    .order("created_at", { ascending: false });

  const preferred = (orders ?? []).filter((o) =>
    ["draft", "open", "fulfilled"].includes(o.status)
  );
  const source =
    preferred.length > 0
      ? preferred
      : (orders ?? []);

  // Keep a deep-linked order even if it's closed/cancelled.
  if (
    params.order &&
    !source.some((o) => o.id === params.order) &&
    orders?.some((o) => o.id === params.order)
  ) {
    const linked = orders.find((o) => o.id === params.order);
    if (linked) source.unshift(linked);
  }

  const orderOptions = source.map((o) => ({
    id: o.id,
    label: `${o.order_code} — ${o.title}`,
  }));

  const prefillOrder =
    params.order && orderOptions.some((o) => o.id === params.order)
      ? params.order
      : orderOptions[0]?.id ?? "";
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <PageBackLink href="/admin/visa-batches" label="Back to visa batches" />
        <h1 className="text-2xl font-semibold tracking-tight">Add visa batch</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Link a visa block to a job order and set quota.
        </p>
      </div>
      <VisaBatchForm
        mode="create"
        orders={orderOptions}
        defaultValues={{
          batchCode: "",
          title: "",
          jobOrderId: prefillOrder,
          visaNumber: "",
          visaIdNumber: "",
          quotaCount: 10,
          proOffice: "",
          status: "open",
          openedAt: new Date().toISOString().slice(0, 10),
          closedAt: "",
          notes: "",
        }}
      />
    </div>
  );
}
